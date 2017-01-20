import React, {Component} from 'react';
import Menu from '../../components/Menu';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router';
const Highlight = require('react-highlight');
const styles = require('./styles.scss');

function Board() {
  return (<div>
      <h1>Connect Arduino to the board like in the picture below.</h1>
      <img src="./img/1.png" />
    </div>);
}

function Ethernet() {
  return (<div>
      <h1>Connect Ethernet module to the board and Arduino like in the picture below.</h1>
      <pre>
      {'Arduino\tEthernet\n' + '5v\tVCC\n' + 'GND\tGND\n' + '53\tCS\n' + '52\tSCK\n' + '50\tSO\n' + '51\tST(SI)\n'}
      </pre>
      <img src="./img/2.png" />
    </div>);
}

function Raspberry() {
  return (<div>
      <h1>Connect Arudino to Raspberry using Ethernet cable like in the picture below.</h1>
      <img src="./img/3.png" />
    </div>);
}

function LightSensor() {
  const lambda = `'use strict'
      var AWS = require('aws-sdk');
      exports.handler = (event, context, callback) => {
      var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
      var newState = Object.assign({}, event);
      newState.alarm = false;
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      var params = {
        Bucket: 'your_bucket_name',
        Key: 'room.json'
      };
      s3.getObject(params, function (err, data) {
        if (err) return err
        } else {
            var result = JSON.parse(data.Body.toString('utf-8'));
            var limit = result.light;
            if (parseInt(newState.value) > limit) {
                newState.alarm = true;
            }
            var payload = {
                state: {
                    reported: newState
                }
            };
            iotdata.updateThingShadow({
                payload: JSON.stringify(payload),
                thingName: 'light-report'
            }, function (error, data) {
                if (error) {
                    return error
                }
            });
      });
    };`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
</Highlight>);
  return (<div>
      <li>Connect Light sensor to Arduino using like in the picture below.</li>
      <pre>
      {'Arduino\tLightSensor\n' + '5v\tVCC\n' + 'GND\tGND\n' + 'A0\tA0\n'}
      </pre>
      <img src="./img/light/1.png" />
      <li>Let's create your first thing on AWS IoT. You should register on <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> and choose region <mark>Frankfurt</mark>. Go to AWS IoT page and create your first thing.</li>
      <img src="./img/cr.png" />
      <li>{`It will be good If you have things group by actions. Create type for things.`}</li>
      <img src="./img/light/3.png" />
      <li>{`Light sensor does only one action - report light statistic. That's why we create "Report" type.`}</li>
      <img src="./img/4.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/light/2.png" />
      <li>{`You thing was created.`}</li>
      <img src="./img/light/4.png" />
      <li>Note HTTPS link and  MQTT Update to thing shadow</li>
      Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
      Example: <code>$aws/things/light-report/shadow/update</code>
      <li>{`Let's create rule that will be invoked as soon as thing state changes.`}
      <ul><li>{`Create permission for `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function using `}<a target="_blank" rel="noreferrer" href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html">AWS IAM Role</a>.</li>
      <li>{`Go to the AWS IAM Role and create the role. Choose services like in the picture below`}</li>
      <img src="./img/light/5.png" />
      <li>{`Now you should create lambda function. Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
      <img src="./img/light/6.png" />
      <img src="./img/light/7.png" />
      HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        <div className={styles.code}>
          {editor}
        </div>
        <li>Now you must add inline policy. Click 'Inline Policies' and create policy like in the picture below.</li>
        <img src="./img/light/12.png" />
        <li>Create custom policy like in the picture below.</li>
        <img src="./img/light/13.png" />
        <li>Fill all fields like in the picture below.</li>
        <img src="./img/light/14.png" />
        <Highlight>
        {`{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents",
                        "iot:*",
                        "s3:*",
                        "sns:*"
                    ],
                    "Resource": "*"
                }
            ]
        }`}
        </Highlight>
      <li>{`Whoooh. Let's create our rule. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
      <p>Use topic for update thing shadow state</p>
      <code>$aws/things/light-report/shadow/update</code>
      <img src="./img/light/8.png" />
      </ul>
      </li>
      <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
      <img src="./img/light/9.png" />
      <li>{'Choose OS and platform like in the picture below'}</li>
      <img src="./img/light/10.png" />
      <li>{'Download certificates. You will use it in next steps'}</li>
      <img src="./img/light/11.png" />
      <li>{'Ununarchive zip File'}</li>
      <code>unzip connect_device_package.zip</code>
      <li>Add execution permissions</li>
      <code>chmod +x start.sh</code>
      <li>Run the start script. Messages from your thing will appear below</li>
      <code>./start.sh</code>
      <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
      <Highlight>{`const path = {
    root: '/keys/root-CA.crt',
    gas: {
        private: '/keys/gas-report.private.key',
        cert: '/keys/gas-report.cert.pem'
    },
    light: {
        private: `}<mark>'/keys/light-report.private.key',</mark><br/>
{`        cert: `}<mark>'/keys/light-report.cert.pem'</mark>{`
    },
    pir: {
        private: '/keys/pir-report.private.key',
        cert: '/keys/pir-report.cert.pem'
    },
    door: {
        private: '/keys/door.private.key',
        cert: '/keys/door.cert.pem'
    },
    temp: {
        private: '/keys/temp-report.private.key',
        cert: '/keys/temp-report.cert.pem'
    }
};
module.exports = Object.assign({}, path);`}</Highlight>
      </div>);
}

function TempSensor() {
  const lambda = `'use strict'
  var AWS = require('aws-sdk');
  exports.handler = (event, context, callback) => {
      var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
      var newState = Object.assign({}, event);
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      var params = {
          Bucket: 'your_bucket_name',
          Key: 'room.json'
      };
    var payload = {
        state: {
            reported: newState
        }
    };
    iotdata.updateThingShadow({
        payload: JSON.stringify(payload),
        thingName: 'temp-report'
    }, function (error, data) {
        if (error) {
            return error;
        }
    });
  };`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
</Highlight>);
  return (<div>
      <li>Connect Temperature sensor to Arduino like in the picture below.</li>
      <img src="./img/temperature/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/temperature/2.png" />
        <li>{`You thing was created.`}</li>
        <img src="./img/temperature/8.png" />
        <li>Note HTTPS link and  MQTT Update to thing shadow</li>
        Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        Example: <code>$aws/things/temp-report/shadow/update</code>
      <li>{`Let's create rule that will be invoked when thing state will change.`}<ul>
        <li>{`You need to create `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function with permission for some  AWS services that we used.`}</li>
        <li>{`Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
        <img src="./img/temperature/6.png" />
        <img src="./img/temperature/7.png" />
        HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
          <div className={styles.code}>
            {editor}
          </div>
        <li>{`Go to AWS IoT choose tab "Rule" and create new one. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
        <p>Use topic for update thing shadow state</p>
        <code>$aws/things/temp-report/shadow/update</code>
        <img src="./img/temperature/4.png" />
        </ul>
      </li>
      <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
      <img src="./img/temperature/9.png" />
      <li>{'Choose OS and platform like in the picture below'}</li>
      <img src="./img/temperature/10.png" />
      <li>{'Download certificates. You will use it in next steps'}</li>
      <img src="./img/temperature/11.png" />
      <li>{'Ununarchive zip File'}</li>
      <code>unzip connect_device_package.zip</code>
      <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
      <Highlight>{`const path = {
    root: '/keys/root-CA.crt',
    gas: {
        private: '/keys/gas-report.private.key',
         cert: '/keys/gas-report.cert.pem'
    },
    light: {
        private: '/keys/light-report.private.key',
        cert:'/keys/light-report.cert.pem'
    },
    pir: {
        private: '/keys/pir-report.private.key',
        cert: '/keys/pir-report.cert.pem'
    },
    door: {
        private: '/keys/door.private.key',
        cert: '/keys/door.cert.pem'
    },
    temp: {
        private: `}<mark>'/keys/temp-report.private.key',</mark><br/>
{`           cert: `} <mark>'/keys/temp-report.cert.pem'</mark>{`
    }
};
module.exports = Object.assign({}, path);`}</Highlight>
      </div>);
}

function KeySensor() {
  const lambda = `'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var params = {
        Bucket: 'your_bucket_name,
        Key: 'room.json'
    };
    s3.getObject(params, function (err, data) {
        if (err) return err
            var result = JSON.parse(data.Body.toString('utf-8'));
            var response = {
                open: false
            };
            if (event.hasOwnProperty('password')) {
                if (event.password == result.password) {
                    response.open = true;
                }
            } else if (event.hasOwnProperty('id')) {
                if (result.cards.indexOf(event.id) != -1) {
                    response.open = true;
                }
            }
            var payload = {
                state: {
                    reported: response
                }
            };
            iotdata.updateThingShadow({
                payload: JSON.stringify(payload),
                thingName: 'door'
            }, function (error, data) {
                if (error) {
                    return error
                }
                setTimeout(function () {
                    payload.state.reported.open = false;
                    iotdata.updateThingShadow({
                        payload: JSON.stringify(payload),
                        thingName: 'door'
                    }, function (error, data) {
                        if (error) {
                            return error
                        }
                    });
                }, result.doorTimeout)
            });
    });
};`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
  </Highlight>);
  return (<div>
      <li>Connect Keypad to Arduino like in the picture below.</li>
      <img src="./img/key/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/key/2.png" />
        <li>{`You thing was created.`}</li>
        <img src="./img/key/8.png" />
        <li>Note HTTPS link and  MQTT Update to thing shadow</li>
        Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        Example: <code>$aws/things/door-report/shadow/update</code>
        <li>{`Let's create rule that will be invoked when thing state will change.`}<ul>
          <li>{`You need to create `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function with permission for some  AWS services that we used.`}</li>
          <li>{`Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
            <img src="./img/key/5.png" />
            <img src="./img/key/6.png" />
          HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
            <div className={styles.code}>
              {editor}
            </div>
          <li>{`You need to set timeout of function bigger then door timeout`}</li>
              <img src="./img/key/10.png" />
          <li>{`Go to AWS IoT choose tab "Rule" and create new one. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
          <p>Use topic for update thing shadow state</p>
          <code>$aws/things/temp-report/shadow/update</code>
            <img src="./img/key/7.png" />
            <img src="./img/key/9.png" />
          </ul>
        </li>
        <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
        <img src="./img/key/11.png" />
        <li>{'Choose OS and platform like in the picture below'}</li>
        <img src="./img/temperature/10.png" />
        <li>{'Download certificates. You will use it in next steps'}</li>
        <img src="./img/key/12.png" />
        <li>{'Ununarchive zip File'}</li>
        <code>unzip connect_device_package.zip</code>
        <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
        <Highlight>{`const path = {
      root: '/keys/root-CA.crt',
      gas: {
          private: '/keys/gas-report.private.key',
       cert: '/keys/gas-report.cert.pem'
      },
      light: {
          private: '/keys/light-report.private.key',
          cert:'/keys/light-report.cert.pem'
      },
      pir: {
          private: '/keys/pir-report.private.key',
          cert: '/keys/pir-report.cert.pem'
      },
      door: {
          private: `}<mark>'/keys/door.private.key',</mark><br/>
{`             cert: `} <mark>'/keys/door.cert.pem'</mark>{`
      },
      temp: {
          private: '/keys/temp-report.private.key',
          cert: '/keys/temp-report.cert.pem'
      }
  };
  module.exports = Object.assign({}, path);`}</Highlight>
    </div>);
}

function PirSensor() {
  const lambda = `'use strict'
  var AWS = require('aws-sdk');
  exports.handler = (event, context, callback) => {
      var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
      var newState = Object.assign({}, event);
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      var sns = new AWS.SNS();
      var params = {
          Bucket: 'gameiro21k',
          Key: 'room.json'
      };
      iotdata.getThingShadow({
          thingName: 'button-report'
      }, function (err, data) {
          if (err) return err;
              var alarm = JSON.parse(data.payload).state.reported.active;
              if (alarm) {
                  var snsParams = {
                      Message: 'Move',
                      TopicArn: 'arn:aws:sns:eu-west-1:737017133357:sms'
                  };
                  if (newState.value) {
                      sns.publish(snsParams, context.done);
                  }
                  var payload = {
                      state: {
                          reported: newState
                      }
                  };
                  iotdata.updateThingShadow({
                      payload: JSON.stringify(payload),
                      thingName: 'pir-report'
                  }, function (error, data) {
                      if (error) {
                          return console.log(error);
                      }
                  });
              } else {
                  iotdata.updateThingShadow({
                      payload: JSON.stringify({state: {reported: {value: false}}}),
                      thingName: 'pir-report'
                  }, function (error, data) {
                      if (error) {
                          return console.log(error);
                      }
                  });
              }
          }
      });
  };`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
  </Highlight>);
  return (<div>
      <li>Connect Pir Sensor to Arduino like in the picture below.</li>
      <img src="./img/pir/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/pir/2.png" />
        <li>{`You thing was created.`}</li>
        <img src="./img/pir/6.png" />
        <li>Note HTTPS link, MQTT Update to thing shadow and SNS topic</li>
        Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
      Example: <code>$aws/things/pir-report/shadow/update</code><br/>
        Example: <code>arn:aws:sns:eu-west-1:0503593493555:movement</code>
      <li>{`Let's create rule that will be invoked when thing state will change.`}<ul>
        <li>{`You need to create `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function with permission for some  AWS services that we used.`}</li>
        <li>{`Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
          <img src="./img/pir/4.png" />
          <img src="./img/pir/5.png" />
        HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
          <div className={styles.code}>
            {editor}
          </div>
        <li>{`Go to AWS IoT choose tab "Rule" and create new one. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
        <p>Use topic for update thing shadow state</p>
        <code>$aws/things/temp-report/shadow/update</code>
          <img src="./img/pir/8.png" />
          <img src="./img/pir/7.png" />
        </ul>
      </li>
      <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
      <img src="./img/pir/9.png" />
      <li>{'Choose OS and platform like in the picture below'}</li>
      <img src="./img/temperature/10.png" />
      <li>{'Download certificates. You will use it in next steps'}</li>
      <img src="./img/pir/11.png" />
      <li>{'Ununarchive zip File'}</li>
      <code>unzip connect_device_package.zip</code>
      <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
      <Highlight>{`const path = {
    root: '/keys/root-CA.crt',
    gas: {
        private: '/keys/gas-report.private.key',
     cert: '/keys/gas-report.cert.pem'
    },
    light: {
        private: '/keys/light-report.private.key',
        cert:'/keys/light-report.cert.pem'
    },
    pir: {
        private: `}<mark>'/keys/pir-report.private.key',</mark><br/>
{`             cert: `} <mark>'/keys/pir-report.cert.pem'</mark>{`
    },
    door: {
        private: '/keys/door.private.key',
        cert: <mark>'/keys/door.cert.pem'
    },
    temp: {
        private: '/keys/temp-report.private.key',
        cert: '/keys/temp-report.cert.pem'
    }
};
module.exports = Object.assign({}, path);`}</Highlight>
    </div>);
}

function AlarmButton() {
  const lambda = `'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
    var newState = Object.assign({}, event);
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var sns = new AWS.SNS();
    var params = {
        Bucket: 'gameiro21k',
        Key: 'room.json'
    };
            var payload = {
                state: {
                    reported: newState
                }
            };
            var snsParams = {
                    Message: newState.active ? 'Security is active' : 'Security is inactive',
                    TopicArn: 'arn:aws:sns:eu-west-1:737017133357:sms'
            };
            sns.publish(snsParams, context.done);
            iotdata.updateThingShadow({
                payload: JSON.stringify(payload),
                thingName: 'button-report'
            }, function (error, data) {
                if (error) {
                    return console.log(error);
                }
                console.log(data);
            });
};
`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
  </Highlight>);
  return (<div>
      <li>Connect Button to Arduino like in the picture below.</li>
      <img src="./img/button/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/button/2.png" />
        <li>{`You thing was created.`}</li>
        <img src="./img/button/3.png" />
        <li>Note HTTPS link, MQTT Update to thing shadow and SNS topic</li>
        Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
      Example: <code>$aws/things/button-report/shadow/update</code><br/>
        Example: <code>arn:aws:sns:eu-west-1:0503593493555:movement</code>
      <li>{`Let's create rule that will be invoked when thing state will change.`}<ul>
      <li>{`You need to create `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function with permission for some  AWS services that we used.`}</li>
      <li>{`Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
        <img src="./img/button/7.png" />
        <img src="./img/button/8.png" />
      HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        <div className={styles.code}>
          {editor}
        </div>
      <li>{`Go to AWS IoT choose tab "Rule" and create new one. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
      <p>Use topic for update thing shadow state</p>
      <code>$aws/things/temp-report/shadow/update</code>
      <img src="./img/temperature/4.png" />
      </ul>
    </li>
    <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
    <img src="./img/button/5.png" />
    <li>{'Choose OS and platform like in the picture below'}</li>
    <img src="./img/temperature/10.png" />
    <li>{'Download certificates. You will use it in next steps'}</li>
    <img src="./img/button/6.png" />
    <li>{'Ununarchive zip File'}</li>
    <code>unzip connect_device_package.zip</code>
    <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
    <Highlight>{`const path = {
  root: '/keys/root-CA.crt',
  gas: {
      private: `}<mark>'/keys/gas-report.private.key',</mark><br/>
{`         cert: `}<mark>'/keys/gas-report.cert.pem'</mark>{`
  },
  light: {
      private: '/keys/light-report.private.key',
      cert:'/keys/light-report.cert.pem'
  },
  pir: {
      private: '/keys/pir-report.private.key',
      cert: '/keys/pir-report.cert.pem'
  },
  door: {
      private: '/keys/door.private.key',
      cert: '/keys/door.cert.pem'
  },
  temp: {
      private: '/keys/temp-report.private.key',
      cert: '/keys/temp-report.cert.pem'
  }
};
module.exports = Object.assign({}, path);`}</Highlight>
    </div>);
}

function GasSensor() {
  const lambda = `'use strict'
  var AWS = require('aws-sdk');
  exports.handler = (event, context, callback) => {
      var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
      var newState = Object.assign({}, event);
      newState.alarm = false;
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      var params = {
          Bucket: 'your_bucket_name',
          Key: 'room.json'
      };
      s3.getObject(params, function (err, data) {
          if (err) return err
              var result = JSON.parse(data.Body.toString('utf-8'));
              var limit = result.gas;
              if (parseInt(newState.value) > limit) {
                  newState.alarm = true;
              }
              var payload = {
                  state: {
                      reported: newState
                  }
              };
              iotdata.updateThingShadow({
                  payload: JSON.stringify(payload),
                  thingName: 'gas-report'
              }, function (error, data) {
                  if (error) {
                      return error
                  }
              });
      });
  };`;
  const editor = (<Highlight className="language-name-of-snippet">
  {lambda}
  </Highlight>);
  return (<div>
      <li>Connect Gas Sensor to Arduino like in the picture below.</li>
      <img src="./img/gas/1.png" />
      <li>{'Let\'s create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.'}</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/gas/2.png" />
        <li>{`You thing was created.`}</li>
        <img src="./img/gas/3.png" />
        <li>Note HTTPS link and  MQTT Update to thing shadow</li>
        Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        Example: <code>$aws/things/gas-report/shadow/update</code>
      <li>{`Let's create rule that will be invoked when thing state will change.`}<ul>
      <li>{`You need to create `}<a target="_blank" rel="noreferrer" href="https://aws.amazon.com/documentation/lambda/">AWS Lambda</a> {`function with permission for some  AWS services that we used.`}</li>
      <li>{`Go to the AWS Lambda and choose blank function. In the next step just click next. Fill fields like in the picture below. And choose the existing role that we created before.`}</li>
        <img src="./img/gas/4.png" />
        <img src="./img/gas/5.png" />
      HTTP link Example: <code>a2ezk37gw2a8gr.iot.eu-west-1.amazonaws.com</code><br/>
        <div className={styles.code}>
          {editor}
        </div>
      <li>{`Go to AWS IoT choose tab "Rule" and create new one. Fill fields like in the picture below and choose existing Lambda function for action.`}</li>
      <p>Use topic for update thing shadow state</p>
      <code>$aws/things/temp-report/shadow/update</code>
      <img src="./img/temperature/4.png" />
      </ul>
    </li>
    <li>{'Now you should add security for the connection between devices. Go to your think< choose tab "Interact" and click "Connect a device"'}</li>
    <img src="./img/gas/8.png" />
    <li>{'Choose OS and platform like in the picture below'}</li>
    <img src="./img/temperature/10.png" />
    <li>{'Download certificates. You will use it in next steps'}</li>
    <img src="./img/gas/9.png" />
    <li>{'Ununarchive zip File'}</li>
    <code>unzip connect_device_package.zip</code>
    <li>{'Put certificates in "keys" directory (username/Home-Kit/example3/raspberry/keys) and like in code bellow'}</li>
    <Highlight>{`const path = {
  root: '/keys/root-CA.crt',
  gas: {
      private: `}<mark>'/keys/gas-report.private.key',</mark><br/>
{`         cert: `}<mark>'/keys/gas-report.cert.pem'</mark>{`
  },
  light: {
      private: '/keys/light-report.private.key',
      cert:'/keys/light-report.cert.pem'
  },
  pir: {
      private: '/keys/pir-report.private.key',
      cert: '/keys/pir-report.cert.pem'
  },
  door: {
      private: '/keys/door.private.key',
      cert: '/keys/door.cert.pem'
  },
  temp: {
      private: '/keys/temp-report.private.key',
      cert: '/keys/temp-report.cert.pem'
  }
};
module.exports = Object.assign({}, path);`}</Highlight>
    </div>);
}

function RfReader() {
  return (<div>
      <li>Connect RF Reader to NodeMCU like in the picture below.</li>
      <img src="./img/rf/1.png" />
    </div>);
}

function ConfArduino() {
  return (<div>
      <li>Donwload <a target="_blank" rel="noreferrer" href="https://www.arduino.cc/en/main/software">Arduino IDE</a></li>
      <li>Run Arduino IDE</li>
      <div className={styles.code}>
        <code>tar -xvf your_file_name<br/>cd arduino<br/>sudo ./arduino</code>
      </div>
      <li>{`Go to the tab "Tools" and choose right serial port like "/dev/ttyUSB0" in the picture below.`}</li>
      <img src="./img/arduino/1.png" />
      <li>{`Go to the tab "Tools" and choose "Arduino Mega" from Boards list like in the picture below.`}</li>
      <img src="./img/arduino/2.png" />
      <li>{`Go to the tab "File" and choose an example from "Example" list like in the picture below.`}</li>
      <img src="./img/arduino/4.png" />
      <li>{`Verify your code, click the button "Verify" and then run it on Arduino by clicking on the button "Run"`}</li>
      <img src="./img/arduino/3.png" />
      <li>{`Open example from user/Home-Kit/example3/arduino/arduino.ino`}</li>
      <img src="./img/arduino/5.png" />
    </div>
  );
}

function ConfNodeMCU() {
  return (<div>
      <li>Run Arduino IDE</li>
      <div className={styles.code}>
        <code>cd your_install_derectory<br/>cd arduino<br/>sudo ./arduino</code>
      </div>
      <li>{`Go to the tab "Tools" and choose right serial port like in the picture below.`}</li>
      <img src="./img/arduino/1.png" />
      <li>{`Go to the tab "Arduino" and choose "Preferences". Add URL for package manager like in the picture below.`}</li>
      <img src="./img/node/1.png" />
      <div className={styles.code}>
        <code>{`http://arduino.esp8266.com/stable/package_esp8266com_index.json`}</code>
      </div>
      <img src="./img/node/2.png" />
      <li>{`Go to the tab "Tools" and choose "Board manager" from Boards list like in the picture below. Type "esp8266" in the search field and install it.`}</li>
      <img src="./img/node/3.png" />
      <li>{`Go to the tab "Tools" and choose "Node MCU 0.9" from Boards list like in the picture below.`}</li>
      <img src="./img/node/4.png" />
      <li>{`Let's run program that show us ID of cards. Open username/example3/nodemcu/WiFiClientBasic/WiFiClientBasic.ino and run it`}</li>
      <img src="./img/node/5.png" />
    </div>
  );
}

function Diod() {
  return (<div>
      <h1>Connect Led to the board like in the picture below.</h1>
      <img src="./img/led/1.png" />
    </div>);
}

function CreateS3() {
  const code = `{
  "light": 200,
  "gas": 200,
  "password": "1111",
  "cards": ["3B 27 E4 21"],
  "doorTimeout": 3000
}`;
  const editor = (<Highlight className="language-name-of-snippet">
  {code}
  </Highlight>);
  return (<div>
      <li>Go to the <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> S3</li>
      <li>{`Click on the button "Create Bucket", fill all fields and click "Create" like in the picture below (Use your own name of bucket)`}</li>
      <img src="./img/s3/1.png" />
      <li>{`Create file room.json and upload to you bucket`}</li>
      {editor}
    </div>
  );
}

function Server() {
  const code = `cd Home-Kit/example3/raspberry
  npm run start`;
  const editor = (<Highlight className="language-name-of-snippet">
  {code}
  </Highlight>);
  return (<div>
    <li>Open terminal and write down this commands</li>
    {editor}
  </div>);
}

function SNS() {
  return (<div>
    <li>Go to AWS SNS and create first topic.</li>
    <img src="./img/sns/1.png" />
    <li>{'Let\'s add new subcription. Add your email'}</li>
    <img src="./img/sns/2.png" />
    <li>Note your topic url</li>
    <img src="./img/sns/3.png" />
  </div>);
}

function AWS() {
  return (<div>
    <h3>{'Let\'s start configuring your AWS account.'}</h3>
    <li>{'Select Frankfurt region to work in for this workshop'}</li>
    <img src="./img/aws/aws_region.png" />
  </div>);
}


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      stage: 0
    };
  }

  handleSelect(val) {
    this.setState({tab: val});
  }

  next(length) {
    if (this.state.stage !== length - 1) this.setState({stage: this.state.stage + 1});
    if (this.state.tab !== length - 1) this.setState({tab: this.state.tab + 1});
  }

  render() {
    const steps = ['Configure Arduino', 'Connect Arduino to Board', 'Connect Led to Board', 'Connect Ethernet Module', 'Connect Raspberry', 'Configure AWS', 'Create S3 bucket', 'Create SNS topic', 'Connect Light Sensor', 'Connect PIR Sensor', 'Connect Temperature sensor',
    'Connect Keypad', 'Connect Gas Sensor', 'Connect Alarm button', 'Connect RF Reader', 'Configure NodeMCU', 'Run server on Raspberry'];
    const tabs = [(<ConfArduino />), (<Board/>), (<Diod />), (<Ethernet/>), (<Raspberry/>), (<AWS />), (<CreateS3 />), (<SNS/>), (<LightSensor />), (<PirSensor/>), (<TempSensor />), (<KeySensor />), (<GasSensor />),
      (<AlarmButton />), (<RfReader />), (<ConfNodeMCU />), (<Server />)];
    const resources = [[{
      link: 'https://www.arduino.cc/en/main/software',
      label: 'Arduino IDE'
    },
      {
        link: 'https://www.arduino.cc/',
        label: 'Arduino'
      },
      {
        link: 'https://www.arduino.cc/en/Guide/HomePage',
        label: 'Arduino Gettting Started'
      }],
    [{
      link: 'https://www.arduino.cc/',
      label: 'Arduino'
    },
  ],
  [{
    link: 'https://www.arduino.cc/',
    label: 'Arduino'
  }],
    [{
      link: 'https://www.arduino.cc/',
      label: 'Arduino'
    },
      {
        link: 'http://geekmatic.in.ua/ua/LAN_Ethernet_ENC28J60',
        label: 'Ethernet'
      }],
      [{
        link: 'https://www.arduino.cc/',
        label: 'Arduino'
      },
        {
          link: 'https://www.raspberrypi.org',
          label: 'Raspberry Pi'
        },
        {
          link: 'https://www.raspberrypi.org/products/raspberry-pi-3-model-b/',
          label: 'Raspberry Pi model 3'
        }],
        [{
          link: 'https://aws.amazon.com/',
          label: 'Amazon AWS'
        },
          {
            link: 'https://aws.amazon.com/documentation/s3/?nc1=f_ls',
            label: 'Amazon AWS S3 Documentation'
          }],
      [{
        link: 'https://aws.amazon.com/',
        label: 'Amazon AWS'
      },
        {
          link: 'https://aws.amazon.com/documentation/sns/',
          label: 'Amazon AWS SNS Documentation'
        }],
    [{
      link: 'https://www.arduino.cc/',
      label: 'Arduino'
    },
      {
        link: 'https://aws.amazon.com/',
        label: 'Amazon AWS'
      },
      {
        link: 'https://aws.amazon.com/ru/documentation/iot/',
        label: 'Amazon AWS IoT Documentation'
      }, {
        link: 'https://aws.amazon.com/documentation/lambda/',
        label: 'Amazon AWS Lambda function Documentation'
      }, {
        link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
        label: 'Amazon AWS IAM Role Documentation'
      }],
      [{
        link: 'https://www.arduino.cc/',
        label: 'Arduino'
      },
        {
          link: 'https://aws.amazon.com/',
          label: 'Amazon AWS'
        },
        {
          link: 'https://aws.amazon.com/ru/documentation/iot/',
          label: 'Amazon AWS IoT Documentation'
        }, {
          link: 'https://aws.amazon.com/documentation/lambda/',
          label: 'Amazon AWS Lambda function Documentation'
        }, {
          link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
          label: 'Amazon AWS IAM Role Documentation'
        }],
        [{
          link: 'https://www.arduino.cc/',
          label: 'Arduino'
        },
          {
            link: 'https://aws.amazon.com/',
            label: 'Amazon AWS'
          },
          {
            link: 'https://aws.amazon.com/ru/documentation/iot/',
            label: 'Amazon AWS IoT Documentation'
          }, {
            link: 'https://aws.amazon.com/documentation/lambda/',
            label: 'Amazon AWS Lambda function Documentation'
          }, {
            link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
            label: 'Amazon AWS IAM Role Documentation'
          }],
          [{
            link: 'https://www.arduino.cc/',
            label: 'Arduino'
          },
            {
              link: 'https://aws.amazon.com/',
              label: 'Amazon AWS'
            },
            {
              link: 'https://aws.amazon.com/ru/documentation/iot/',
              label: 'Amazon AWS IoT Documentation'
            }, {
              link: 'https://aws.amazon.com/documentation/lambda/',
              label: 'Amazon AWS Lambda function Documentation'
            }, {
              link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
              label: 'Amazon AWS IAM Role Documentation'
            }],
            [{
              link: 'https://www.arduino.cc/',
              label: 'Arduino'
            },
              {
                link: 'https://aws.amazon.com/',
                label: 'Amazon AWS'
              },
              {
                link: 'https://aws.amazon.com/ru/documentation/iot/',
                label: 'Amazon AWS IoT Documentation'
              }, {
                link: 'https://aws.amazon.com/documentation/lambda/',
                label: 'Amazon AWS Lambda function Documentation'
              }, {
                link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
                label: 'Amazon AWS IAM Role Documentation'
              }],
            [{
              link: 'https://www.arduino.cc/',
              label: 'Arduino'
            },
              {
                link: 'https://aws.amazon.com/',
                label: 'Amazon AWS'
              },
              {
                link: 'https://aws.amazon.com/ru/documentation/iot/',
                label: 'Amazon AWS IoT Documentation'
              }, {
                link: 'https://aws.amazon.com/documentation/lambda/',
                label: 'Amazon AWS Lambda function Documentation'
              }, {
                link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
                label: 'Amazon AWS IAM Role Documentation'
              }],
              [{
                link: 'https://www.arduino.cc/en/main/software',
                label: 'Arduino IDE'
              },
                {
                  link: 'https://www.arduino.cc/',
                  label: 'Arduino'
                },
                {
                  link: 'https://www.arduino.cc/en/Guide/HomePage',
                  label: 'Arduino Gettting Started'
                }],
    [{
      link: 'https://www.arduino.cc/en/main/software',
      label: 'Arduino IDE'
    },
      {
        link: 'http://www.nodemcu.com/index_en.html',
        label: 'NodeMCU'
      }],
    [{
      link: 'https://nodejs.org/uk/',
      label: 'NodeJs'
    }]];
    return (<div>
      <div className={styles.navbar}>
        <Link to={'/'}><Button>Back</Button></Link>
      </div>
      <div className={styles.body}>
          <div className={`col-sm-2`}>
            <Menu steps={steps} stage={this.state.stage} tab={this.state.tab} handleSelect={this.handleSelect.bind(this)} />
          </div>
          <div className={`col-sm-8`}>
            <div>{tabs[this.state.tab]}</div><Button href="#" className={`${(this.state.tab !== tabs.length - 1) ? 'btn-primary' : 'btn-success' } ${styles.button}`} onClick={this.next.bind(this, tabs.length)}>{(this.state.tab !== tabs.length - 1) ? 'Next' : 'Finish'}</Button>
          </div>
          <div className={`col-sm-2 ${styles.res}`}>
            <div className={styles.resources}>
              Resources:
              {resources[this.state.tab] && resources[this.state.tab].map(val => <div><a href={val.link} target="_blank" rel="noreferrer">{val.label}</a></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
