import Flight from './Flight';

describe('API Flight', () => {

  describe('fetchFlights Promise', () => {
    const travelPlan = {
        bookingType: "return",
        origin: {
          code: "PNQ"
        },
        destination: {
          code: "DEL"
        }
      },
      expectedForOneWayFlight = [{
        planId: expect.any(String),
        totalAmount: expect.any(Number),
        toFlight: expect.any(Object)
      }],
      expectedForReturnFlight = [{
        planId: expect.any(String),
        totalAmount: expect.any(Number),
        toFlight: expect.any(Object),
        returnFlight: expect.any(Object)
      }];

    const travelPlanUnavailable = Object.assign({}, travelPlan, { destination: { code: "RPR" } });

    it('should be rejected if travel plan is not passed', () => {
      expect.assertions(1);
      return expect(Flight.fetchFlights()).rejects.toBeDefined();
    });

    it('should return an empty array if no flights is matched with travel plan', () => {
      expect.assertions(1);
      return Flight.fetchFlights(travelPlanUnavailable).then(data => {
        expect(data).toEqual([]);
      });
    });

    it('should return an array of objects according to one way travel plan', () => {
      const oneWayTravelPlan = Object.assign({}, travelPlan, { bookingType: "oneway" });

      expect.assertions(1);
      return Flight.fetchFlights(oneWayTravelPlan)
        .then(data => {
          expect(data).toEqual(expect.arrayContaining(expectedForOneWayFlight));
        });
    });

    it('should return an array of objects according to return travel plan', () => {
      expect.assertions(1);
      return Flight.fetchFlights(travelPlan)
        .then(data => {
          expect(data).toEqual(expect.arrayContaining(expectedForReturnFlight));
        });
    });

  });

  describe('getPriceRange Function', () => {
    const flightsArr = [
            { totalAmount: 1000 },
            { totalAmount: 2000 },
            { totalAmount: 3000 },
            { totalAmount: 4000 }
          ],
          expectedCorrectObj = {
            minPrice: 1000,
            maxPrice: 4000
          },
          expectedDefaultObj = {
            minPrice: 0,
            maxPrice: 50000
          };

    it('should return the default price range object if flight array is empty or contain less then two flights', () => {
      expect(Flight.getPriceRange()).toEqual(expectedDefaultObj);
    });


    it('should return the price range object according to passed flights array', () => {
      expect(Flight.getPriceRange(flightsArr)).toEqual(expectedCorrectObj);
    });
  });

  describe('filterFlightsByPrice Function', () => {
    const flightsArr = [
            { flightId: "A", totalAmount: 1000 },
            { flightId: "B", totalAmount: 2000 },
            { flightId: "C", totalAmount: 3000 },
            { flightId: "D", totalAmount: 4000 }
          ],
          refineRangeSuccess = {
            min: 2500,
            max: 3500
          },
          refineRangeFailure = {
            min: 4500,
            max: 6500
          },
          expectedFlightsArr = [{ flightId: "C", totalAmount: 3000 }];

    it('should return an empty array if flight array is empty or price range does not match with any flights', () => {
      expect(Flight.filterFlightsByPrice([], refineRangeSuccess)).toEqual([]);

      expect(Flight.filterFlightsByPrice(flightsArr, refineRangeFailure)).toEqual([]);
    });

    it('should return the array of flights according to the passed price range', () => {
      expect(Flight.filterFlightsByPrice(flightsArr, refineRangeSuccess)).toEqual(expect.arrayContaining(expectedFlightsArr));
    });
  });

});
