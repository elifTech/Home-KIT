import mongo from './mongo';

export default data => {
  return mongo.then(db => {
    const collection = db.collection('things');
    collection.updateOne({
        user: data.user,
      },
      {
        $set: {
          accessKey: data.accessKey,
          secretKey: data.secretKey
        }
      },
      {
        upsert: true
      })
  })
}
