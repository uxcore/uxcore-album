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
    this.state = {};
  }

  handleMaskClick(e) {
    const { target } = e;
    if (target.className === 'album-item') {
      const { onMaskClick } = this.props;
      if (typeof onMaskClick === 'function') {
        onMaskClick(e);
      }
    }
  }

  render() {
    return (
      <div className="album-item" onClick={this.handleMaskClick.bind(this)}>
        <img src={this.props.src} alt="" ref={img => (this.img = img)} />
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
