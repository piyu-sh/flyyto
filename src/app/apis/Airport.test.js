import Airport from './Airport';

describe('API Airport', () => {

  describe('fetchAirports Promise', () => {
    it('should return an empty array if no search string is passed', () => {
      expect.assertions(1);
      return Airport.fetchAirports().then(data => {
        expect(data).toEqual([]);
      });
    });

    it('should return an empty array if no airport is matched with search string', () => {
      expect.assertions(1);
      return Airport.fetchAirports("RPR").then(data => {
        expect(data).toEqual([]);
      });
    });

    it('should return an array of objects according to search string is passed', () => {
      const expected = [{
                "airportId": "1",
                "code": "PNQ",
                "name": "Pune Airport",
                "city": "Pune",
                "state": "Maharashtra",
                "country": "India",
                "type": "Domestic"
              }],
            unexpected = [{
                "airportId": "2",
                "code": "BLR",
                "name": "Bangalore International Airport",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "India",
                "type": "International"
              }];
      expect.assertions(2);
      return Airport.fetchAirports('Pune').then(data => {
        expect(data).toEqual(expect.arrayContaining(expected));
        expect(data).not.toEqual(expect.arrayContaining(unexpected));
      });
    });

  });

});
