/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'uxcore-icon';
import Carousel from './Carousel';
import { transformOriginProperty } from './transform-detect';

export default class Viewer extends React.Component {
  static stage = undefined;

  static getDerivedStateFromProps(props, state) {
    if (props.open && !state.lastOpenStatus) {
      const coordinate = props.coordinate || state.lastCoordinate;
      if (coordinate) {
        Viewer.stage.style[transformOriginProperty] = `${coordinate.left}px ${coordinate.top}px`;
      } else {
        Viewer.stage.style[transformOriginProperty] = '50% 50%';
      }

      return {
        ...state,
        current: props.current,
        lastOpenStatus: props.open,
        lastCoordinate: props.coordinate,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      current: props.current,
      lastOpenStatus: false,
      lastCoordinate: undefined,
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.minScale = 1;
    this.maxScale = 2;
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

  renderFuncButtons() {
    let { customButtons } = this.props;
    if (!Array.isArray(customButtons)) {
      customButtons = [customButtons];
    }
    return (
      <div className="album-func-button">
        <div
          className={classnames('album-func-button-item album-func-button-item__first', {
            disabled: this.state.scale >= this.maxScale,
          })}
        >
          <Icon name="fangda" onClick={() => { this.handleImageZoomIn(); }} />
        </div>
        {
          customButtons.map(({ icon, onClick }, i) => (
            <div
              key={i}
              className="album-func-button-item"
              onClick={onClick}
            >{icon}</div>
          ))
        }
        <div
          className={classnames('album-func-button-item', {
            disabled: this.state.scale <= this.minScale,
          })}
        >
          <Icon name="suoxiao" onClick={() => { this.handleImageZoomOut(); }} />
        </div>
      </div>
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
        ref={(node) => { this.overlay = node; }}
        onKeyUp={this.onKeyUp}
        tabIndex="1"
      >
        {
          hasControl ? this.renderControl('prev', prevDisabled) : null
        }
        {
          hasControl ? this.renderControl('next', nextDisabled) : null
        }
        <div className="album-stage" ref={(node) => { Viewer.stage = node; }}>
          {
            children[current] && React.cloneElement(children[current], {
              ref: (c) => { this.photo = c; },
            })
          }
          {showButton ? this.renderFuncButtons() : null}
        </div>
        {hasControl ? this.renderCarousel() : null}
        <span
          className="album-close album-icon"
          onClick={onClose}
        />
      </div>
    );
  }
}

const createCustomButtonsChecker = () => {
  const { oneOfType, arrayOf, shape, element, func } = PropTypes;
  const objectType = shape({
    icon: element.isRequired,
    onClick: func.isRequired,
  });
  const arrayType = arrayOf(objectType);
  return oneOfType([objectType, arrayType]);
};

Viewer.defaultProps = {
  hasControl: true,
  showButton: false,
  customButtons: [],
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
  children: PropTypes.array,
  hasControl: PropTypes.bool,
  showButton: PropTypes.bool,
  customButtons: createCustomButtonsChecker(),
  // prevDisabled: React.PropTypes.bool,
  prev: PropTypes.func,
  // nextDisabled: React.PropTypes.bool,
  next: PropTypes.func,
  onClose: PropTypes.func,
  onSetCurrent: PropTypes.func,
  enableKeyBoardControl: PropTypes.bool,
  coordinate: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  current: PropTypes.number,
  open: PropTypes.bool,
};

Viewer.displayName = 'Viewer';
