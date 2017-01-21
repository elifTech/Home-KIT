const path = {
    root: '/keys/root-CA.crt',
    region: 'eu-west-1',
    gas: {
        private: '/keys/gas-report.private.key',
        cert: '/keys/gas-report.cert.pem',
        name: 'gas-report',
        subTopic: 'room/gas',
        pubTopic: 'gas/change'
    },
    light: {
        private: '/keys/light-report.private.key',
        cert: '/keys/light-report.cert.pem',
        name: 'light-report',
        subTopic: 'room/light',
        pubTopic: 'light/change'
    },
    pir: {
        private: '/keys/pir-report.private.key',
        cert: '/keys/pir-report.cert.pem',
        name: 'pir-report',
        subTopic: 'room/pir',
        pubTopic: 'pir/change'
    },
    door: {
        private: '/keys/door.private.key',
        cert: '/keys/door.cert.pem',
        name: 'door',
        subTopicKey: 'room/key',
        subTopicCard: 'room/card',
        pubTopic: 'door/change',
        reportSub: 'room/door/state'
    },
    temp: {
        private: '/keys/temp-report.private.key',
        cert: '/keys/temp-report.cert.pem',
        name: 'temp-report',
        subTopic: 'room/temperature',
        pubTopic: 'temp/change'
    },
    button: {
        private: '/keys/button-report.private.key',
        cert: '/keys/button-report.cert.pem',
        name: 'button-report',
        subTopic: 'room/security',
        pubTopic: 'security/change'
    }
};

module.exports = Object.assign({}, path);