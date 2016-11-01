/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import { transformProperty, vendorSupport } from './transform-detect';
import supportRGBA from './rgba-detect';

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
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidUpdate(props, state) {
    if (this.state.open && this.state.current !== state.current) {
      const itemWidth = 132;
      const viewWidth = this.refs.container.clientWidth;
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
    } else if (!this.state.open && props.enableThumbs && this.state.current !== state.current) {
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
    }
  }

  componentWillUnmount() {
  }

  onKeyUp(e) {
    const { enableKeyBoardControl } = this.props;
    const { open } = this.state;
    if (enableKeyBoardControl && open) {
      this.handleKeyboardEvent(e);
    }
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

  handleKeyboardEvent(e) {
    switch (e.keyCode) {
      case 37:
        // left
        this.prev();
        break;
      case 39:
        // right
        this.next();
        break;
      case 27:
        // esc
        this.setState({
          open: false,
        });
        break;
      default:
        break;
    }
  }

  openAlbum() {
    this.setState({
      open: true,
    });
  }

  renderCover() {
    const { width, height, children, enableThumbs, thumbBackground } = this.props;
    const { current } = this.state;
    let coverStyle = {};
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
    const { height, children, thumbBackground } = this.props;
    const { current } = this.state;
    const listStyle = {};
    if (vendorSupport) {
      listStyle[transformProperty] = `translateY(-${this.state.top}px)`;
    } else {
      listStyle.top = `-${this.state.top}px`;
    }
    let thumbs = children.map((o, i) => {
      let thumb = o.props['thumb-src'] || o.props.src;
      let thumbStyle = {};

      return (
        <li
          className={classnames({
            active: i === current,
          })} key={i} style={thumbStyle} onClick={() => {
            this.setCurrent(i);
          }}
        >
          <div className="album-item" style={{ background: thumbBackground }}>
            <img src={thumb} alt="" />
          </div>
        </li>
      );
    });

    return (
      <div className="thumbs-preview album-carousel" style={{ height }}>
        <a
          href="#"
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
          ref="thumb-container" style={{ height: height - 50 }}
        >
          <ul className="album-carousel-list" style={listStyle}>{thumbs}</ul>
        </div>
        <a
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
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    return (
      <div className="album-overlay" ref="overlay">
        <a
          href="#" className={classnames('album-control', 'album-icon', 'album-prev', {
            disabled: current === 0,
          })} onClick={this.prev}
        ></a>
        <a
          href="#"
          className={classnames('album-control', 'album-icon', 'album-next', {
            disabled: current === children.length - 1,
          })} onClick={this.next}
        ></a>
        <div className="album-stage">
          {
            React.cloneElement(children[this.state.current])
          }
        </div>
        {
          this.renderCarousel()
        }
        <a
          href="#" className="album-close album-icon" onClick={(e) => {
            e.preventDefault();
            this.setState({
              open: false,
            });
          }}
        ></a>
      </div>
    );
  }

  renderCarousel() {
    const { current } = this.state;
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    const listStyle = {};
    if (vendorSupport) {
      listStyle[transformProperty] = `translateX(-${this.state.left}px)`;
    } else {
      listStyle.left = `-${this.state.left}px`;
    }
    return (
      <div className="album-carousel">
        <a
          href="#" className={classnames('album-carousel-control', 'album-icon', 'control-prev', {
            disabled: current === 0,
          })} onClick={this.prev}
        ></a>
        <div className="album-carousel-container" ref="container">
          <ul className="album-carousel-list" style={listStyle}>
          {
            children.map((el, i) =>
              <li
                className={current === i ? 'active' : ''}
                key={`c-${i}`}
                onClick={() => {
                  this.setCurrent(i);
                }}
              >{React.cloneElement(el)}</li>
            )
          }
          </ul>
        </div>
        <a
          href="#" className={classnames('album-carousel-control', 'album-icon', 'control-next', {
            disabled: current === children.length - 1,
          })} onClick={this.next}
        ></a>
      </div>
    );
  }

  render() {
    const { enableThumbs, thumbPlacement, width } = this.props;
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
        })}
        onKeyUp={this.onKeyUp} tabIndex="-1" style={{ width: width + (enableThumbs ? 140 : 10) }}
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

module.exports = Album;
