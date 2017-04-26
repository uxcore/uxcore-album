/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import Icon from 'uxcore-icon';
import Carousel from './Carousel';
import { transformOriginProperty } from './transform-detect';

class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
      scale: 1,
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.minScale = 1;
    this.maxScale = 2;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      const coordinate = nextProps.coordinate || this.props.coordinate;
      if (coordinate) {
        this.stage.style[transformOriginProperty] = `${coordinate.left}px ${coordinate.top}px`;
      } else {
        this.stage.style[transformOriginProperty] = '50% 50%';
      }
    }
    this.setState({
      current: nextProps.current,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.overlay.focus();
    if (prevState.current !== this.state.current) {
      this.props.onSetCurrent(this.state.current);
    }
    if (prevState.scale !== this.state.scale) {
      ['webkit', 'moz', 'ms', ''].forEach((prefix) => {
        this.photo.img.style[`${prefix}Transform`] = `scale(${this.state.scale})`;
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
        this.props.onClose(e);
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

  handleImageZoomIn() {
    if (this.state.scale < this.maxScale) {
      this.setState({
        scale: this.state.scale + 0.2,
      });
    }
  }

  handleImageZoomOut() {
    if (this.state.scale >= this.minScale) {
      this.setState({
        scale: this.state.scale - 0.2,
      });
    }
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
    return (
      <Carousel
        current={this.state.current}
        onPrev={this.prev}
        onNext={this.next}
        onSetCurrent={this.setCurrent}
        inView
      >
        {this.props.children}
      </Carousel>
    );
  }

  render() {
    const { current } = this.state;
    const { children, hasControl, onClose, open, showButton } = this.props;
    const prevDisabled = current === 0;
    const nextDisabled = current === children.length - 1;
    return (
      <div
        className={classnames('album-overlay', {
          'album-overlay-no-control': !hasControl,
          'album-overlay-hide': !open,
        })}
        ref={node => (this.overlay = node)}
        onKeyUp={this.onKeyUp}
        tabIndex="1"
      >
        {
          hasControl ? this.renderControl('prev', prevDisabled) : null
        }
        {
          hasControl ? this.renderControl('next', nextDisabled) : null
        }
        <div className="album-stage" ref={node => (this.stage = node)}>
          {
            children[current] && React.cloneElement(children[current], {
              ref: (c) => { this.photo = c; },
            })
          }
          {showButton ? (<div className="album-func-button">
            <div
              className={classnames('album-func-button-item album-func-button-item__first', {
                disabled: this.state.scale >= this.maxScale,
              })}
            >
              <Icon name="fangda" onClick={() => { this.handleImageZoomIn(); }} />
            </div>
            <div
              className={classnames('album-func-button-item', {
                disabled: this.state.scale <= this.minScale,
              })}
            >
              <Icon name="suoxiao" onClick={() => { this.handleImageZoomOut(); }} />
            </div>
          </div>
        ) : null}
        </div>
        { hasControl ? this.renderCarousel() : null}
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
  prev() {},
  next() {},
  onClose() {},
  onSetCurrent() {},
  enableKeyBoardControl: true,
  coordinate: null,
  current: 0,
  open: true,
};
Viewer.propTypes = {
  children: React.PropTypes.array,
  hasControl: React.PropTypes.bool,
  showButton: React.PropTypes.bool,
  // prevDisabled: React.PropTypes.bool,
  prev: React.PropTypes.func,
  // nextDisabled: React.PropTypes.bool,
  next: React.PropTypes.func,
  onClose: React.PropTypes.func,
  onSetCurrent: React.PropTypes.func,
  enableKeyBoardControl: React.PropTypes.bool,
  coordinate: React.PropTypes.shape({
    left: React.PropTypes.number,
    top: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }),
  current: React.PropTypes.number,
  open: React.PropTypes.bool,
};

Viewer.displayName = 'Viewer';

module.exports = Viewer;
