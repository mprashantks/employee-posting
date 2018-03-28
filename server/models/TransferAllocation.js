const mongoose = require('mongoose');

var TransferAllocation = mongoose.model('TransferAllocation', {
  code: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  region: {
    authority: String,
    code: String,
    name: String,
    adg: {
      authority: String,
      code: String,
      name: String,
      zone: {
        authority: String,
        code: String,
        name: String,
      }
    }
  }
});

module.exports = {
  TransferAllocation
};
