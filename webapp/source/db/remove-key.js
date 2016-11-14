import mongo from './mongo';

export default data => {
  return mongo.then(db => {
    const collection = db.collection('things');
    if (data.type === 'key') {
      return collection.updateOne({
          user: data.user,
          "things.name": data.thingName
        },
        {
          $unset: {'things.$.keyPath': true}
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
          $unset: {'things.$.certPath': true}
        },
        false ,
        true
      )
    }
  })
}
