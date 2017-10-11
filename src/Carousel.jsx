import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import assign from 'object-assign';
import { transformProperty, vendorSupport } from './transform-detect';

class Carousel extends React.Component {

  static defaultProps = {
    current: 0,
    onPrev() {},
    onNext() {},
    onSetCurrent() {},
    placement: 'bottom',
    itemSize: 132,
    className: '',
    carouselStyle: {},
    containerStyle: {},
    inView: false,
  }
  static propTypes = {
    children: PropTypes.any,
    current: PropTypes.number,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onSetCurrent: PropTypes.func,
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    itemSize: PropTypes.number,
    className: PropTypes.string,
    carouselStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    inView: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      const { itemSize } = nextProps;
      const activeOffset = nextProps.current * itemSize;
      switch (nextProps.placement) {
        case 'top':
        case 'bottom':
          const viewWidth = this.container.clientWidth;
          let { left } = this.state;
          if (activeOffset < left) {
            left -= itemSize;
          } else if (activeOffset - left > viewWidth - itemSize) {
            left += itemSize;
          }
          this.setState({
            left,
          });
          break;
        case 'left':
        case 'right':
          const viewHeight = this.container.clientHeight;
          let { top } = this.state;
          if (activeOffset < top) {
            top -= itemSize;
          } else if (activeOffset - top > viewHeight - itemSize) {
            top += itemSize;
          }
          this.setState({
            top,
          });
          break;
        default:
          break;
      }
    }
  }

  componentDidUpdate() {
    // this.adjustControlPosition();
  }

  // adjustControlPosition() {
  // }

  render() {
    const {
      children,
      current,
      onPrev,
      onNext,
      placement,
      onSetCurrent,
      className,
      carouselStyle,
      containerStyle,
      inView,
      itemSize,
    } = this.props;
    const listStyle = {};
    const isHorizontal = placement === 'right' || placement === 'left';
    const activeOffset = {};
    if (isHorizontal) {
      if (vendorSupport) {
        listStyle[transformProperty] = `translateY(-${this.state.top}px)`;
      } else {
        listStyle.top = `-${this.state.top}px`;
      }
    } else if (vendorSupport) {
      listStyle[transformProperty] = `translateX(-${this.state.left}px)`;
      assign(activeOffset, {
        transform: `translateX(${(current * itemSize) + 6}px)`,
      });
    } else {
      listStyle.left = `-${this.state.left}px`;
      assign(activeOffset, {
        left: `${(current * itemSize) + 6}px`,
      });
    }
    return (
      <div className={classnames('album-carousel', className)} style={carouselStyle}>
        <span
          className={
            classnames(
              'album-carousel-control',
              'album-icon',
              {
                'control-prev': inView,
                'control-up': !inView,
                disabled: current === 0,
              },
            )
          }
          onClick={onPrev}
          ref={(c) => { this.prevControl = c; }}
        />
        <div className="album-carousel-container" ref={node => (this.container = node)} style={containerStyle}>
          <ul
            className="album-carousel-list"
            style={listStyle}
            ref={(c) => {
              this.list = c;
            }}
          >
            {
              React.Children.map(children, (el, i) =>
                el && <li
                  className={classnames('item', current === i ? 'active' : '')}
                  key={`c-${i}`}
                  onClick={() => {
                    onSetCurrent(i);
                  }}
                >{React.cloneElement(el)}</li>,
              )
            }
            <li
              className="item-active"
              key={'active'}
              style={activeOffset}
            />
          </ul>
        </div>
        <span
          className={
            classnames(
              'album-carousel-control',
              'album-icon',
              {
                'control-next': inView,
                'control-down': !inView,
                disabled: current === children.length - 1,
              },
            )
          }
          onClick={onNext}
          ref={(c) => { this.nextControl = c; }}
        />
      </div>
    );
  }
}

module.exports = Carousel;
