var awsIot = require('aws-iot-device-sdk');
var mqtt = require('mqtt');
var clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');
var decode = require('./crypt.js').decode;
var encode = require('./crypt.js').encode;
var randomIv = require('./crypt.js').getRandomArrayIv;
var path = require('path');

var clientTokenUpdate;
var initialState = {
  "state": {
    "reported": {
      "yellow": false,
      "green": false,
      "red": false
    }
  }
};

// var lights = awsIot.thingShadow({
//   keyPath: path.join(__dirname, '/keys/lights-report/a2bfa2f197-private.pem.key'),
//   certPath: path.join(__dirname, '/keys/lights-report/a2bfa2f197-certificate.pem.crt'),
//   caPath: path.join(__dirname, '/keys/root-CA.crt'),
//   clientId: 'lights-report',
//   region: 'eu-central-1'
// });

var light = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/light-private.pem.key'),
  certPath: path.join(__dirname, '/keys/light-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'light-report',
  region: 'eu-central-1'
});

var gas = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/gas-private.pem.key'),
  certPath: path.join(__dirname, '/keys/gas-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'gas-report',
  region: 'eu-central-1'
});

var pir = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/pir-private.pem.key'),
  certPath: path.join(__dirname, '/keys/pir-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'pir-report',
  region: 'eu-central-1'
});

var key = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/door-private.pem.key'),
  certPath: path.join(__dirname, '/keys/door-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'key-report',
  region: 'eu-central-1'
});

var temp = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/temp-private.pem.key'),
  certPath: path.join(__dirname, '/keys/temp-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'temp-report',
  region: 'eu-central-1'
});

clientMosquitto.on('connect', function () {
  console.log('connected to mosquitto server');
  clientMosquitto.subscribe('lights/report');
  clientMosquitto.subscribe('room/light');
  clientMosquitto.subscribe('room/photo');
  clientMosquitto.subscribe('room/gas');
});

clientMosquitto.on('message', function (topic, message) {
  console.log("RECIEVE FROM ARDUINO");
  var msg = '';

  try {
    msg = JSON.parse(message.toString());
  } catch (e) {
    return console.log('Received message parsing error', e);
  }
  var reported = msg.value;
  // var decoded = decode(msg.message, msg.iv);
  // if (decoded.slice(-1) != '}') {
  //   decoded = decoded.slice(0, -1);
  // }
  // console.log(topic, decoded);
  // var reported = '';
  // try {
  //   reported = JSON.parse(decoded.toString());
  // } catch (e) {
  //   return console.log('Decoded message parsing error', e);
  // }
  switch (topic) {
    case 'room/light':
      console.log(topic, 'sent!');
      return light.update('light-report', {
        "state": {
          "reported": reported
        }
      });
    case 'room/gas':
      console.log(topic, 'sent!');
      return gas.update('gas-report', {
        "state": {
          "reported": reported,
        },
        "thingName": "gas_value"
      });
    case 'room/pir':
      console.log(topic, 'sent!');
      return pir.update('pir-report', {
        "state": {
          "reported": reported
        }
      });
    case 'room/key':
      console.log(topic, 'sent!');
      return key.update('key-report', {
        "state": {
          "reported": reported
        }
      });
    case 'room/temp':
      console.log(topic, 'sent!');
      return temp.update('temp-report', {
        "state": {
          "reported": reported
        }
      });
  }
});

light.on('connect', function () {
  light.register('light-report');
  console.log('light connceted to AWS');
});

gas.on('connect', function () {
  gas.register('gas-report');
  console.log('gas connceted to AWS');
});

pir.on('connect', function () {
  pir.register('pir-report');
  console.log('pir connceted to AWS');
});

key.on('connect', function () {
  key.register('key-report');
  console.log('key connceted to AWS');
});

temp.on('connect', function () {
  temp.register('temp-report');
  console.log('temp connceted to AWS');
});

light.on('foreignStateChange',
  function (thingName, operation, stateObject) {
     console.log('Received remote changes');
    // var iv = randomIv();
    // var converted = [
    //   {"name": "green", "value": stateObject.state.desired.green},
    //   {"name": "yellow", "value": stateObject.state.desired.yellow},
    //   {"name": "red", "value": stateObject.state.desired.red}
    // ];
    // console.log(converted);
    // var desiredState = {
    //   iv: iv,
    //   message: encode(JSON.stringify(converted), iv)
    // };
    clientMosquitto.publish('light/change', JSON.stringify(stateObject.state.reported));
  });

gas.on('foreignStateChange',
  function (thingName, operation, stateObject) {
    console.log('Received remote changes');
    clientMosquitto.publish('gas/change', JSON.stringify(stateObject.state.reported));
  });

pir.on('foreignStateChange',
  function (thingName, operation, stateObject) {
    console.log('Received remote changes');
    clientMosquitto.publish('pir/change', JSON.stringify(stateObject.state.reported));
  });

key.on('foreignStateChange',
  function (thingName, operation, stateObject) {
    console.log('Received remote changes');
    clientMosquitto.publish('key/change', JSON.stringify(stateObject.state.reported));
  });

temp.on('foreignStateChange',
  function (thingName, operation, stateObject) {
    console.log('Received remote changes');
    clientMosquitto.publish('temp/change', JSON.stringify(stateObject.state.reported));
  });
