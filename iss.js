/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (error, response, body) => {
  
    //CHECKS FOR ERROR AND RETURNS 
    if (error) {
      callback(error, null);
      return;
    }
    
    //IF RESPONSE CODE NOT 200 THEN SENDS ERROR WITH MSG
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body);

    callback(null, ip.ip);
  });

}

const fetchCoordsByIP = function(ip, callback) {
  const url = `https://ipvigilante.com/${ip}`;  
  
  request(url, (error, response, body) => {

    //CHECKS FOR ERROR AND RETURNS 
    if (error) {
     callback(error, null);
     return;
    }      
    
    //IF RESPONSE CODE NOT 200 THEN SENDS ERROR WITH MSG
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    //CREATES OBJECT FROM DATA AND PASSES LAT AND LONG TO NEW OBJ
    const locationData = JSON.parse(body);
    
    const latitude = locationData.data.latitude;
    const longitude = locationData.data.longitude;

    let objLocation = {latitude, longitude};

    // const { latitude, longitude } = JSON.parse(body).data;

    // callback(null, { latitude, longitude });
    
    callback(null, objLocation);
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const lon = coords.longitude
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;  
  
  
  request(url, (error, response, body) => {

    //CHECKS FOR ERROR AND RETURNS 
    if (error) {
     callback(error, null);
     return;
    }      
    
    //IF RESPONSE CODE NOT 200 THEN SENDS ERROR WITH MSG
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    //CREATES OBJECT FROM DATA AND PASSES LAT AND LONG TO NEW OBJ
    const flyOverData = JSON.parse(body);

    let objISSOver = flyOverData.response;

    // const passes = JSON.parse(body).response;
    // callback(null, passes);
    
    callback(null, objISSOver);
  });

};


// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback){
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip , (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, schedule) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, schedule);
      })
    })
  })
}



module.exports = { nextISSTimesForMyLocation };


