import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

import './TravelSummary.css';

const TravelSummary = props => {
  const isReturnTrip = props.travelPlan.bookingType === 'return';

  return (
    <div className="travel-summary">
      <h2 className="origin-destination">
        {props.travelPlan.origin.city}
        <span className="separator"> &gt; </span>
        {props.travelPlan.destination.city}
        {
          isReturnTrip &&
            <span>
              <span className="separator"> &gt; </span>
              {props.travelPlan.origin.city}
            </span>
        }
      </h2>
      <div className="depart-return">
        <div className="depart-date">
          <label>Depart: </label>
          <Moment as="p" format="Do MMM YYYY">{props.travelPlan.departureDate}</Moment>
        </div>
        {
          isReturnTrip &&
            <div className="return-date">
              <label>Return: </label>
              <Moment as="p" format="Do MMM YYYY">{props.travelPlan.returnDate}</Moment>
            </div>
        }
      </div>
    </div>
  )
}

TravelSummary.propTypes = {
  travelPlan: PropTypes.object.isRequired
}

export default TravelSummary;
