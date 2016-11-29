import awsIot from 'aws-iot-device-sdk';
import path from 'path';
import config from 'config';
import awsCli from 'aws-cli-js';
import fs from 'fs-promise';

const Options = awsCli.Options;
const Aws = awsCli.Aws;

class AWS {

  constructor(thingName, keyPath, certPath) {
    this.thing = awsIot.thingShadow({
      keyPath: keyPath,
      certPath: certPath,
      caPath: path.join(config.get('uploads:keys:path'), '/root-CA.crt'),
      clientId: thingName,
      region: 'eu-central-1'
    });

    this.thingName = thingName;

    this.state = {};

    this.thing.on('connect', () => {
      this.thing.register(thingName);

      this.thing.get(thingName, another => console.log('real state', another));
    });
  }

  subscribe(socket, key) {
    this.thing.on('foreignStateChange', (thingName, operation, stateObject) => {
      this.state = stateObject;
      socket.emit('message', {type: key, value: stateObject.state.reported});
    });
  }

  changeState(data) {
    console.log('trying to send');
    let payload = {
      state: {
        desired: data
      }
    };
    this.thing.update(this.thingName, payload);
  }

  get status() {
    return this.state;
  }

  static initUser(accessKey, secretKey, bucketName) {
    const options = new Options(accessKey, secretKey);
    const aws = new Aws(options);
    const roleName = 'general' + Date.now();
    let roleArn = '';
    return aws.command(`s3api create-bucket --bucket ${bucketName} --create-bucket-configuration LocationConstraint=eu-central-1`)
      .then(result => {
        console.log('create bucket', result);
        const doorFile = path.join(__dirname, 'templates/door.json');
        return aws.command(`s3api put-object --bucket ${bucketName} --key door.json --body ${doorFile}`)
      })
      .then(result => {
        console.log('put json', result);
        const iampolicyFile = path.join(__dirname, 'templates/iampolicy.json');
        return aws.command(`iam create-role --role-name ${ roleName } --assume-role-policy-document file://${iampolicyFile}`)
      })
      .then(result => {
        console.log('create-role', result);
        const policyFile = path.join(__dirname, 'templates/rolepolicy.json');
        roleArn = JSON.parse(result.raw).Role.Arn;
        return aws.command(`iam create-policy --policy-name "${ roleName }_policy" --policy-document file://${ policyFile }`)
      })
      .then(result => {
        console.log('create-policy', result);
        return Promise.all([
          aws.command(`iam attach-role-policy --role-name "${ roleName }" --policy-arn "${ JSON.parse(result.raw).Policy.Arn }"`),
          Promise.resolve(roleArn)
        ])
      })
  }

  static createThing(accessKey, secretKey, thingName, lambdaArn, user, bucketName) {
    const options = new Options(accessKey, secretKey);
    const aws = new Aws(options);
    let thingArn = '';
    let certId = '';
    let certArn = '';
    const certName = `${Date.now()}${Math.floor(Math.random() * 1000)}-pem.crt`;
    const pubKeyName = `${Date.now()}${Math.floor(Math.random() * 1000)}-private.pem.key`;
    const prvKeyName = `${Date.now()}${Math.floor(Math.random() * 1000)}-public.pem.key`;
    const dirPath = path.join(config.get('uploads:keys:path'), user);
    const topicRuleFile = path.join(__dirname, `topic-rule${Math.floor(Math.random() * 100000)}.json`);
    return aws.command(`iot create-thing --thing-name "${thingName}"`)
      .then(result => {
        console.log('create-thing', result);
        thingArn = JSON.parse(result.raw).thingArn;
        const ruleJSON = {
          actions: [
            {
              lambda: {
                functionArn: lambdaArn
              }
            }
          ],
          sql: `SELECT * from '$aws/things/${thingName}/shadow/update'`
        };
        console.log('Temporary policy json', ruleJSON);
        const rule = JSON.stringify(ruleJSON);
        console.log('Stringifiec', rule);
        return fs.writeFile(topicRuleFile, rule);
      })
      .then(result => {
        console.log('topic-rule json', result);
        return aws.command(`iot create-topic-rule --rule-name "${thingName}" --topic-rule-payload file://${topicRuleFile}`);
      })
      .then(result => {
        console.log('create rule', result);
        return fs.unlink(topicRuleFile);
      })
      .then(result => {
        console.log('deleted temp file', result);
        return aws.command('iot create-keys-and-certificate --set-as-active');
      })
      .then(result => {
        console.log('create-keys', result);
        const data = JSON.parse(result.raw);
        certId = data.certificateId;
        certArn = data.certificateArn;
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        return Promise.all([
          fs.writeFile(
            path.join(dirPath, certName),
            data.certificatePem
          ),
          Promise.resolve(data)
        ]);
      })
      .then(result => {
        console.log('save cert', result);
        return Promise.all([
          fs.writeFile(
            path.join(dirPath, prvKeyName),
            result[1].keyPair.PrivateKey
          ),
          Promise.resolve(result[1])
        ]);
      })
      .then(result => {
        console.log('save private', result);
        return fs.writeFile(
          path.join(dirPath, pubKeyName),
          result[1].keyPair.PublicKey
        );
      })
      .then(result => {
        console.log('save public', result);
        Promise.all([
          aws.command(`s3api put-object --bucket ${bucketName} --key ${thingName}/${certName} --body ${path.join(dirPath, certName)}`),
          aws.command(`s3api put-object --bucket ${bucketName} --key ${thingName}/${prvKeyName} --body ${path.join(dirPath, prvKeyName)}`),
          aws.command(`s3api put-object --bucket ${bucketName} --key ${thingName}/${pubKeyName} --body ${path.join(dirPath, pubKeyName)}`)
        ]);
      })
      .then(result => {
        console.log('keys s3 storing', result);
        const policyFile = path.join(__dirname, 'templates/policy.json');
        return aws.command(`iot create-policy --policy-name "testPolicy${Date.now()}" --policy-document file://${policyFile}`);
      })
      .then(result => {
        console.log('create-policy', result);
        return aws.command(`iot attach-principal-policy --principal "${certArn}" --policy-name "${JSON.parse(result.raw).policyName}"`);
      })
      .then(result => {
        console.log('attach-policy', result);
        return Promise.all([
          aws.command(`iot attach-thing-principal --thing-name ${thingName} --principal ${certArn}`),
          Promise.resolve({certName: certName, pubKeyName: pubKeyName, prvKeyName: prvKeyName})
        ])
      })
  }

  static createLambda(accessKey, secretKey, roleArn) {
    const options = new Options(accessKey, secretKey);
    const aws = new Aws(options);
    const lambdaFile = path.join(__dirname, 'templates/lambda.js.zip');
    return aws.command(`lambda create-function --function-name iot${ Date.now() } --role "${roleArn}" --runtime=nodejs4.3 --handler=index.handler --zip-file fileb://${lambdaFile} --timeout 7`)
  }

}

export default AWS;
