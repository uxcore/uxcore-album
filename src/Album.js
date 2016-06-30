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
    };
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
    }
  }

  componentWillUnmount() {
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
    console.log(e.keyCode)
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

  onKeyUp(e) {
    const { enableKeyBoardControl } = this.props;
    const { open } = this.state;
    if (enableKeyBoardControl && open) {
      this.handleKeyboardEvent(e);
    }
  }

  openAlbum() {
    this.setState({
      open: true,
    });
  }

  renderCover() {
    const { width, height, children } = this.props;
    let coverStyle = {};
    if (width) {
      coverStyle.width = width;
    }
    if (height) {
      coverStyle.height = height;
    }
    return (
      <div className="album-cover album-icon" onClick={this.openAlbum.bind(this)} style={coverStyle} ref="cover">
        {React.cloneElement(Array.isArray(children) ? children[0]: children)}
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
        <a href="#" className={classnames('album-control', 'album-icon', 'album-prev', {
          disabled: current === 0,
        })} onClick={this.prev.bind(this)}></a>
        <a href="#" className={classnames('album-control', 'album-icon', 'album-next', {
          disabled: current === children.length - 1,
        })} onClick={this.next.bind(this)}></a>
        <div className="album-stage">
          {
            React.cloneElement(children[this.state.current])
          }
        </div>
        {
          this.renderCarousel()
        }
        <a href="javascript:;" className="album-close album-icon" onClick={() => {
          this.setState({
            open: false,
          });
        }}></a>
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
        <a href="#" className={classnames('album-carousel-control', 'album-icon', 'control-prev', {
          disabled: current === 0,
        })} onClick={this.prev.bind(this)}></a>
        <div className="album-carousel-container" ref="container">
          <ul className="album-carousel-list" style={listStyle}>
          {
            children.map((el, i) => {
              return <li className={current === i ? 'active' : ''} key={`c-${i}`} onClick={this.setCurrent.bind(this, i)}>{React.cloneElement(el)}</li>;
            })
          }
          </ul>
        </div>
        <a href="#" className={classnames('album-carousel-control', 'album-icon', 'control-next', {
          disabled: current === children.length - 1,
        })} onClick={this.next.bind(this)}></a>
      </div>
    );
  }

  render() {
    const { open } = this.state;
    let content;
    if (open) {
      content = this.renderAlbum();
    } else {
      content = this.renderCover();
    }
    return (
      <div className={classnames('kuma-uxcore-album', {
        'no-rgba': !supportRGBA,
      })} onKeyUp={this.onKeyUp.bind(this)} tabIndex="-1">
        {content}
      </div>
    );
  }
}

Album.defaultProps = {
  width: '',
  height: '',
  enableKeyBoardControl: true,
};


// http://facebook.github.io/react/docs/reusable-components.html
Album.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  enableKeyBoardControl: React.PropTypes.bool,
};

Album.displayName = 'Album';

module.exports = Album;
