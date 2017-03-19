const awsIot = require('aws-iot-device-sdk');
const mqtt = require('mqtt');
const clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const _ = require('lodash');
const keysPath = {
    private: '',
    cert: '',
    root: ''
};

const things = {};

keysPath.root = path.join(__dirname, config.root);
if (!fs.existsSync(keysPath.root)) {
    console.log('The root key didn\'t found');
    return process.exit();
}

for (const propName in config.devices) {
    keysPath.private = path.join(__dirname, config.devices[propName].private);
    keysPath.cert = path.join(__dirname, config.devices[propName].cert);

    if (!fs.existsSync(keysPath.private) || !fs.existsSync(keysPath.cert)) {
        console.log(propName + ' key/keys didn\'t found');
        continue;
    }

    const device = awsIot.thingShadow({
        keyPath: keysPath.private,
        certPath: keysPath.cert,
        caPath: keysPath.root,
        clientId: config.devices[propName].name,
        region: config.region
    });

    things[config.devices[propName].name] = device;

    device.on('connect', function () {
        device.register(config.devices[propName].name);
        console.log(propName + ' connceted to AWS');
    });

    device.on('foreignStateChange',
        function (thingName, operation, stateObject) {
            console.log('Received remote changes');
            console.log(stateObject);
            if (stateObject.state.hasOwnProperty('desired')) {
                return clientMosquitto.publish(config.devices[propName].pubTopic.desired, JSON.stringify(stateObject.state.desired));
            }
            clientMosquitto.publish(config.devices[propName].pubTopic.reported, JSON.stringify(stateObject.state.reported));
        });

}

clientMosquitto.on('connect', function () {
    console.log('connected to mosquitto server');
    for (const propName in config.devices) {
        if (propName === 'door') {
            clientMosquitto.subscribe(config.devices[propName].subTopicKey);
            clientMosquitto.subscribe(config.devices[propName].subTopicCard);
            continue;
        }
        clientMosquitto.subscribe(config.devices[propName].subTopic);
    }
});

clientMosquitto.on('message', function (topic, message) {
    console.log("RECIEVED FROM ARDUINO:");
    console.log(message.toString());

    let data = '';

    try {
        data =JSON.parse(message.toString());
    } catch (e) {
        return console.log('Received message parsing error', e);
    }

    const key = _.findKey(config.devices, node => node.subTopic === topic);

    const payload = {
        state: {}
    };

    payload.state[config.devices[key].type] = data;
    try {
        things[config.devices[key].name].update(config.devices[key].name, payload);
    } catch (e) {
        console.log(config.devices[key].name + ' device update error');
    }

});
