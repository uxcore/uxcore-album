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

class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      left: 0,
      top: 0,
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidUpdate(props, state) {
    if (this.state.current !== state.current) {
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

  onKeyUp(e) {
    const { enableKeyBoardControl } = this.props;
    if (enableKeyBoardControl) {
      this.handleKeyboardEvent(e);
    }
  }

  setCurrent(i) {
    this.setState({
      current: i,
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
        this.props.onClose();
        break;
      default:
        break;
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

  renderControl(type, disabled) {
    return (
      <span
        className={classnames('album-control', 'album-icon', `album-${type}`, {
          disabled,
        })}
        onClick={this[type]}
      />
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
        <span
          className={classnames('album-carousel-control', 'album-icon', 'control-prev', {
            disabled: current === 0,
          })} onClick={this.prev}
        />
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
        <span
          className={classnames('album-carousel-control', 'album-icon', 'control-next', {
            disabled: current === children.length - 1,
          })} onClick={this.next}
        />
      </div>
    );
  }

  render() {
    const { current } = this.state;
    const { children, hasControl, prevDisabled, nextDisabled, onClose } = this.props;
    return (
      <div
        className={classnames('album-overlay', {
          'album-overlay-no-control': !hasControl,
        })}
        ref="overlay"
        onKeyUp={this.onKeyUp}
      >
        {
          hasControl ? this.renderControl('prev', prevDisabled) : null
        }
        {
          hasControl ? this.renderControl('next', nextDisabled) : null
        }
        <div className="album-stage">
          {
            React.cloneElement(children[current])
          }
        </div>
        {this.renderCarousel()}
        <span
          className="album-close album-icon"
          onClick={onClose}
        />
      </div>
    );
  }
}

Viewer.defaultProps = {
  hasControl: true,
  prevDisabled: false,
  prev() {},
  nextDisabled: false,
  next() {},
  carousel: null,
  onClose() {},
  enableKeyBoardControl: true,
};
Viewer.propTypes = {
  children: React.PropTypes.element,
  hasControl: React.PropTypes.bool,
  prevDisabled: React.PropTypes.bool,
  prev: React.PropTypes.func,
  nextDisabled: React.PropTypes.bool,
  next: React.PropTypes.func,
  carousel: React.PropTypes.any,
  onClose: React.PropTypes.func,
  enableKeyBoardControl: React.PropTypes.bool,
};

Viewer.displayName = 'Viewer';

module.exports = Viewer;
