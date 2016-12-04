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
import { transformProperty, vendorSupport } from './transform-detect';
import supportRGBA from './rgba-detect';
import Viewer from './Viewer';
import Photo from './Photo';
import assign from 'object-assign';

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
  }

  componentDidUpdate(props, state) {
    if (!this.state.open && props.enableThumbs && this.state.current !== state.current) {
      if (props.thumbPlacement === 'right' || props.thumbPlacement === 'left') {
        const itemHeight = 78;
        const viewHeight = this.refs['thumb-container'].clientHeight;
        const activeOffset = this.state.current * itemHeight;
        let { top } = this.state;
        if (activeOffset < top) {
          top -= itemHeight;
        } else if (activeOffset - top > viewHeight - itemHeight) {
          top += itemHeight;
        }
        this.setState({
          top,
        });
      } else {
        const itemWidth = 126;
        const viewWidth = this.refs['thumb-container'].clientWidth;
        const activeOffset = this.state.current * itemWidth;
        let { left } = this.state;
        if (activeOffset < left) {
          left -= itemWidth;
        } else if (activeOffset - left > viewWidth - itemWidth) {
          left += itemWidth;
        }
        this.setState({
          left,
        });
      }
    }
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

  setCurrent(i) {
    this.setState({
      current: i,
    });
  }

  openAlbum() {
    this.setState({
      open: true,
    });
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
          onClick={this.openAlbum} style={coverStyle} ref="cover"
        >
          {React.cloneElement(Array.isArray(children) ? children[current] : children)}
        </div>
        {enableThumbs ? this.renderThumbs() : ''}
      </div>
    );
  }

  renderThumbs() {
    const { width, height, children, thumbPlacement } = this.props;
    const { current } = this.state;
    const listStyle = {};
    const isHorizontal = thumbPlacement === 'right' || thumbPlacement === 'left';
    if (isHorizontal) {
      if (vendorSupport) {
        listStyle[transformProperty] = `translateY(-${this.state.top}px)`;
      } else {
        listStyle.top = `-${this.state.top}px`;
      }
    } else if (vendorSupport) {
      listStyle[transformProperty] = `translateX(-${this.state.left}px)`;
    } else {
      listStyle.left = `-${this.state.left}px`;
    }
    const thumbs = children.map((o, i) => {
      const thumb = o.props['thumb-src'] || o.props.src;
      const thumbStyle = {};

      return (
        <li
          className={classnames({
            active: i === current,
          })} key={i} style={thumbStyle} onClick={() => {
            this.setCurrent(i);
          }}
        >
          <div className="album-item">
            <img src={thumb} alt="" />
          </div>
        </li>
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
      <div className="thumbs-preview album-carousel" style={carouselStyle}>
        <span
          href="javscript:;"
          className={classnames(
            'album-carousel-control',
            'album-icon',
            'control-up',
            { disabled: current === 0 }
          )}
          onClick={this.prev}
        />
        <div
          className="album-carousel-container"
          ref="thumb-container" style={containerStyle}
        >
          <ul className="album-carousel-list" style={listStyle}>{thumbs}</ul>
        </div>
        <span
          href="#"
          className={classnames(
            'album-carousel-control',
            'album-icon',
            'control-down',
            { disabled: current === children.length - 1 })}
          onClick={this.next}
        />
      </div>
    );
  }

  renderAlbum() {
    const { current } = this.state;
    let { children, enableKeyBoardControl } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    return (
      <Viewer
        prevDisabled={current === 0}
        prev={this.prev}
        nextDisabled={current === children.length - 1}
        next={this.next}
        onClose={(e) => {
          e.preventDefault();
          this.setState({
            open: false,
          });
        }}
        enableKeyBoardControl={enableKeyBoardControl}
      >
        {children}
      </Viewer>
    );
  }

  // renderCarousel() {
  //   const { current } = this.state;
  //   let { children } = this.props;
  //   if (!Array.isArray(children)) {
  //     children = [children];
  //   }
  //   const listStyle = {};
  //   if (vendorSupport) {
  //     listStyle[transformProperty] = `translateX(-${this.state.left}px)`;
  //   } else {
  //     listStyle.left = `-${this.state.left}px`;
  //   }
  //   return (
  //     <div className="album-carousel">
  //       <span
  //         className={classnames('album-carousel-control', 'album-icon', 'control-prev', {
  //           disabled: current === 0,
  //         })} onClick={this.prev}
  //       />
  //       <div className="album-carousel-container" ref="container">
  //         <ul className="album-carousel-list" style={listStyle}>
  //           {
  //             children.map((el, i) =>
  //               <li
  //                 className={current === i ? 'active' : ''}
  //                 key={`c-${i}`}
  //                 onClick={() => {
  //                   this.setCurrent(i);
  //                 }}
  //               >{React.cloneElement(el)}</li>
  //             )
  //           }
  //         </ul>
  //       </div>
  //       <span
  //         className={classnames('album-carousel-control', 'album-icon', 'control-next', {
  //           disabled: current === children.length - 1,
  //         })} onClick={this.next}
  //       />
  //     </div>
  //   );
  // }

  render() {
    const { enableThumbs, thumbPlacement, width, height } = this.props;
    const isHorizontal = thumbPlacement === 'right' || thumbPlacement === 'left';
    const style = isHorizontal ? {
      width: width + (enableThumbs ? 140 : 10),
    } : {
      height: height + (enableThumbs ? 90 : 10),
    };
    const { open } = this.state;
    let content;
    if (open) {
      content = this.renderAlbum();
    } else {
      content = this.renderCover();
    }

    return (
      <div
        className={classnames('kuma-uxcore-album', {
          'no-rgba': !supportRGBA,
          'has-thumb': enableThumbs,
          [`thumb-placement-${thumbPlacement}`]: enableThumbs,
        })} tabIndex="-1" style={style}
      >
        {content}
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

  let hasControl = false;
  if (config.photos.length > 0) {
    hasControl = true;
  }

  ReactDOM.render(
    <div
      className={classnames('kuma-uxcore-album', {
        'no-rgba': !supportRGBA,
      })}
      tabIndex="-1"
    >
      <Viewer
        hasControl={false}
        onClose={() => {
          document.body.removeChild(container);
        }}
        hasControl={hasControl}
      >
        <Photo src={config.src} />
      </Viewer>
    </div>,
    container
  );
};

module.exports = Album;
