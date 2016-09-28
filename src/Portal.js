import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'exenv';

function eventPath(e) {
  if (e.path) {
    return e.path;
  }

  const path = [];
  let node = e.target;
  while (!document.body.isEqualNode(node)) {
    path.push(node);
    node = node.parentNode;
  }
  return path;
}

export default class Portal extends React.Component {

  static propTypes = {
    onOutClick: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    if (canUseDOM) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);

      this.handleOutClick = e => {
        if (typeof this.props.onOutClick === 'function') {
          const root = ReactDOM.findDOMNode(this.element);
          if (!eventPath(e).some(node => node.isEqualNode && node.isEqualNode(root))) {
            this.props.onOutClick();
          }
        }
      };

      document.addEventListener('click', this.handleOutClick);
    }
  }

  componentWillUpdate({ onOutClick, ...props }) { // eslint-disable-line
    this.element = ReactDOM.render(
      <div {...props} />,
      this.node
    );
  }

  componentWillUnmount() {
    if (canUseDOM) {
      document.removeEventListener('click', this.handleOutClick);
      document.body.removeChild(this.node);
    }
  }

  handleOutClick() {
    if (this.props.onOutClick) {
      this.props.onOutClick();
    }
  }

  render() {
    return null;
  }

}
