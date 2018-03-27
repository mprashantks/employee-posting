require('./config/config');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Employee} = require('./models/Employee');
const {Vacancy} = require('./models/Vacancy');
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
  Employee.findByEmail(body.email).then(() => {
    console.log('find by code');
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
app.post('/admin/transfer', (req, res) => {
  Employee.findTransferEmployees().then((employees) => {
    res.status(200).send(employees);
  }).catch((e) => {
    res.status(400).send();
  });
});

// // Handle to find vacant_positions
// app.post('/admin/vacancy', (req, res) => {
//   Vacancy.findVacantPositions().then((vacant_positions) => {
//     res.status(200).send(vacant_positions);
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// Handle to find vacant_positions
app.post('/admin/vacancy', (req, res) => {
  Vacancy.findVacantPositions().then((vacant_positions) => {
    vacant_positions.forEach((r) => {
      r.region.forEach((region) => {
        region.adg.forEach((adg) => {
          adg.zone.forEach((zone) => {
            if (zone.vacancy.number > 0) {
              zone.vacancy.positions.forEach((position) => {
                console.log(position);
              });
            }
          });
        })
      });
    });
    res.status(200).send(vacant_positions);
  }).catch((e) => {
    res.status(400).send();
  });
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
