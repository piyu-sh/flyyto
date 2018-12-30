import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoaderImg from './loader.svg';

const styles = {
  content: {
    textAlign: 'center',
    fontSize: '35px'
  }
};

class LoadingText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text
    };
  }

  componentDidMount() {
    let stopper = this.props.text + '...';
    this.interval = window.setInterval(() => {
      if (this.state.text === stopper) {
        this.setState(() => {
          return {
            text: this.props.text
          };
        });
      } else {
        this.setState(prevState => {
          return {
            text: prevState.text + '.'
          };
        });
      }
    }, this.props.speed);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <p className="loading-text" style={styles.content}>
        {this.state.text}
      </p>
    );
  }
}

LoadingText.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired
};

LoadingText.defaultProps = {
  text: 'Loading',
  speed: 300
};

function LoadingImage(props) {
  return (
    <p className="loading-image">
      <img src={props.imgUrl} />
    </p>
  );
}

LoadingImage.propTypes = {
  imgUrl: PropTypes.string.isRequired
};

LoadingImage.defaultProps = {
  imgUrl: LoaderImg
};

function Loading(props) {
  const type = props.type;
  return (
    <div className="loading">
      {type === 'image' && <LoadingImage />}
      {type !== 'image' && <LoadingText />}
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['text', 'image'])
};

Loading.defaultProps = {
  text: 'Loading',
  speed: 300,
  type: 'image'
};

export default Loading;
