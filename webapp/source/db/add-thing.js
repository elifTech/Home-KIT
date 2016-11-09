import mongo from './mongo';

export default data => {
  return mongo.then(db => {
    const collection = db.collection('things');
    collection.insertOne({
      user: data.user,
      things: [
        {
          name: data.thingName
        }
      ]
    })
  })
}
