import React, { PropTypes } from 'react';
import uuid from 'uuid';
import debounce from 'debounce';
import { canUseDOM } from 'exenv';
import Portal from './Portal';

const listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(key => listeners[key]());
}

if (canUseDOM) {
  document.body.addEventListener('mousewheel', debounce(fireListeners, 100, true));
}

function subscribe(fn) {
  const id = uuid.v1();
  listeners[id] = fn;
  return () => delete listeners[id];
}

export default class RelativePortal extends React.Component {
  static propTypes = {
    right: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number,
    children: PropTypes.any,
    onOutClick: PropTypes.func,
    component: PropTypes.string.isRequired,
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
        const top = window.scrollY + rect.top;
        const right = window.innerWidth - rect.right + window.scrollX;
        const left = window.scrollX + rect.left;

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
    const { component: Comp, top, left, right, ...props } = this.props;
    const verticalPosition = right !== undefined ? { right: this.state.right + right }
                                                 : { left: this.state.left + left };

    return (
      <Comp
        ref={element => {
          this.element = element;
        }}
      >
        <Portal {...props}>
          <div
            style={{
              position: 'absolute',
              top: this.state.top + top,
              ...verticalPosition,
            }}
          >
            {this.props.children}
          </div>
        </Portal>
      </Comp>
    );
  }
}
