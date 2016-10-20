var awsIot = require('aws-iot-device-sdk');
var mqtt = require('mqtt');
var clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');
var decode = require('./crypt.js').decode;


var clientTokenUpdate;
var initialState = {
    "state": {
        "reported": {
            "motions": 0
        }
    }
};
var firstAWSConncetion = true;

var thingShadows = awsIot.thingShadow({
    keyPath: 'certs/pir_sensor/private.pem.key',
    certPath: 'certs/pir_sensor/certificate.pem.crt',
    caPath: 'certs/root-CA.crt',
    clientId: 'testClient',
    region: 'eu-central-1'
});
clientMosquitto.on('connect', function() {
    console.log('connected to mosquitto server');
    clientMosquitto.subscribe('sensor/motion');
});
clientMosquitto.on('message', function(topic, message) {
    console.log("RECIEVE FROM SENSOR");
    console.log("Recieve msg on topic:" + topic + " msg:" + message.toString())
    var msg = JSON.parse(message.toString());
    console.log("IV INDEX:" + msg.iv);
    var motions = JSON.parse(decode(msg.message, msg.iv));

    console.log("Decoded:" + motions.motions);
    clientTokenUpdate = thingShadows.update('pirSensor', {
        "state": {
            "reported": motions
        }
    });
    setTimeout(function() {
        if (clientTokenUpdate === null) {
            console.log('update shadow failed, operation still in progress');
        }
    }, 5000);
});
thingShadows.on('connect', function() {
    console.log('connceted to AWS')
    thingShadows.register('pirSensor');
    if (firstAWSConncetion) {
        firstAWSConncetion = false;
        clientTokenUpdate = thingShadows.update('pirSensor', initialState);
    }
    setTimeout(function() {
        if (clientTokenUpdate === null) {
            console.log('update shadow failed, operation still in progress');
        }
    }, 5000);
});

thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
        clientTokenUpdate = clientToken;
        console.log("STATUS EVENT");
        console.log('received ' + stat + ' on ' + thingName + ': ' +
            JSON.stringify(stateObject));
        console.log(clientTokenUpdate, clientToken, clientTokenUpdate == clientToken);
    });

thingShadows.on('delta',
    function(thingName, stateObject) {
        console.log('DELTA EVENT');
        console.log('received delta on ' + thingName + ': ' +
            JSON.stringify(stateObject));

    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
        console.log('TIMEOUT EVENT');
        console.log('received timeout on ' + thingName +
            ' with token: ' + clientToken);
    });
