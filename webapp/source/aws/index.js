import awsIot from 'aws-iot-device-sdk';
import path from 'path';
import config from 'config';

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
      this.thing.on('status', (receivedThingName, stat, clientToken, stateObject) => this.state = stateObject);
      this.thing.get(thingName, another => console.log('real state', another));
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

}

// const lights = awsIot.thingShadow({
//   keyPath: path.join(__dirname, '/keys/lights/d6b934217c-private.pem.key'),
//   certPath: path.join(__dirname, '/keys/lights/d6b934217c-certificate.pem.crt'),
//   caPath: path.join(__dirname, '/keys/root-CA.crt'),
//   clientId: 'lights',
//   region: 'eu-central-1'
// });
//
// lights.on('connect', () => {
//   lights.register('lights');
//   lights.get('lights', another => console.log('real state', another));
// });
//
//
//
// const changeState = data => {
//   console.log('trying to send');
//   let payload = {
//     state: {
//       desired: data
//     }
//   };
//   lights.update('lights', payload);
// };

export default AWS;
