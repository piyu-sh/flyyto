import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import moment from 'moment';
import { Store } from "../../utils/WebStore";
import AirportAPI from '../../apis/Airport';

import 'react-select/dist/react-select.css';
import './Widget.css';

const storeSearch = (search) => {
  return Store.set('lastSearched', search);
}

const fetchSearch = () => {
  return Store.get('lastSearched');
}

const validateForm = (planObj) => {
  let errorsObj = {};
  const today = moment();

  if(!planObj.origin){
    errorsObj.origin = 'Select your departure city'
  }

  if(!planObj.destination){
    errorsObj.destination = 'Select your destination city'
  }

  if(!planObj.departureDate){
    errorsObj.departureDate = 'Select your departure date'
  }else if(moment(planObj.departureDate).isBefore(today, 'day')){
    errorsObj.departureDate = "Departure date can't be less than today's date"
  }

  if(planObj.bookingType === 'return'){
    if(!planObj.returnDate){
      errorsObj.returnDate = 'Select your return date'
    }else if((moment(planObj.returnDate).isBefore(today, 'day'))){
      errorsObj.returnDate = "Return date can't be less than today's date"
    }else if(moment(planObj.returnDate).isBefore(moment(planObj.departureDate), 'day')){
      errorsObj.returnDate = 'Return date should be greater than departure date'
    }
  }

  if(!planObj.passengersCount || planObj.passengersCount < 1){
    errorsObj.passengersCount = 'Enter number of passengers'
  }


  return {
    status: Object.keys(errorsObj).length === 0 && errorsObj.constructor === Object,
    errors: errorsObj
  }
}

class WidgetTravelPlan extends Component {
  constructor(props) {
    super();

    this.state = {
        bookingType: "return",
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengersCount: 1,
        searchErrors: {},
        lastSearched: null
    }

    this.toggleBookingType = this.toggleBookingType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearErrorMessages = this.clearErrorMessages.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.renderSelectedValue = this.renderSelectedValue.bind(this);
    this.updateLastSearched = this.updateLastSearched.bind(this);
    this.useLastSearched = this.useLastSearched.bind(this);
  }

  toggleBookingType(type, event) {
    this.setState(() => {
      return {
        bookingType: type
      }
    });
    if(type !== 'return'){
      this.clearErrorMessages('returnDate');
    }
  }

  clearErrorMessages(field){
    this.setState((prevState) => {
      let searchErrorsUpdated = prevState.searchErrors;
      delete searchErrorsUpdated[field];

      if(Object.keys(searchErrorsUpdated).length === 1 && searchErrorsUpdated.hasOwnProperty("overall")){
        searchErrorsUpdated = {};
      }

      return {
        searchErrors: searchErrorsUpdated
      };
    });
  }

  handleSelectChange(field, selectedValue) {
    let object = {};
    object[field] = selectedValue;
    this.setState(object);
    this.clearErrorMessages(field);
  }

  handleChange(field, event) {
    let object = {};
    object[field] = event.target.value;
    this.setState(object);
    this.clearErrorMessages(field);
  }

  handleSubmit(event){
    event.preventDefault();
    this.setState({ searchErrors: {} });
    const updatedPlan = {
      bookingType: this.state.bookingType,
      origin: this.state.origin,
      destination: this.state.destination,
      departureDate: this.state.departureDate,
      returnDate: this.state.returnDate,
      passengersCount: this.state.passengersCount
    };
    const validationTestResult = validateForm(updatedPlan);
    this.setState({ searchErrors: validationTestResult.errors });

    if(validationTestResult.status){
      this.props.toggleForm('PlanForm');
      this.props.handleSearch(updatedPlan);
      storeSearch(updatedPlan).then(() => {
        this.updateLastSearched();
      });

    }else{
      this.setState((prevState) => {
        let searchErrorsUpdated = prevState.searchErrors;
        searchErrorsUpdated.overall = 'Please enter your travel plan';
        return {
          searchErrors: searchErrorsUpdated
        };
      });
    }
  }

  getOptions(input) {
    return AirportAPI.fetchAirports(input)
      .then((response) => {
        return { options: response };
      });
  }

  renderSelectedValue(selectedValue){
    return `${selectedValue.city}, ${selectedValue.country} (${selectedValue.code})`;
  }

  updateLastSearched(){
    fetchSearch().then((lastSearched) => {
      if(lastSearched){
        this.setState(() => {
          return {
            lastSearched
          };
        })
      }
    });
  }

  useLastSearched(){
    const lastSearched = this.state.lastSearched;
    if(lastSearched){
      this.setState(() => {
        return {
          bookingType: lastSearched.bookingType,
          origin: lastSearched.origin,
          destination: lastSearched.destination,
          departureDate: lastSearched.departureDate,
          returnDate: lastSearched.returnDate,
          passengersCount: lastSearched.passengersCount
        };
      })
    }
  }

  componentDidMount(){
    this.updateLastSearched();
  }


  render() {
    const today = moment();
    const isReturn = this.state.bookingType === "return",
          originCode = this.state.origin? this.state.origin.code : '',
          destinationCode = this.state.destination? this.state.destination.code : '';
    const { searchErrors, lastSearched } = this.state;
    const bookingTypeTitle = {
      oneway: "One Way",
      return: "Round Trip",
    };

    return (
      <div className={"widget travel-plan-widget" + (this.props.isActive ? " show" : "")}>
        <form className="widget-body" onSubmit={this.handleSubmit.bind(this)} noValidate>
          <div className="button-tabs">
            <button type="button" className={"btn btn-tab" + (isReturn ? "":" active")} onClick={this.toggleBookingType.bind(this, "oneway")}>One way</button>
            <button type="button" className={"btn btn-tab" + (isReturn ? " active":"")} onClick={this.toggleBookingType.bind(this, "return")}>Return</button>
          </div>
          <div className="form-elements">
            <div className="form-element">
              <label>Enter Origin City</label>
              <Select.Async
                  name="origin-city"
                  autoBlur={true}
                  labelKey="city"
                  valueKey="code"
                  placeholder="Enter Origin City"
                  loadOptions={this.getOptions.bind(this)}
                  value={originCode}
                  valueRenderer={this.renderSelectedValue.bind(this)}
                  onChange={this.handleSelectChange.bind(this, 'origin')} />
              { searchErrors.origin && <p className="error-label">{searchErrors.origin}</p> }
            </div>
            <div className="form-element">
              <label>Enter Destination City</label>
              <Select.Async
                  name="destination-city"
                  autoBlur={true}
                  labelKey="city"
                  valueKey="code"
                  placeholder="Enter Destination City"
                  loadOptions={this.getOptions.bind(this)}
                  value={destinationCode}
                  valueRenderer={this.renderSelectedValue.bind(this)}
                  onChange={this.handleSelectChange.bind(this, 'destination')} />
              { searchErrors.destination && <p className="error-label">{searchErrors.destination}</p> }
            </div>
            <div className="form-element">
              <label>Departure Date</label>
              <input type="date"
                      min={today.format("YYYY-MM-DD")}
                      value={this.state.departureDate}
                      placeholder="Departure Date"
                      onChange={this.handleChange.bind(this, 'departureDate')} />
              { searchErrors.departureDate && <p className="error-label">{searchErrors.departureDate}</p> }
            </div>
            {
              isReturn &&
              <div className="form-element">
                <label>Return Date</label>
                <input type="date"
                        min={this.state.departureDate}
                        value={this.state.returnDate}
                        placeholder="Return Date"
                        onChange={this.handleChange.bind(this, 'returnDate')} />
                { searchErrors.returnDate && <p className="error-label">{searchErrors.returnDate}</p> }
              </div>
            }
            <div className="form-element">
              <label>Passengers</label>
              <input type="number"
                      min={1}
                      max={20}
                      value={this.state.passengersCount}
                      placeholder="Passengers"
                      onChange={this.handleChange.bind(this, 'passengersCount')} />
              { searchErrors.passengersCount && <p className="error-label">{searchErrors.passengersCount}</p> }
            </div>

            {
              searchErrors.overall &&
                <div className="overall-error-label">
                  <p>{searchErrors.overall}</p>
                </div>
            }

            <button type="submit" className="btn btn-search">Search Flights</button>
            {
              // Disabled due to an issue related to a bug in Select component
              false && lastSearched &&
              <div className="last-searched" onClick={this.useLastSearched.bind(this)}>
                <label>Use Last Searched:</label>
                <p>
                  {bookingTypeTitle[lastSearched.bookingType]}, {lastSearched.origin.city} > {lastSearched.destination.city}
                  {
                    lastSearched.bookingType === 'return' &&
                    <span> > {lastSearched.origin.city}</span>
                  }
                </p>
              </div>
            }
          </div>
        </form>
      </div>
    )
  }
}

WidgetTravelPlan.propTypes = {
  isActive: PropTypes.bool.isRequired,
  handleSearch: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired
}

WidgetTravelPlan.defaultProps = {
  isActive: false
}

export default WidgetTravelPlan;
