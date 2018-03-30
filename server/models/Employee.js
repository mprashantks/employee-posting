const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

var EmployeeSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  name: {
    first: {
      type: String,
      minlength: 2,
      required: true
    },
    middle: {
      type: String
    },
    last: {
      type: String
    }
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  posting: {
    dolp: {
      type: Date,
      required: true
    },
    donp: {
      type: Date,
      required: true
    }
  },
  email: {
    type: String,
    trim: true,
    minlength: 1,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  reservation: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  staff_category: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  region: {
    authority: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    adg: {
      authority: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      zone: {
        authority: {
          type: String,
          required: true
        },
        code: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }
    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Called by server.js /employees route to register
EmployeeSchema.pre('save', function (next) {
  var employee = this;
  if(employee.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(employee.password, salt,  (err, hash) => {
        employee.password = hash;
        next();
      })
    });
  } else {
    next();
  }
});


EmployeeSchema.methods.generateAuthToken = function () {
  var employee = this;
  var access = 'auth';
  var token = jwt.sign({_id: employee._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  employee.tokens.push({access, token});
  return employee.save().then(() => {
    return token;
  });
};

EmployeeSchema.methods.removeToken = function (token) {
  var employee = this;
  return employee.update({
    $pull: {
      tokens: {token}
    }
  });
};

// Called by server.js employees/login route for login
EmployeeSchema.statics.findByCredentials = function (email, password) {
  var Employee = this;
  return Employee.findOne({email}).then((employee) => {
    if(!employee) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, employee.password, (err, res) => {
          if(res) {
            resolve(employee);
          } else {
            reject();
          }
      })
    });
  });
};

// Called by server.js employees/ route to verify if employee database consist of particular employee code or not
EmployeeSchema.statics.findByCode = function (code, email) {
  var Employee = this;
  return Employee.findOne({code}).then((employee) => {
    if(!employee) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      if(employee.email === email) {
        resolve(employee);
      } else {
        reject();
      }
    });
  });
};

// Called by middleware/authenticate to find if user is authentic or logged in
EmployeeSchema.statics.findByToken = function (token) {
  var Employee = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    return Promise.reject();
  }
  return Employee.findOne({
    '_id': decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};


/* --------------- Employee transfer ----------------*/
// Query employee collection to get all employees with nearing transfer date
EmployeeSchema.statics.findTransferEmployees = function () {
  var Employee = this;
  var current_date = moment();
  var next_transfer_date = moment(current_date).add(6, 'months');
  return Employee.find({
    'posting.donp': {
      $gte: current_date.toDate(),
      $lte: next_transfer_date.toDate()
    }
  }).then((employees) => {
    if(employees.length == 0) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      resolve(employees);
    });
  });
};


var Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = {
  Employee
};
