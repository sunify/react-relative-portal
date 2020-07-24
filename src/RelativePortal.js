import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { canUseDOM } from 'exenv';
import Portal from './Portal';

const listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(key => listeners[key]());
}

function getPageOffset() {
  return {
    x: (window.pageXOffset !== undefined)
      ? window.pageXOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: (window.pageYOffset !== undefined)
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop,
  }
}

function initDOMListener() {
  document.body.addEventListener('wheel', throttle(fireListeners, 100, {
    leading: true,
    trailing: true,
  }));
  window.addEventListener('resize', throttle(fireListeners, 50, {
    leading: true,
    trailing: true,
  }));
}

if (canUseDOM) {
  if (document.body) {
    initDOMListener();
  } else {
    document.addEventListener('DOMContentLoaded', initDOMListener);
  }
}

let listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  const id = listenerIdCounter;
  listeners[id] = fn;
  return () => delete listeners[id];
}

export default class RelativePortal extends React.Component {
  static propTypes = {
    right: PropTypes.number,
    left: PropTypes.number,
    fullWidth: PropTypes.bool,
    top: PropTypes.number,
    children: PropTypes.any,
    onOutClick: PropTypes.func,
    component: PropTypes.string.isRequired,
    componentClass: PropTypes.string,
  };

  static defaultProps = {
    left: 0,
    top: 0,
    component: 'span',
  };

  state = {
    right: 0,
    left: 0,
    top: 0,
  };

  componentDidMount() {
    this.handleScroll = () => {
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        const pageOffset = getPageOffset();
        const top = pageOffset.y + rect.top;
        const right = document.documentElement.clientWidth - rect.right - pageOffset.x;
        const left = pageOffset.x + rect.left;

        if (top !== this.state.top || left !== this.state.left || right !== this.state.right) {
          this.setState({ left, top, right });
        }
      }
    };
    this.unsubscribe = subscribe(this.handleScroll);
    this.handleScroll();
  }

  componentDidUpdate() {
    this.handleScroll();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { component: Comp, top, left, right, fullWidth, componentClass, ...props } = this.props;

    const fromLeftOrRight = right !== undefined ?
      { right: this.state.right + right } :
      { left: this.state.left + left };

    const horizontalPosition = fullWidth ?
      { right: this.state.right + right, left: this.state.left + left } : fromLeftOrRight;

    return (
      <Comp
        className={componentClass}
        ref={element => {
          this.element = element;
        }}
      >
        <Portal {...props}>
          <div
            style={{
              position: 'absolute',
              top: this.state.top + top,
              ...horizontalPosition,
            }}
          >
            {this.props.children}
          </div>
        </Portal>
      </Comp>
    );
  }
}
