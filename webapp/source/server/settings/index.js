import appHome from '../../../app-home.js';

export default Object.assign({}, appHome, {
  APP_HOST: '0.0.0.0',
  APP_PORT: 3000,
  APP_NAME: 'Home KIT lights',
  NODE_HOST: '0.0.0.0',
  NODE_PORT: 3000,
  TITLE: 'Lights',
  LOG_PARAMS: false // use `/gif.log/:message` to track client logs.
});
