const mongoose = require('mongoose');

var VacancySchema = new mongoose.Schema({
  region: [{
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
      adg: [{
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
          zone: [{
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
              sanctioned_strength: {
                type: Number,
                required: true
              },
              existing_strength: {
                type: Number,
                required: true
              },
              vacancy: {
                number: {
                  type: Number,
                  required: true
                },
                positions: [{
                  designation: {
                    type: String,
                    required: true
                  }
                }]
              }
          }]
      }]
  }]
});

VacancySchema.statics.findVacantPositions = function () {
  var Vacancy = this;
  Vacancy.find({
    
  }).then((vacant_positions) => {
    if(vacant_positions.length == 0) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      resolve(vacant_positions);
    });
  })
};

/*VacancySchema.statics.findVacantPositions = function (email, password) {
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
};*/


var Vacancy = mongoose.model('Vacancy', VacancySchema);

module.exports = {
  Vacancy
};
