import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Header.css';

const Header = props => {
  return (
    <header>
      <div className="container">
        <div className="header-wrapper">
          <h1 className="hidden-xs visible-lg"><span className="symbol-lg">&#9992;</span> Flyyto - Flight Search App</h1>
          <h1 className="visible-xs hidden-lg"><span className="symbol">&#9992;</span> Flyyto</h1>
          <div className="toggle-buttons">
            <button type="button"
                    className={"btn btn-toggle" + (props.activeForm==="PlanForm"? " active":"")}
                    onClick={props.handleToggle.bind(this, "PlanForm")}>
                      Modify
                    </button>
            {
              !props.hideRefine &&
                <button type="button"
                        className={"btn btn-toggle" + (props.activeForm==="RefineForm"? " active":"")}
                        onClick={props.handleToggle.bind(this, "RefineForm")}>
                          Refine
                        </button>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  activeForm: PropTypes.string.isRequired,
  hideRefine: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired
}

Header.defaultProps = {
  activeForm: "none",
  hideRefine: true
}

export default Header;
