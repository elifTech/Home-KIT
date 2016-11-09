import mongo from './mongo';

export default data => {
  return mongo.then(db => {
    const collection = db.collection('things');
    return collection.findOne({
      $where: `obj.user == "${data.user}"`
    })
  })
}
