/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import Carousel from './Carousel';

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
    this.setCurrent = this.setCurrent.bind(this);
  }

  componentDidMount() {
    this.overlay.focus();
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
    return (
      <Carousel
        current={this.state.current}
        onPrev={this.prev}
        onNext={this.next}
        onSetCurrent={this.setCurrent}
        inView={true}
      >
        {this.props.children}
      </Carousel>
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
        ref={(node) => this.overlay = node}
        onKeyUp={this.onKeyUp}
        tabIndex="1"
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
