// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express
const MongoClient = require('mongodb').MongoClient
var db;
var router = express.Router();

MongoClient.connect('mongodb://henry:dog123@ds147723.mlab.com:47723/homework', (err, client) => {
  if (err) return console.log(err)
  port = process.env.PORT || 80
  db = client.db('homework') // whatever your database name is
  app.listen(port, () => {
    console.log('listening on 80')
  })
})
// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

// get an instance of the express Router
var router = express.Router();

// a “get” at the root of our web app: http://localhost:3000/api
router.get('/', function(req, res) {
  console.log("get");  //logs to terminal

  db.collection('tasks').find().toArray((err, result) => {
  if (err) return console.log(err)

  console.log(result)

  res.render('index.ejs', {tasks: result})
})


});

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
//==========================================================
//app.listen(3000, () =>

app.post('/api/tasks', (req, res) => {
  db.collection('tasks').find().toArray(function(err,result){
     var id = result.length+1
     var tasks =req.body.tasks
     var day =req.body.day
     db.collection('tasks').insertOne({tasks:tasks, day:day, id:id})
     console.log(result)
     res.redirect('/api')
   })
    console.log("Hell YEah")
})
app.post('/api/delete', (req,res) => {
  var id = parseInt(req.body.buttonId)
  console.log(id)
  db.collection('tasks').findOneAndDelete({id:id})
  res.redirect('/api')
})
app.post('/api/toEdit', (req,res) => {
  var id = parseInt(req.body.buttonId)

  db.collection('tasks').find({id:id}).toArray(function(err,result){
    var id1 = parseInt(req.body.buttonId)
    console.log(result)
    var task = result[0].tasks
    console.log(task)
    console.log(id1)
    res.render('edit.ejs', {tasks:task, taskId:id1})
   })

})
app.post('/api/edit', (req,res) => {
  var Id = parseInt(req.body.taskId)
  var newtask = req.body.tasks
  var newday = req.body.day
  db.collection('tasks').updateOne({id:Id},
    { $set: {tasks:newtask, day: newday}},
     (err, res) => {
    if (err) throw err;
    console.log("1 document updated");

  });
  res.redirect('/api')
})
