import mongo from './mongo';

export default data => {
  console.log('data to insert', data);
  return mongo.then(db => {
    const collection = db.collection('things');
    if (data.type === 'key') {
      return collection.updateOne({
          user: data.user,
          "things.name": data.thingName
        },
        {
          $set: {'things.$.keyPath': data.filePath}
        },
        false ,
        true
      )
    } else if (data.type === 'certificate') {
      return collection.updateOne({
          user: data.user,
          "things.name": data.thingName
        },
        {
          $set: {'things.$.certPath': data.filePath}
        },
        false ,
        true
      )
    }
  })
}
