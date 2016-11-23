/**
 * Album Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';

class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderControl(type, disabled) {
    return (
      <span
        className={classnames('album-control', 'album-icon', `album-${type}`, {
          disabled,
        })}
        onClick={this.props[type]}
      />
    );
  }

  render() {
    const { children, hasControl, prevDisabled, nextDisabled, carousel, onClose } = this.props;
    return (
      <div
        className={classnames('album-overlay', {
          'album-overlay-no-control': !hasControl,
        })}
        ref="overlay"
      >
        {
          hasControl ? this.renderControl('prev', prevDisabled) : null
        }
        {
          hasControl ? this.renderControl('next', nextDisabled) : null
        }
        <div className="album-stage">
          {
            React.cloneElement(children)
          }
        </div>
        {carousel}
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
};

Viewer.displayName = 'Viewer';

module.exports = Viewer;
