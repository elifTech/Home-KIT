const path = {
    root: '/keys/root-CA.crt',
    region: 'eu-west-1',
    devices: {
        pir: {
            private: '/keys/pir.private.key',
            cert: '/keys/pir.cert.pem',
            name: 'pir',
            subTopic: 'room/pir',
            pubTopic: {
                reported: 'pir/change',
                desired: 'nothing'
            },
            type: 'reported'
        },
        keypad: {
            private: '/keys/keypad.private.key',
            cert: '/keys/keypad.cert.pem',
            name: 'keypad',
            subTopic: 'room/keypad',
            pubTopic: {
                reported: 'keypad/change',
                desired: 'nothing'
            },
            type: 'desired'
        },
        temp: {
            private: '/keys/temperature.private.key',
            cert: '/keys/temperature.cert.pem',
            name: 'temperature',
            subTopic: 'room/temperature',
            pubTopic: {
                reported: 'nothing',
                desired: 'nothing'
            },
            type: 'reported'
        },
        light: {
            private: '/keys/light.private.key',
            cert: '/keys/light.cert.pem',
            name: 'light',
            subTopic: 'room/light',
            pubTopic: {
                reported: 'nothing',
                desired: 'nothing'
            },
            type: 'reported'
        },
        curtain: {
            private: '/keys/curtain.private.key',
            cert: '/keys/curtain.cert.pem',
            name: 'curtain',
            subTopic: 'room/curtain',
            pubTopic: {
                reported: 'curtain/change',
                desired: 'curtain/open'
            },
            type: 'reported'
        },
        conditioner: {
            private: '/keys/conditioner.private.key',
            cert: '/keys/conditioner.cert.pem',
            name: 'conditioner',
            subTopic: 'room/conditioner',
            pubTopic: {
                reported: 'conditioner/change',
                desired: 'conditioner/open'
            },
            type: 'reported'
        },
        alarm: {
            private: '/keys/conditioner.private.key',
            cert: '/keys/conditioner.cert.pem',
            name: 'alarm',
            subTopic: 'nothing',
            pubTopic: {
                reported: 'alarm/change',
                desired: 'nothing'
            },
            type: 'reported'
        }
    }
};

module.exports = Object.assign({}, path);