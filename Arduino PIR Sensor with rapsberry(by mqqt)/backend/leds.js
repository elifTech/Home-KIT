var awsIot = require('aws-iot-device-sdk');
var mqtt = require('mqtt');
var clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');

var encode = require('./crypt.js').encode;
var getRandomArrayIv = require('./crypt.js').getRandomArrayIv;

var thingShadows = awsIot.thingShadow({
    keyPath: 'certs/leds/private.pem.key',
    certPath: 'certs/leds/certificate.pem.crt',
    caPath: 'certs/root-CA.crt',
    clientId: 'testClient2',
    region: 'eu-central-1'
});

clientMosquitto.on('connect', function() {
    console.log('connected to mosquitto server');
    clientMosquitto.subscribe('leds/get_status');
    clientMosquitto.on('message', function(topic, message) {
        console.log("GET STATUS MSG");
        console.log(topic);
        switch (topic) {
            case 'leds/get_status':
                thingShadows.get('Leds');
                break;
        }
        console.log("Recieve msg on topic:" + topic + " msg:" + message.toString());
    });

    var clientTokenUpdate;
    var firstAWSConncetion = true;
    var ledArray = [{
        "sensor": {
            "name": "yellow",
            "value": 250
        }
    }, {
        "sensor": {
            "name": "green",
            "value": 0
        }
    }, {
        "sensor": {
            "name": "red",
            "value": 0
        }
    }];
    var ledState = {
        "state": {
            "reported": {
                "leds_set": ledArray
            }
        }
    };

    thingShadows.on('connect', function() {
        console.log('connceted to AWS')
        thingShadows.register('Leds');
        if (firstAWSConncetion) {
            firstAWSConncetion = false;
            thingShadows.update('Leds', ledState);
        }
    });

    thingShadows.on('status',
        function(thingName, stat, clientToken, stateObject) {
            console.log("STATUS EVENT");
            console.log('received ' + stat + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
            var iv = getRandomArrayIv();
            var state = JSON.stringify(stateObject.state.reported.leds_set);
            var encodedState = encode(state, iv);
            clientMosquitto.publish('leds/status', JSON.stringify({
                "iv": iv,
                "message": encodedState
            }));
        });

    thingShadows.on('delta',
        function(thingName, stateObject) {
            console.log('DELTA EVENT ');
            console.log('Thing name: ' + thingName);
            var leds_set = stateObject.state.leds_set;
            console.log('State object: ' + leds_set);
            thingShadows.update('Leds', {
                "state": {
                    "reported": {
                        "leds_set": leds_set
                    }
                }
            });
        });

    thingShadows.on('timeout',
        function(thingName, clientToken) {
            console.log('TIMEOUT EVENT');
            console.log('received timeout on ' + thingName +
                ' with token: ' + clientToken);
        });

    thingShadows.on('foreignStateChange',
        function(thingName, operation, stateObject) {
            console.log('FOREIGN STATE CHANGE EVENT');
            var state = JSON.stringify(stateObject.state.reported.leds_set);
            var iv = getRandomArrayIv();
            var encodedState = encode(state, iv);
            clientMosquitto.publish('leds/status', JSON.stringify({
                "iv": iv,
                "message": encodedState
            }));
        });
});
