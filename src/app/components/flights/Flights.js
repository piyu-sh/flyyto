import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import Common from '../../utils/Common';

import './Flights.css';

const FlightDetails = props => {
  const flight = props.flight;
  return (
    <div className="flight-details">
      <h4 className="flight-code">
        <span className="airline-code">{flight.airlineCode}</span>
        <span className="flight-number">{flight.flightNumber}</span>
      </h4>
      <p className="origin-destination">{flight.origin.code} > {flight.destination.code}</p>
      <div className="depart-time">
        <label>Depart: </label>
        <Moment as="p" parse="HH:mm" format="h:mm A">{flight.departureTime}</Moment>
      </div>
      <div className="arrive-time">
        <label>Arrive: </label>
        <Moment as="p" parse="HH:mm" format="h:mm A">{flight.arrivalTime}</Moment>
      </div>
    </div>
  )
}

FlightDetails.propTypes = {
  flight: PropTypes.object.isRequired
}

const FlightPlan = props => {
  const toFlight = props.plan.toFlight,
        returnFlight = props.plan.returnFlight || null,
        totalAmount = Common.formatCurrency(props.plan.totalAmount);

  return (
    <div className="flight-card">
      <div className="details">
        <h3>
          <span className="fare-amount">{totalAmount}</span>
        </h3>

        <div className="flight-details-wrapper">
          <FlightDetails flight={toFlight} />
          {
            returnFlight &&
              <FlightDetails flight={returnFlight} />
          }
        </div>
      </div>
      <aside>
        <div className="airline-logo">
          <img src="" alt="" />
        </div>
        <button type="button" className="btn btn-book">Book this flight</button>
      </aside>
    </div>
  )
}

FlightPlan.propTypes = {
  plan: PropTypes.object.isRequired
}

const Flights = props => {
  const flightsArr = props.flights;
  return (
    <div className="flights-wrapper">
      {
        flightsArr.map((plan) => {
          return <FlightPlan key={plan.planId} plan={plan} />
        })
      }
    </div>
  )
}

Flights.propTypes = {
  flights: PropTypes.array.isRequired
}

Flights.defaultProps = {
  flights: []
}

export default Flights;
