const mongoose = require('mongoose');

var AutoTransfer = mongoose.model('AutoTransfer', {
  code: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  transfer: [{
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
    score: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = {
  AutoTransfer
};
