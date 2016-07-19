import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'exenv';

function getRID(node) {
  return (node && node.dataset && node.dataset.reactid) || '';
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

      this.handleOutClick = (e) => {
        const rid = getRID(ReactDOM.findDOMNode(this.element));
        const eRid = getRID(e.target);
        if (eRid.indexOf(rid) !== 0 && this.props.onOutClick) {
          this.props.onOutClick();
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
