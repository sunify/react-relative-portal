# React relative portal
React component for place dropdown-like components outside overflow: hidden; sections

## Installation
`npm install react-relative-portal --save`

## Example
```es6
import React from 'react';
import RelativePortal from 'react-relative-portal';

export default class DropdownLink extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this._setShowAsyncTimer = null;

    this._handleShow = () => {
      this._setShowAsync(true);
    };

    this._handleHide = () => {
      this._setShowAsync(false);
    };
  }
  
  componentWillUnmount() {
    // Prevent the asynchronous `setState` call after unmount.
    clearTimeout(this._setShowAsyncTimer);
  }
  
  /**
   * Changes the dropdown show/hide state asynchronously.
   *
   * Need to change the dropdown state asynchronously,
   * otherwise the dropdown gets immediately closed
   * during the dropdown toggle's `onClick` which propagates to `onOutClick`.
   */
  _setShowAsync(show) {
    // Prevent multiple asynchronous `setState` calls, jsut the latest has to happen.
    clearTimeout(this._setShowAsyncTimer);
    this._setShowAsyncTimer = setTimeout(() => {
      this.setState({ show: show });
    }, 0);
  }

  render() {
    const { show } = this.state;

    return (
      <div>
        <button onClick={show ? this._handleHide : this._handleShow}>
          Dropdown toggle
        </button>
        <RelativePortal
          component="div"
          left={0}
          top={10}
          onOutClick={show ? this._handleHide : null}
        >
          {show &&
            <div style={{ padding: 10, backgroundColor: '#FFF' }}>
              Dropdown content
            </div>
          }
        </RelativePortal>
      </div>
    );
  }

}
```

## Props
```es6
export default class RelativePortal extends React.Component {
  static propTypes = {
    right: PropTypes.number, // set right offset from current position. If undefined portal positons from left
    left: PropTypes.number, // set left offset from current position. If `right` prop is set, `left` ignores
    fullWidth: PropTypes.bool, // enables you to set both left and right portal positions
    top: PropTypes.number, // set top offset from current position
    children: PropTypes.any.isRequired, // portal content
    onOutClick: PropTypes.func, // called when user click outside portal element
    component: PropTypes.string.isRequired, // dom tagName
  };

  static defaultProps = {
    left: 0,
    top: 0,
    component: 'span',
  };

  ...

}
```
