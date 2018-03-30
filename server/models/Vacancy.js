const mongoose = require('mongoose');

var VacancySchema = new mongoose.Schema({
  name: String,
  region: [{
      authority: String,
      code: String,
      name: String,
      adg: [{
          authority: String,
          code: String,
          name: String,
          zone: [{
              authority: String,
              code: String,
              name: String,
              sanctioned_strength: Number,
              existing_strength: Number,
              vacancy: {
                number: Number,
                positions: [{
                  designation: String,
                  number : Number
                }]
              }
          }]
      }]
  }]
});

// VacancySchema.methods.toJSON = function () {
//   var vacancy = this;
//   var vacancyObject = vacancy.toObject();
//   return _.pick(vacancyObject, ['_id', 'code', 'email']);
// };

VacancySchema.statics.findVacantPositions = function () {
  var Vacancy = this;
  return Vacancy.find({}).then((vacant_positions) => {
    if (vacant_positions.length == 0) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      resolve(vacant_positions);
    });
  })
};


var Vacancy = mongoose.model('Vacancy', VacancySchema);

module.exports = {
  Vacancy
};
