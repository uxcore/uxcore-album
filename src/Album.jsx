/* eslint-disable react/no-did-update-set-state  */
/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import Animate from 'uxcore-animate';
import supportRGBA from './rgba-detect';
import Viewer from './Viewer';
import Photo from './Photo';
import Carousel from './Carousel';

class Album extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      current: 0,
      left: 0,
      top: 0,
    };
    
    this.openAlbum = this.openAlbum.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
  }

  setCurrent(i) {
    this.setState({
      current: i,
    });
  }

  prev() {
    const current = this.state.current;
    if (current === 0) return;
    this.setState({
      current: current - 1,
    });
  }

  next() {
    const current = this.state.current;
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    if (current === children.length - 1) return;
    this.setState({
      current: current + 1,
    });
  }

  openAlbum() {
    this.setState({
      open: true,
    });
  }

  renderAlbum() {
    const { current, open } = this.state;
    const { enableKeyBoardControl } = this.props;
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    let rect;
    let coordinate;
    if (this.cover && this.cover.img && this.cover.img.getBoundingClientRect) {
      rect = this.cover.img.getBoundingClientRect();
    }
    if (rect) {
      coordinate = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
    return (
      <Animate
        component={''}
        transitionName={'album-overlay'}
        transitionAppear
        transitionEnter
        transitionLeave
        showProp={'open'}
      >
        <Viewer
          key="viewer"
          prev={this.prev}
          next={this.next}
          onClose={(e) => {
            e && e.preventDefault();
            this.setState({
              open: false,
            });
          }}
          enableKeyBoardControl={enableKeyBoardControl}
          ref={node => (this.viewer = node)}
          coordinate={coordinate}
          current={current}
          open={open}
          onSetCurrent={(c) => {
            this.setState({ current: c });
          }}
        >
          {children}
        </Viewer>
      </Animate>
    );
  }

  renderCover() {
    const { width, height, children, enableThumbs, thumbBackground } = this.props;
    const { current } = this.state;
    const coverStyle = {};
    if (width) {
      coverStyle.width = width;
    }
    if (height) {
      coverStyle.height = height;
    }
    if (enableThumbs) {
      coverStyle.background = thumbBackground;
    }

    return (
      <div>
        <div
          className="album-cover album-icon"
          onClick={this.openAlbum}
          style={coverStyle}
        >
          {React.cloneElement(Array.isArray(children) ? children[current] : children, {
            ref: cover => (this.cover = cover),
          })}
        </div>
        {enableThumbs ? this.renderThumbs() : ''}
      </div>
    );
  }

  renderThumbs() {
    const { thumbPlacement, width, height } = this.props;
    const { current } = this.state;
    const isHorizontal = thumbPlacement === 'right' || thumbPlacement === 'left';
    const thumbs = this.props.children.map((o) => {
      const src = o.props['thumb-src'] || o.props.src;
      return (
        <div key={src} className="album-item">
          <img src={src} alt="" />
        </div>
      );
    });
    const carouselStyle = isHorizontal ? {
      height,
      width: 122,
    } : {
      height: 72,
      width,
    };
    const containerStyle = isHorizontal ? {
      height: height - 50,
      width: 122,
    } : {
      height: 72,
      width: width - 50,
    };
    return (
      <Carousel
        current={current}
        placement={thumbPlacement}
        onPrev={this.prev}
        onNext={this.next}
        onSetCurrent={this.setCurrent}
        itemSize={isHorizontal ? 78 : 126}
        className="thumbs-preview"
        carouselStyle={carouselStyle}
        containerStyle={containerStyle}
      >
        {thumbs}
      </Carousel>
    );
  }

  render() {
    const { enableThumbs, thumbPlacement, width, height } = this.props;
    const isHorizontal = thumbPlacement === 'right' || thumbPlacement === 'left';
    const style = isHorizontal ? {
      width: width + (enableThumbs ? 140 : 10),
    } : {
      height: height + (enableThumbs ? 90 : 10),
    };

    return (
      <div
        className={classnames('kuma-uxcore-album', {
          'no-rgba': !supportRGBA,
          'has-thumb': enableThumbs,
          [`thumb-placement-${thumbPlacement}`]: enableThumbs,
        })} style={style}
        ref={node => (this.wrap = node)}
      >
        {
          this.renderCover()
        }
        {
          this.renderAlbum()
        }
      </div>
    );
  }
}

Album.defaultProps = {
  width: '',
  height: '',
  thumbPlacement: 'right',
  thumbBackground: '#000',
  enableThumbs: false,
  enableKeyBoardControl: true,
};


// http://facebook.github.io/react/docs/reusable-components.html
Album.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  thumbPlacement: React.PropTypes.string,
  thumbBackground: React.PropTypes.string,
  enableThumbs: React.PropTypes.bool,
  enableKeyBoardControl: React.PropTypes.bool,
  children: React.PropTypes.node,
};

Album.displayName = 'Album';

Album.show = (option = {}) => {
  const config = {
    src: null,
    photos: [],
    getContainer() {
      const container = document.createElement('div');
      document.body.appendChild(container);
      return container;
    },
  };
  assign(config, option);
  if (!config.src && config.photos.length === 0) {
    console.warn('You must provide valid parameters: "src" or "photos"!');
  }
  const container = config.getContainer();

  let photos; 
  if (config.src) {
    photos = [<Photo src={config.src} />];
  } else {
    photos = config.photos;
  }

  let hasControl = false;
  if (photos.length > 1) {
    hasControl = true;
  }

  ReactDOM.render(
    <div
      className={classnames('kuma-uxcore-album', {
        'no-rgba': !supportRGBA,
      })}
      tabIndex="-1"
    >
      <Animate
        component={''}
        transitionName={'album-overlay'}
        transitionAppear
        transitionEnter
        transitionLeave
      >
        <Viewer
          onClose={() => {
            document.body.removeChild(container);
          }}
          hasControl={hasControl}
        >
          {photos}
        </Viewer>
      </Animate>
    </div>,
    container,
  );
};

module.exports = Album;
