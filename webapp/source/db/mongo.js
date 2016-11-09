import { MongoClient } from 'mongodb';
import config from 'config';

const url = config.get('db:url');

export default MongoClient.connect(url);
