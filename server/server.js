require('./config/config');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
// const {Todo} = require('./models/Todo');
const {Employee} = require('./models/Employee');
const {authenticate} = require('./middleware/authenticate');

const publicPath = path.join(__dirname, '/../public');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(publicPath));

// //Handle for inserting todos in database
// app.post('/todo', authenticate, (req, res) => {
//   var newTodo = new Todo({
//     text: req.body.text,
//     _creator: req.user._id
//   });
//
//   newTodo.save().then((doc) => {
//     res.send(doc);
//   }, (err) => {
//     res.status(400).send(err);
//   });
// });
//
// //Handle for listing todos from database
// app.get('/todo', authenticate, (req, res) => {
//   Todo.find({
//     _creator: req.user._id
//   }).then((todos) => {
//     res.send({todos});
//   }, (err) => {
//     res.status(400).send(err);
//   });
// });
//
// //Handle to list a todo by id
// app.get('/todo/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   if(!ObjectID.isValid(id)) {
//     return res.status(404).send('Not a valid ID');
//   }
//
//   Todo.findOne({
//     _id: id,
//     creator: req.user._id
//   }).then((todo) => {
//     if(!todo) {
//       return res.status(404).send('Todo not found');
//     }
//     res.send({todo});
//   }, (err) => {
//     res.status(400).send(err);
//   });
// });
//
// //Handle to remove a todo by id
// app.delete('/todo/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//
//   if(!ObjectID.isValid(id)) {
//     return res.status(404).send('ID not valid');
//   }
//
//   Todo.findOneAndRemove({
//     _id: id,
//     creator: req.user._id
//   }).then((todo) => {
//     if(!todo) {
//       return res.status(404).send('Todo not found');
//     }
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });
//
// //Handle to update a todo
// app.patch('/todo/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//
//   if(!ObjectID.isValid(id)) {
//     return res.status(404).send('Not a valid ID');
//   }
//
//   var body = _.pick(req.body, ['text', 'completed']);
//
//   if(_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completedAt = null;
//     body.completed = false;
//   }
//
//   Todo.findOneAndUpdate({_id: id, creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
//     if(!todo) {
//       return res.status(404).send('Todo not found');
//     }
//     res.send({todo});
//   }).catch((err) => {
//     res.status(400).send(err);
//   });
// });

//Handle to create a User
app.post('/employees', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'code']);

  console.log(body);

  Employee.findByCode(body.code).then((employee) => {
    employee.email = body.email;
    employee.password = body.password;
    employee.save().then(() => {
      return employee.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(employee);
    }).catch((e) => {
      res.status(400).send(e);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//Handle for login
app.post('/employees/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  Employee.findByCredentials(body.email, body.password).then((employee) => {
    employee.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(employee);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// Handle to get Employee profile information
app.get('/employees/me', authenticate, (req, res) => {
  res.send(req.employee);
});

//Handle for logout
app.delete('/employees/me/token', authenticate, (req, res) => {
  req.employee.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
