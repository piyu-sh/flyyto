import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from './components/Loading';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import WidgetTravelPlan from './components/widgets/WidgetTravelPlan';
import WidgetRefineSearch from './components/widgets/WidgetRefineSearch';
import TravelSummary from './components/travel-summary/TravelSummary';
import Flights from './components/flights/Flights';

import FlightAPI from './apis/Flight';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      travelPlan: {
        bookingType: "return",
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengersCount: 1
      },
      mobileActiveForm: "PlanForm",
      resultFlights: null,
      unfilteredFlights: null,
      refinePriceRange: {
        minPrice: 0,
        maxPrice: 50000
      },
      loading: false
    }

    this.toggleLoading = this.toggleLoading.bind(this);
    this.toggleActiveForm = this.toggleActiveForm.bind(this);
    this.searchFlights = this.searchFlights.bind(this);
    this.refineFlights = this.refineFlights.bind(this);
    this.updateTravelPlan = this.updateTravelPlan.bind(this);
  }

  toggleLoading(value){
    this.setState({loading: value});
  }

  toggleActiveForm(formName){
    this.setState((prevState) => {
      return {
        mobileActiveForm: (formName !== prevState.mobileActiveForm) ? formName : "none"
      }
    });
  }

  searchFlights(travelPlan){
    FlightAPI.fetchFlights(travelPlan)
      .then((response) => {
        const newPriceRange = FlightAPI.getPriceRange(response);
        this.setState({
            refinePriceRange: newPriceRange,
            resultFlights: response,
            unfilteredFlights: response
        });
        this.toggleLoading(false);
      })
      .catch((error) => {
        console.error(error);
        this.toggleLoading(false);
      });

  }

  refineFlights(refineRange){
    this.toggleLoading(true);
    let filteredFlights = FlightAPI.filterFlightsByPrice(this.state.unfilteredFlights, refineRange)
    window.setTimeout(() => {
      this.setState({
        resultFlights: filteredFlights
      });
      this.toggleLoading(false);
    }, 1000);
  }

  updateTravelPlan(travelPlan){
    this.toggleLoading(true);
    this.setState((prevState) => {
      return {
        travelPlan: Object.assign({}, prevState.travelPlan, travelPlan)
      }
    })

    this.searchFlights(travelPlan);
  }

  render() {
    const { travelPlan, mobileActiveForm, resultFlights, refinePriceRange, loading } = this.state;

    return (
      <div className="App">

        <Header activeForm={mobileActiveForm} handleToggle={this.toggleActiveForm} hideRefine={!resultFlights} />

        <div className="page-container container">
          <div className="sidebar">
            <WidgetTravelPlan
                isActive={mobileActiveForm==="PlanForm"}
                handleSearch={this.updateTravelPlan}
                toggleForm={this.toggleActiveForm} />

            {
              resultFlights &&
                <WidgetRefineSearch
                    isActive={mobileActiveForm==="RefineForm"}
                    refinePriceRange={refinePriceRange}
                    handleRefine={this.refineFlights}
                    toggleForm={this.toggleActiveForm} />
            }
          </div>

          <div className="content">
            {
              loading &&
                <Loading />
            }
            {
              !loading && !resultFlights &&
                <div className="empty">
                  <h3>Enter your travel plan</h3>
                </div>
            }
            {
              !loading && resultFlights &&
                <div className="content-wrapper">
                  <TravelSummary travelPlan={travelPlan} />
                  <Flights flights={resultFlights} />
                </div>
            }
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
