import AirportJSON from './data/airports.json';

// Function to get array of airports filtered by search term
// matches with any of code, city or name property of an airport
function getAirportsByString(AirportsArr, searchStr){
  return AirportsArr.filter((airport) => {
      const searchStrLowerCase = searchStr.toLowerCase();
      return airport.code.toLowerCase().indexOf(searchStrLowerCase) >= 0 || airport.name.toLowerCase().indexOf(searchStrLowerCase) >= 0 || airport.city.toLowerCase().indexOf(searchStrLowerCase) >= 0;
  });
}

// Error handling callback function
function handleError(error) {
  console.warn(error);
  return null;
}

// Function to fetch an array of airports
function fetchAirports(searchStr = "") {
  return new Promise(
    function (resolve, reject) {
        try {
            if(searchStr == ""){
                resolve([]);
            }
            else{
                const some = getAirportsByString(AirportJSON, searchStr);
                resolve(some);
            }
        } catch (error) {
            reject(error);
        }
    }
  );
}

export default { fetchAirports };
