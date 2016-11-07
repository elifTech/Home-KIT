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

var lights = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/lights-report/a2bfa2f197-private.pem.key'),
  certPath: path.join(__dirname, '/keys/lights-report/a2bfa2f197-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'lights-report',
  region: 'eu-central-1'
});

clientMosquitto.on('connect', function () {
  console.log('connected to mosquitto server');
  clientMosquitto.subscribe('lights/report');
});

clientMosquitto.on('message', function (topic, message) {
  console.log("RECIEVE FROM ARDUINO");
  var msg = '';

  try {
    msg = JSON.parse(message.toString());
  } catch (e) {
    return console.log('Received message parsing error', e);
  }
  var decoded = decode(msg.message, msg.iv);
  decoded = decoded.slice(0, -1);
  console.log(decoded);
  var reported = '';
  try {
    reported = JSON.parse(decoded.toString());
  } catch (e) {
    return console.log('Decoded message parsing error', e);
  }
  lights.update('lights-report', {
    "state": {
      "reported": reported
    }
  });
});

lights.on('connect', function () {
  lights.register('lights-report');
  console.log('connceted to AWS');
});

lights.on('foreignStateChange',
  function (thingName, operation, stateObject) {
    console.log('Received remote changes');
    var iv = randomIv();
    var converted = [
      {"name": "green", "value": stateObject.state.desired.green},
      {"name": "yellow", "value": stateObject.state.desired.yellow},
      {"name": "red", "value": stateObject.state.desired.red}
    ];
    console.log(converted);
    var desiredState = {
      iv: iv,
      message: encode(JSON.stringify(converted), iv)
    };
    clientMosquitto.publish('lights/change', JSON.stringify(desiredState));
  });
