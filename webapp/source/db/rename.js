import mongo from './mongo';

export default data => {
  console.log('data to insert', data);
  return mongo.then(db => {
    const collection = db.collection('things');
      return collection.updateOne({
          user: data.user,
          "things.type": data.type
        },
        {
          $set: {'things.$.name': data.name}
        },
        false ,
        true
      )
  })
}
