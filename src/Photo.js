/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';

class Photo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="album-item"><img src={this.props.src} no-referer="true" /></div>
    );
  }
}

Photo.defaultProps = {
  src: ''
};


// http://facebook.github.io/react/docs/reusable-components.html
Photo.propTypes = {
  src: React.PropTypes.string
};

Photo.displayName = 'Photo';

module.exports = Photo;
