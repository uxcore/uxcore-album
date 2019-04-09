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
import { polyfill } from 'react-lifecycles-compat';
import Carousel from './Carousel';
import { transformOriginProperty } from './transform-detect';

class Viewer extends React.Component {
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
      lastOpenStatus: props.open,
      lastCoordinate: props.coordinate,
      imageScaleMap: {},
      imageRotateMap: {},
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.minScale = 0.6;
    this.maxScale = 2;
  }

  componentDidUpdate(prevProps, prevState) {
    this.overlay.focus();
    if (prevState.current !== this.state.current) {
      this.props.onSetCurrent(this.state.current);
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
    const { current } = this.state;
    if (current === 0) return;
    this.setState({
      current: current - 1,
    }, this.handleChange.bind(this));
  }

  next() {
    const { current } = this.state;
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    if (current === children.length - 1) return;
    this.setState({
      current: current + 1,
    }, this.handleChange.bind(this));
  }

  /**
   * 变化时
   * @param {Number} index
   */
  handleChange(index) {
    const { onChange } = this.props;
    let { current } = this.state;
    if (index !== undefined) {
      current = index;
    }
    if (typeof onChange === 'function') {
      onChange(current);
    }
  }

  /**
   * 放大缩小
   * @param {Number} value
   */
  handleImageZoom(value) {
    const { current, imageScaleMap, imageRotateMap } = this.state;
    if (imageScaleMap[current] === undefined) {
      imageScaleMap[current] = 1;
    }
    const v = parseInt((imageScaleMap[current] + value) * 100, 10) / 100;
    if (v <= this.maxScale && v >= this.minScale) {
      imageScaleMap[current] = v;
      this.setState({ imageScaleMap }, () => {
        this.photo.setStyle(imageRotateMap[current], v);
      });
    }
  }


  /**
   * 旋转
   * @param {Number} value
   */
  handleImageRotate(value) {
    const { current, imageRotateMap, imageScaleMap } = this.state;
    if (imageRotateMap[current] === undefined) {
      imageRotateMap[current] = 0;
    }
    imageRotateMap[current] += value;
    this.setState({ imageRotateMap }, () => {
      this.photo.setStyle(imageRotateMap[current], imageScaleMap[current]);
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
    const { children } = this.props;
    return (
      <Carousel
        current={current}
        onPrev={this.prev}
        onNext={this.next}
        onSetCurrent={this.setCurrent}
        onChange={this.handleChange.bind(this)}
        inView
      >
        {children}
      </Carousel>
    );
  }

  renderFuncButtons() {
    let { customButtons } = this.props;
    if (!Array.isArray(customButtons)) {
      customButtons = [customButtons];
    }
    const { current, imageScaleMap } = this.state;
    return (
      <div className="album-func-button">
        <div
          className={classnames('album-func-button-item album-func-button-item__first', {
            disabled: imageScaleMap[current] >= this.maxScale,
          })}
        >
          <Icon usei name="fangda" onClick={() => { this.handleImageZoom(0.2); }} />
        </div>
        <div
          className={classnames('album-func-button-item', {
            disabled: imageScaleMap[current] <= this.minScale,
          })}
        >
          <Icon usei name="suoxiao" onClick={() => { this.handleImageZoom(-0.2); }} />
        </div>
        <div className="album-func-button-item">
          <Icon usei name="zuoxuanzhuan" onClick={() => { this.handleImageRotate(-90); }} />
        </div>
        <div className="album-func-button-item">
          <Icon usei name="youxuanzhuan" onClick={() => { this.handleImageRotate(90); }} />
        </div>
        {
          customButtons.map(({ icon, onClick }, i) => (
            <div
              key={i}
              className="album-func-button-item"
              onClick={onClick}
            >
              {icon}

            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const { current, imageRotateMap, imageScaleMap } = this.state;
    const {
      children, hasControl, onClose, open, showButton,
      maskClosable,
    } = this.props;
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
              rotate: imageRotateMap[current] || 0,
              scale: imageScaleMap[current] || 1,
              onMaskClick: onClose,
              maskClosable,
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
  const {
    oneOfType, arrayOf, shape, element, func,
  } = PropTypes;
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
  prev() { },
  next() { },
  onClose() { },
  onSetCurrent() { },
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

polyfill(Viewer);

export default Viewer;
