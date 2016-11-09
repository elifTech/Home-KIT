import db from 'db';

const post = (req, res) => {
  console.log(req.body);
 db.addThing({
   user: req.body.user,
   thingName: req.body.thingName
 }).then(result => {
   res.send({
     success: true
   })
 })
   .catch(error => {
     res.send({
       success: false,
       error: error.message
     })
   })
};

const get = (req, res) => {
  console.log(req.query.user);
  db.getThing(req.query)
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          exist: true
        })
      }
      res.send({
        success: true,
        exist: false
      })
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

export default {
  post: post,
  get: get
}
