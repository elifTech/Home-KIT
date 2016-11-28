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

var lock = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/lock-report/c18004075b-private.pem.key'),
  certPath: path.join(__dirname, '/keys/lock-report/c18004075b-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'lock-report',
  region: 'eu-central-1'
});

var gas = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/weed_report/public.pem.key'),
  certPath: path.join(__dirname, '/keys/weed_report/certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'weed_report',
  region: 'eu-central-1'
});

var shine = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/shine-report/5c10729530-private.pem.key'),
  certPath: path.join(__dirname, '/keys/shine-report/5c10729530-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'shine-report',
  region: 'eu-central-1'
});

clientMosquitto.on('connect', function () {
  console.log('connected to mosquitto server');
  clientMosquitto.subscribe('lights/report');
  clientMosquitto.subscribe('room/lock');
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
  var decoded = decode(msg.message, msg.iv);
  if (decoded.slice(-1) != '}') {
    decoded = decoded.slice(0, -1);
  }
  console.log(topic, decoded);
  var reported = '';
  try {
    reported = JSON.parse(decoded.toString());
  } catch (e) {
    return console.log('Decoded message parsing error', e);
  }
  switch (topic) {
    case 'lights/report':
      console.log(topic, 'sent!');
      return lights.update('lights-report', {
        "state": {
          "reported": reported
        }
      });
    case 'room/lock':
      console.log(topic, 'sent!');
      return lock.update('lock-report', {
        "state": {
          "desired": reported
        }
      });
    case 'room/gas':
      console.log(topic, 'sent!');
      return gas.update('weed_report', {
        "state": {
          "reported": reported
        }
      });
    case 'room/photo':
      console.log(topic, 'sent!');
      return shine.update('shine-report', {
        "state": {
          "reported": reported
        }
      });
  }
});

lock.on('connect', function () {
  lock.register('lock-report');
  console.log('lock connceted to AWS');
});

lights.on('connect', function () {
  lights.register('lights-report');
  console.log('lights connceted to AWS');
});

gas.on('connect', function () {
  gas.register('weed_report');
  console.log('gas connceted to AWS');
});

shine.on('connect', function () {
  shine.register('shine-report');
  console.log('shine connceted to AWS');
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
