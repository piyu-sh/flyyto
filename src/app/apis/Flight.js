import FlightsJSON from './data/flights.json';

// Function to get array of flights between from and to airport code
function getFlightsBetween(flightsArr = [], fromAirportCode, toAirportCode){
  return flightsArr.filter((flight) => {
    return flight.origin.code === fromAirportCode && flight.destination.code === toAirportCode;
  });
}

// Error handling callback function
function handleError(error) {
  console.warn(error);
  return null;
}

// Function to fetch array of flight plans according to passed travel plan
function fetchFlights(travelPlan) {
  return new Promise(
    function (resolve, reject) {
      try {
        if(!travelPlan || !travelPlan.hasOwnProperty("origin") || !travelPlan.hasOwnProperty("origin")){
          reject(new Error("Invalid travel plan"));
        }

        const originCode = travelPlan.origin.code,
              destinationCode = travelPlan.destination.code;
        let toFlightsArr, returnFlightsArr, flightPlansArr;

        toFlightsArr = getFlightsBetween(FlightsJSON, originCode, destinationCode);

        if(travelPlan.bookingType === 'return'){
          returnFlightsArr = getFlightsBetween(FlightsJSON, destinationCode, originCode);

          // Creating array of flight plans using 'to' and 'return' flights array
          flightPlansArr = toFlightsArr.map((toFlight) => {
            return returnFlightsArr.map((returnFlight) => {
              return {
                planId: toFlight.flightId + '-' + returnFlight.flightId,
                totalAmount: toFlight.fare.basicAmount + returnFlight.fare.basicAmount,
                toFlight,
                returnFlight
              };
            });
          });

          // Flattening the nested array from above code
          flightPlansArr = flightPlansArr.reduce(function(a, b) {
            return a.concat(b);
          }, []);
        }else{
          // Creating array of flight plans using 'to' flights array
          flightPlansArr = toFlightsArr.map((toFlight) => {
            return {
              planId: toFlight.flightId + '-',
              totalAmount: toFlight.fare.basicAmount,
              toFlight
            };
          });
        }

        flightPlansArr = flightPlansArr.sort(function (a, b) {
          return a.totalAmount - b.totalAmount;
        });

        window.setTimeout(() => {
          resolve(flightPlansArr);
        }, 2000);

      } catch (error) {
        reject(error);
      }

    }
  );
}

// Function to get min and max price from passed array of flights
function getPriceRange(flightsArr = []) {
  let priceRange = {
    minPrice: 0,
    maxPrice: 50000
  };
  if(flightsArr && flightsArr.length > 1){
    priceRange.minPrice = flightsArr[0].totalAmount;
    priceRange.maxPrice = flightsArr[flightsArr.length-1].totalAmount;
  }
  return priceRange;
}

// Function to get array of flights filtered by passed min and max price range
function filterFlightsByPrice(flightsArr = [], refineRange){
  return flightsArr.filter((flight) => {
    return flight.totalAmount >= refineRange.min && flight.totalAmount <= refineRange.max;
  });
}

export default { fetchFlights, getPriceRange, filterFlightsByPrice };
