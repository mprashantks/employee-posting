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
                type: Number,
                required: true,
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


var Vacancy = mongoose.model('Vacancy', VacancySchema);

module.exports = {
  Vacancy
};
