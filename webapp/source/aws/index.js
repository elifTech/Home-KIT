import awsIot from 'aws-iot-device-sdk';
import path from 'path';

const lights = awsIot.thingShadow({
  keyPath: path.join(__dirname, '/keys/lights/0b4370f8c4-private.pem.key'),
  certPath: path.join(__dirname, '/keys/lights/0b4370f8c4-certificate.pem.crt'),
  caPath: path.join(__dirname, '/keys/root-CA.crt'),
  clientId: 'lights',
  region: 'eu-central-1'
});

lights.on('connect', () => {
  lights.register('lights');
});

const changeState = color => {
  lights.update('lights', {
    'state': {
      'desired': {
        change: color
      }
    }
  })
};

export default changeState;
