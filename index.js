
// index.js
const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('-------')
//   console.log('It worked! Returned IP:' , ip.ip);
// });

// fetchCoordsByIP('70.48.36.66', (error, coords) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('-------')
//   console.log('It worked! Returned Coords:' , coords);

// });

// fetchISSFlyOverTimes({ latitude: '43.85010', longitude: '-79.51630' }, (error, schedule) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('-------')
//   console.log('It worked! Returned ISS FlyOver Schedule:' , schedule);
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

//nextISSTimesForMyLocation((msg) => console.log(msg));