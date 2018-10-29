import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import assign from 'object-assign';
import { polyfill } from 'react-lifecycles-compat';
import { transformProperty, vendorSupport } from './transform-detect';

class Carousel extends React.Component {
  static defaultProps = {
    current: 0,
    onPrev() { },
    onNext() { },
    onSetCurrent() { },
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

  static container = undefined;

  static getDerivedStateFromProps(props, state) {
    let stateFromProps = null;
    if (props.current !== state.lastIndex) {
      const { itemSize } = props;
      const activeOffset = props.current * itemSize;
      const viewWidth = Carousel.container.clientWidth;
      const viewHeight = Carousel.container.clientHeight;
      let { left, top } = state;

      switch (props.placement) {
        case 'top':
        case 'bottom':
          if (activeOffset < left) {
            left -= itemSize;
          } else if (activeOffset - left > viewWidth - itemSize) {
            left += itemSize;
          }

          stateFromProps = {
            ...state,
            left,
            lastIndex: props.current,
          };
          break;

        case 'left':
        case 'right':
          if (activeOffset < top) {
            top -= itemSize;
          } else if (activeOffset - top > viewHeight - itemSize) {
            top += itemSize;
          }

          stateFromProps = {
            ...state,
            top,
            lastIndex: props.current,
          };
          break;
        default:
          break;
      }
    }
    return stateFromProps;
  }

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      lastIndex: props.current,
    };
  }

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
      onChange,
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
        <div
          className="album-carousel-container"
          ref={node => (Carousel.container = node)}
          style={containerStyle}
        >
          <ul
            className="album-carousel-list"
            style={listStyle}
            ref={(c) => {
              this.list = c;
            }}
          >
            {
              React.Children.map(children, (el, i) => el && (
                <li
                  className={classnames('item', current === i ? 'active' : '')}
                  key={`c-${i}`}
                  onClick={() => {
                    onChange(i);
                    onSetCurrent(i);
                  }}
                >
                  {React.cloneElement(el)}

                </li>
              ))
            }
            <li
              className="item-active"
              key="active"
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

polyfill(Carousel);

export default Carousel;
