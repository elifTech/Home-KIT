const awsIot = require('aws-iot-device-sdk');
const mqtt = require('mqtt');
const clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');
const path = require('path');
const fs = require('fs');
const keys = require('./keyspath');
let light = {}, gas = {}, pir = {}, door = {}, temp = {};

function connectKeys() {
    let keysPath = {
        private: '',
        cert: '',
        root: ''
    };

    keysPath.root = path.join(__dirname, keys.root);
    if (!fs.existsSync(keysPath.root)) {
        console.log('The root\'s key didn\'t found');
        return process.exit();
    }

    keysPath.private = path.join(__dirname, keys.light.private);
    keysPath.cert = path.join(__dirname, keys.light.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Light\'s key/keys didn\'t found');
        return process.exit();
    }

    light = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: 'light-report',
        region: 'eu-central-1'
    });

    keysPath.private = path.join(__dirname, keys.gas.private);
    keysPath.cert = path.join(__dirname, keys.gas.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Gas\' key/keys didn\'t found');
        return process.exit();
    }

    gas = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: 'gas-report',
        region: 'eu-central-1'
    });

    keysPath.private = path.join(__dirname, keys.pir.private);
    keysPath.cert = path.join(__dirname, keys.pir.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Pir\'s key/keys didn\'t found');
        return process.exit();
    }

    pir = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: 'pir-report',
        region: 'eu-central-1'
    });

    keysPath.private = path.join(__dirname, keys.door.private);
    keysPath.cert = path.join(__dirname, keys.door.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Door\'s key/keys didn\'t found');
        return process.exit();
    }

    door = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: 'key-report',
        region: 'eu-central-1'
    });

    keysPath.private = path.join(__dirname, keys.pir.private);
    keysPath.cert = path.join(__dirname, keys.pir.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Temp\'s key/keys didn\'t found');
        return process.exit();
    }

    temp = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: 'temp-report',
        region: 'eu-central-1'
    });
}

connectKeys();

clientMosquitto.on('connect', function () {
    console.log('connected to mosquitto server');
    clientMosquitto.subscribe('lights/report');
    clientMosquitto.subscribe('room/light');
    clientMosquitto.subscribe('room/photo');
    clientMosquitto.subscribe('room/gas');
});

clientMosquitto.on('message', function (topic, message) {
    console.log("RECIEVED FROM ARDUINO:", message);

    let msg = '';

    try {
        msg = JSON.parse(message.toString());
    } catch (e) {
        return console.log('Received message parsing error', e);
    }
    switch (topic) {
        case 'room/light':
            console.log(topic, 'sent!');
            return light.update('light-report', {
                "state": {
                    "reported": msg
                }
            });
        case 'room/gas':
            console.log(topic, 'sent!');
            return gas.update('gas-report', {
                "state": {
                    "reported": msg,
                },
                "thingName": "gas-report"
            });
        case 'room/pir':
            console.log(topic, 'sent!');
            return pir.update('pir-report', {
                "state": {
                    "reported": msg
                }
            });
        case 'room/key':
            console.log(topic, 'sent!');
            return door.update('door', {
                "state": {
                    "reported": msg
                }
            });
        case 'room/card':
            console.log(topic, 'sent!');
            return door.update('door', {
                "state": {
                    "reported": msg
                }
            });
        case 'room/temp':
            console.log(topic, 'sent!');
            return temp.update('temp-report', {
                "state": {
                    "reported": msg
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

door.on('connect', function () {
    door.register('door-report');
    console.log('door connceted to AWS');
});

temp.on('connect', function () {
    temp.register('temp-report');
    console.log('temp connceted to AWS');
});

light.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
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

door.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish('door/change', JSON.stringify(stateObject.state.reported));
    });

temp.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish('temp/change', JSON.stringify(stateObject.state.reported));
    });
