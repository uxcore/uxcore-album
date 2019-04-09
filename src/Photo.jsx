/* eslint-disable class-methods-use-this */
/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class Photo extends React.Component {
  constructor(props) {
    super(props);
    const { rotate, scale } = props;
    this.state = { rotate: rotate || 0, scale: scale || 1 };
  }

  setStyle(rotate, scale) {
    this.setState({ rotate: rotate || 0, scale: scale || 1 });
  }

  getStyle() {
    const { rotate, scale } = this.state;
    const style = {};
    ['Webkit', 'Moz', 'ms', ''].forEach((prefix) => {
      style[`${prefix}Transform`] = `scale(${scale}) rotate(${rotate}deg)`;
    });
    return style;
  }

  handleMaskClick(e) {
    const { target } = e;
    let { onMaskClick, maskClosable } = this.props;
    if (maskClosable === undefined) {
      maskClosable = true;
    }
    if (maskClosable === true && target.className === 'album-item') {
      if (typeof onMaskClick === 'function') {
        onMaskClick(e);
      }
    }
  }


  render() {
    return (
      <div
        className="album-item"
        onClick={this.handleMaskClick.bind(this)}
      >
        <img src={this.props.src} alt="" ref={img => (this.img = img)} style={this.getStyle()} />
      </div>
    );
  }
}

Photo.defaultProps = {
  src: '',
};

// http://facebook.github.io/react/docs/reusable-components.html
Photo.propTypes = {
  src: PropTypes.string,
};

Photo.displayName = 'Photo';
