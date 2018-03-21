const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var EmployeeSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: 6,
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
  dob: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
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
    }
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
    }
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

var Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = {
  Employee
};
