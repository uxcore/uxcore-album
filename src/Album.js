/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';

let _currentResizeHandler;

class Album extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      current: 0
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate', nextState)
    if (nextState.open) {
      _currentResizeHandler = this.resizeHandler.bind(this);
      window.addEventListener('resize', _currentResizeHandler, false);
    } else {
      if (_currentResizeHandler) {
        window.removeEventListener('resize', _currentResizeHandler, false);
        _currentResizeHandler = null;
      }
    }
  }

  componentWillUnmount() {
    if (_currentResizeHandler) {
      window.removeEventListener('resize', _currentResizeHandler, false);
      _currentResizeHandler = null;
    }
  }

  resizeHandler() {
    console.log('resizeHandler', this);
  }

  openAlbum() {
    this.setState({
      open: true
    });
  }

  setCurrent(i) {
    this.setState({
      current: i 
    });
  }

  renderCover() {
    return (
      <div className="album-cover" onClick={this.openAlbum.bind(this)}>
        {React.cloneElement(this.props.children[0])}
      </div>
    );
  }

  renderAlbum() {
    return (
      <div className="album-overlay">
        {
          React.cloneElement(this.props.children[this.state.current])
        }
        {
          this.renderCarousel()
        }
        <a href="javascript:;" className="album-close" onClick={() => {
          this.setState({
            open: false
          });
        }}>X</a>
      </div>
    ); 
  }

  renderCarousel() {
    return (
      <div className="album-carousel">
        <a href="#" className="album-carousel-control control-prev"></a>
        <ul className="album-carousel-list">
        {
          this.props.children.map((el, i) => {
            return <li key={`c-${i}`} onClick={this.setCurrent.bind(this, i)}>{React.cloneElement(el)}</li>;  
          })
        }
        </ul>
        <a href="#" className="album-carousel-control control-next"></a>
      </div>
    );
  }

  render() {
    let { open } = this.state;
    let content;
    if (open) {
      content = this.renderAlbum();
    } else {
      content = this.renderCover();
    }
    return (
      <div className="kuma-uxcore-album">
        {content}
      </div>
    );
  }
}

Album.defaultProps = {
};


// http://facebook.github.io/react/docs/reusable-components.html
Album.propTypes = {
};

Album.displayName = 'Album';

module.exports = Album;
