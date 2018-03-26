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

/* ----------- Handles for employee transfer -------------- */
// Handle for auto transfer of employees
app.post('/transfer', (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
