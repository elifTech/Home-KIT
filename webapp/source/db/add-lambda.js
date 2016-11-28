import mongo from './mongo';

export default (user, lambdaArn) => {
  return mongo.then(db => {
    const collection = db.collection('things');
    collection.updateOne({
        user: user,
      },
      {
        $set: {
          lambdaArn: lambdaArn
        }
      },
      {
        upsert: true
      })
  })
}
