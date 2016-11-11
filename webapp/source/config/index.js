import path from 'path';
import nconf from 'nconf';

export default nconf.argv().env().file({file: path.join(__dirname, 'jsons/config.develop.json')});
