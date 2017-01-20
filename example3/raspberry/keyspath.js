const path = {
    root: '/keys/root-CA.crt',
    gas: {
        private: '/keys/gas-report.private.key',
        cert: '/keys/gas-report.cert.pem'
    },
    light: {
        private: '/keys/light-report.private.key',
        cert: '/keys/light-report.cert.pem'
    },
    pir: {
        private: '/keys/pir-report.private.key',
        cert: '/keys/pir-report.cert.pem'
    },
    door: {
        private: '/keys/door.private.key',
        cert: '/keys/door.cert.pem'
    },
    temp: {
        private: '/keys/temp-report.private.key',
        cert: '/keys/temp-report.cert.pem'
    }
};

module.exports = Object.assign({}, path);