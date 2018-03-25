const {Employee} = require('./../models/Employee');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  Employee.findByToken(token).then((employee) => {
    if(!employee) {
      return Promise.reject();
    }

    req.employee = employee;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {
  authenticate
};
