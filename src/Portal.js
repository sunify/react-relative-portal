import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'exenv';

export default class Portal extends React.Component {

  static propTypes = {
    onOutClick: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    if (canUseDOM) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);

      this.root = null;
      this.handleRootRef = (root) => {
        if (root !== this.root) {
          if (this.root) {
            this.root.removeEventListener('click', this.handleInClick);
          }
          if (root) {
            root.addEventListener('click', this.handleInClick);
          }
        }
        this.root = root;
      };

      // The previous implementation triggered `onOutClick` after a click in the `Portal` content
      // if it gets re-rendered during that click. It assumed that if the clicked element
      // is not found in the root element via `root.contains(e.target)`, it's outside.
      // But if after re-render the clicked element gets removed from the DOM, so it cannot be found
      // in the root element. Instead we capture and flag the click event before it bubbles up
      // to the `document` to be handled by `handleOutClick`.
      this.isInClick = false;
      this.handleInClick = () => {
        this.isInClick = true;
      };

      this.handleOutClick = (e) => {
        const isOutClick = !this.isInClick;
        this.isInClick = false;

        const { onOutClick } = this.props;
        if (isOutClick && typeof onOutClick === 'function') {
          onOutClick(e);
        }
      };

      document.addEventListener('click', this.handleOutClick, true);
    }
  }

  componentWillUpdate({ onOutClick, ...props }) {  // eslint-disable-line no-unused-vars
    // It's recommended to use `ref` callbacks instead of `findDOMNode`. https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <div {...props} ref={this.handleRootRef} />,
      this.node
    );
  }

  componentWillUnmount() {
    if (canUseDOM) {
      // `this.handleRootRef` won't be called with `null`, so cleanup here.
      if (this.root) {
        this.root.removeEventListener('click', this.handleInClick);
      }
      document.removeEventListener('click', this.handleOutClick);
      document.body.removeChild(this.node);
    }
  }

  render() {
    return null;
  }

}
