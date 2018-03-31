require('./config/config');

const path = require('path');
const express = require('express');``
const bodyParser = require('body-parser');
const _ = require('lodash');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'file.csv',
  header: [
    {id: 'Technical', title: 'Technical'},
    {id: 'communication', title: 'Communication'},
    {id: 'teamwork', title: 'Team Work'},
    {id: 'value_cocreation', title: 'Value Co-creation'},
    {id: 'leadership', title: 'ds'},
    {id: 'work_managmement', title: 'df'},
    {id: 'discipline', title: 'fd'},
    {id: 'time_management', title: 'df'},
    {id: 'personel_management', title: 'df'},
    {id: 'Values', title: 'df'},
    {id: 'honesty', title: 'fd'},
    {id: 'hardworking', title: 'df'},
    {id: 'sincerity', title: 's'},
    {id: 'responsible', title: 'sdf'},
    {id: 'ethics', title: 'fd'},
    {id: 'health', title: 'fd'},
    {id: 'age', title: 'fd'},
    {id: 'transfer_distribution', title: 'fdd'}
  ]
});

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
  // Employee.findByEmail(body.email).then(() => {
    console.log('find by code');
    Employee.findByCode(body.code, body.email).then((employee) => {
      employee.password = body.password;
      employee.save().then(() => {
        return employee.generateAuthToken();
      }).then((token) => {
        var data = {
          code: employee.code,
          email: employee.email,
          xauth: token
        }
        res.status(200).send(data);
      }).catch((e) => {
        res.status(400).send(e);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  // }).catch((e) => {
  //   res.status(400).send();
  // });
});

//Handle for login
app.post('/employees/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  Employee.findByCredentials(body.email, body.password).then((employee) => {
    employee.generateAuthToken().then((token) => {
      var data = {
        code: employee.code,
        email: employee.email,
        xauth: token
      }
      res.status(200).send(data);
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

// Handle to find employees and generate CSV
app.get('/vacancy', (req, res) => {
  Employee.findTransferEmployees().then((employees) => {
    var records = [];
    employees.forEach((employee) => {
      var record = {};
      employee.features.forEach((feature) => {
        record[feature.name] = feature.score;
      });
      records.push(record);
    });
    csvWriter.writeRecords(records)
    .then(() => {
      console.log('Done');
    });
    res.status(200).send();
  }).catch((e) => {
    res.status(204).send();
  });
});


/* ----------- Handles for employee transfer -------------- */
// Handle for auto transfer of employees based on circular rotation
// app.post('/admin/transfer', (req, res) => {
//   var indexToRegion = ['HQ', 'DR', 'NR', 'WR', 'ER', 'SR'];
//   var regionToIndex = {
//     HQ: 0,
//     DR: 1,
//     NR: 2,
//     WR: 3,
//     ER: 4,
//     SR: 5
//   };
//   Employee.findTransferEmployees().then((employees) => {
//     Vacancy.findVacantPositions().then((vacant_positions) => {
//       vacant_positions.forEach((r) => {
//         r.region.forEach((region) => {
//           region.adg.forEach((adg) => {
//             adg.zone.forEach((zone) => {
//               if (zone.vacancy.number > 0) {
//                 zone.vacancy.positions.forEach((position) => {
//                   console.log('-----------------------------------------------------------------------');
//                   console.log('Region: '+region.code+', ADG: '+adg.code+', Zone: '+zone.code+', Position: '+position.designation+' | '+position.number);
//                   var previous_region_code = indexToRegion[(5+regionToIndex[region.code])%6];
//                   employees.forEach((employee) => {
//                     if (employee.designation === position.designation && employee.region.code === previous_region_code) {
//
//                     }
//                   });
//                 });
//               }
//             });
//           })
//         });
//       });
//       res.status(200).send();
//     }).catch((e) => {
//       res.status(204).send('No vacant regions found');
//     });
//   }).catch((e) => {
//     res.status(204).send('No transferrable employees found');
//   });
// });

// Handle to find vacant_positions
// app.post('/vacancy', (req, res) => {
//   var body = _.pick(req.body, ['designation', 'region', 'adg', 'zone']);
//   console.log(body.designation);
//
//   Vacancy.findVacantPositions().then((vacant_positions) => {
//     vacant_positions.forEach((r) => {
//       r.region.forEach((region) => {
//         region.adg.forEach((adg) => {
//           adg.zone.forEach((zone) => {
//             if (zone.vacancy.number > 0) {
//               zone.vacancy.positions.forEach((position) => {
//                 if (position.designation == body.designation)
//                   console.log('Region: '+region.code+', ADG: '+adg.code+', Zone: '+zone.code+', Position: '+position.designation+' | '+position.number);
//               });
//             }
//           });
//         })
//       });
//     });
//     res.status(200).send();
//   }).catch((e) => {
//     res.status(204).send('No vacant regions found');
//   });
// });

// Handle to find vacant_positions based on selected options
// app.post('/vacancy', (req, res) => {
//   // var body = _.pick(req.body, ['designation', 'region', 'adg', 'zone']);
//   var body = _.pick(req.body, ['designation', 'regionCode']);
//
//   Vacancy.findVacantPositions().then((r_region) => {
//     r_region = r_region[0];
//     if (typeof body.regionCode != "undefined") {     // Region given
//       r_region.region.some((region) => {
//         return region.code == body.regionCode;
//       });
//       console.log(region);
//       // if (body.adg != undefined) {      // ADG given
//       //   var adg = getAdg(body.adg, region.adg);
//       //   if (body.zone != undefined) {   // Zone given
//       //     var zone = getZone(body.zone, adg.zone);
//       //     getVacantPositions(adg.zone, body.position);
//       //   } else {                        // Not zone given
//       //     adg.zone.forEach((zone) => {
//       //       getVacantPositions(zone, body.position);
//       //     });
//       //   }
//       // } else {                          // Not adg given
//       //   region.adg.forEach((adg) => {
//       //     adg.zone.forEach((zone) => {
//       //       getVacantPositions(zone, body.position);
//       //     });
//       //   })
//       // }
//     } else {                            // Not region given
//       console.log('else');
//       r_region.region.forEach((region) => {
//         region.adg.forEach((adg) => {
//           adg.zone.forEach((zone) => {
//             getVacantPositions(zone, body.position);
//           });
//         })
//       });
//     }
//
//     res.status(200).send();
//   }).catch((e) => {
//     res.status(204).send('No vacant regions found');
//   });
// });

function getRegion(regionCode, regions) {
  regions.some((region) => {
    if (region.code == regionCode)
      return region;
  });
}

function getAdg(adgCode, adgs) {
  adgs.forEach((adg) => {
    if (adg.code == adgCode)
      return adg;
  });
}

function getZone(zoneCode, zones) {
  zoness.forEach((zone) => {
    if (zone.code == zoneCode)
      return zone;
  });
}

function getVacantPositions(zone, desg) {
  if (zone.vacancy.number > 0) {
    zone.vacancy.positions.forEach((position) => {
      if (position.designation == desg)
        console.log('Region: '+region.code+', ADG: '+adg.code+', Zone: '+zone.code+', Position: '+position.designation+' | '+position.number);
    });
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
