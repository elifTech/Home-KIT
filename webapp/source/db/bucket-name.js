import mongo from './mongo';

export default (user, bucketName) => {
  console.log('Must add bucket name', arguments);
  return mongo.then(db => {
    const collection = db.collection('things');
    collection.updateOne({
        user: user,
      },
      {
        $set: {
          bucketName: bucketName
        }
      },
      {
        upsert: true
      })
  })
}
