const awsIot = require('aws-iot-device-sdk');
const mqtt = require('mqtt');
const clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');
const path = require('path');
const fs = require('fs');
const config = require('./config');
let light = {}, gas = {}, pir = {}, door = {}, temp = {}, button = {};

function connectKeys() {
    let keysPath = {
        private: '',
        cert: '',
        root: ''
    };

    keysPath.root = path.join(__dirname, config.root);
    if (!fs.existsSync(keysPath.root)) {
        console.log('The root\'s key didn\'t found');
        return process.exit();
    }

    keysPath.private = path.join(__dirname, config.light.private);
    keysPath.cert = path.join(__dirname, config.light.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Light\'s key/keys didn\'t found');
        return process.exit();
    }

    light = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.light.name,
        region: config.region
    });

    keysPath.private = path.join(__dirname, config.gas.private);
    keysPath.cert = path.join(__dirname, config.gas.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Gas\' key/keys didn\'t found');
        return process.exit();
    }

    gas = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.gas.name,
        region: config.region
    });

    keysPath.private = path.join(__dirname, config.pir.private);
    keysPath.cert = path.join(__dirname, config.pir.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Pir\'s key/keys didn\'t found');
        return process.exit();
    }

    pir = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.pir.name,
        region: config.region
    });

    keysPath.private = path.join(__dirname, config.door.private);
    keysPath.cert = path.join(__dirname, config.door.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Door\'s key/keys didn\'t found');
        return process.exit();
    }

    door = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.door.name,
        region: config.region
    });

    keysPath.private = path.join(__dirname, config.temp.private);
    keysPath.cert = path.join(__dirname, config.temp.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Temp\'s key/keys didn\'t found');
        return process.exit();
    }

    temp = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.temp.name,
        region: config.region
    });

    keysPath.private = path.join(__dirname, config.button.private);
    keysPath.cert = path.join(__dirname, config.button.cert);
    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log('Button\'s key/keys didn\'t found');
        return process.exit();
    }

    button = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.button.name,
        region: config.region
    });
}

connectKeys();

clientMosquitto.on('connect', function () {
    console.log('connected to mosquitto server');
    clientMosquitto.subscribe(config.light.subTopic);
    clientMosquitto.subscribe(config.pir.subTopic);
    clientMosquitto.subscribe(config.gas.subTopic);
    clientMosquitto.subscribe(config.door.subTopicKey);
    clientMosquitto.subscribe(config.door.subTopicCard);
    clientMosquitto.subscribe(config.temp.subTopic);
    clientMosquitto.subscribe(config.button.subTopic);
    clientMosquitto.subscribe(config.door.reportSub);
});

clientMosquitto.on('message', function (topic, message) {
    console.log("RECIEVED FROM ARDUINO:", message);

    let msg = '';

    try {
        msg = JSON.parse(message.toString());
    } catch (e) {
        return console.log('Received message parsing error', e);
    }
    console.log(msg);
    msg = {"state": {"reported": msg}};
    switch (topic) {
        case config.light.subTopic:
            console.log(topic, 'sent!');
            return light.update(config.light.name, msg);
        case config.gas.subTopic:
            console.log(topic, 'sent!');
            return gas.update(config.gas.name, msg);
        case config.pir.subTopic:
            console.log(topic, 'sent!');
            return pir.update(config.pir.name, msg);
        case config.door.subTopicKey:
            console.log(topic, 'sent!');
            return door.update(config.door.name, Object.assign({state:'desired'}, msg.state.reported));
        case config.door.subTopicCard:
            console.log(topic, 'sent!');
            return door.update(config.door.name, Object.assign({state:'desired'}, msg.state.reported));
        case config.temp.subTopic:
            console.log(topic, 'sent!');
            return temp.update(config.temp.name, msg);
        case config.door.reportSub:
            console.log(topic, 'sent!');
            return door.update(config.door.name, Object.assign({state:'reported'}, msg));
        case config.button.subTopic:
            console.log(topic, 'sent!');
            return button.update(config.button.name, msg);
    }
});

light.on('connect', function () {
    light.register(config.light.name);
    console.log('light connceted to AWS');
});

gas.on('connect', function () {
    gas.register(config.gas.name);
    console.log('gas connceted to AWS');
});

pir.on('connect', function () {
    pir.register(config.pir.name);
    console.log('pir connceted to AWS');
});

door.on('connect', function () {
    door.register(config.door.name);
    console.log('door connceted to AWS');
});

temp.on('connect', function () {
    temp.register(config.temp.name);
    console.log('temp connceted to AWS');
});

button.on('connect', function () {
    button.register(config.button.name);
    console.log('button connceted to AWS');
});

light.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish(config.light.pubTopic, JSON.stringify(stateObject.state.reported));
    });

gas.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish(config.gas.pubTopic, JSON.stringify(stateObject.state.reported));
    });

pir.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish(config.pir.pubTopic, JSON.stringify(stateObject.state.reported));
    });

door.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        if(stateObject.state.desired){
            clientMosquitto.publish(config.door.pubTopic, JSON.stringify(stateObject.state.desired));
        }
    });

temp.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish(config.temp.pubTopic, JSON.stringify(stateObject.state.reported));
    });

button.on('foreignStateChange',
    function (thingName, operation, stateObject) {
        console.log('Received remote changes');
        clientMosquitto.publish(config.button.pubTopic, JSON.stringify(stateObject.state.reported));
    });