const mongoose = require('mongoose');

var ChoiceTransfer = mongoose.model('ChoiceTransfer', {
  code: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  score: {
    type: Number,
    default: 0
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
  }
});

module.exports = {
  ChoiceTransfer
};
