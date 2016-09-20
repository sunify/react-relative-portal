import React, { PropTypes } from 'react';
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

      this.handleOutClick = e => {
        if (typeof this.props.onOutClick === 'function') {
          const root = ReactDOM.findDOMNode(this.element);
          if (!e.path.some(node => node.isEqualNode && node.isEqualNode(root))) {
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
