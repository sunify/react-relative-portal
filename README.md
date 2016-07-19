# React relative portal
React component for place dropdown-like components outside overflow: hidden; sections

## Installation
`npm instal react-relative-portal --save`

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

    this.handleToggle = () => {
      this.setState({ show: !this.state.show });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  render() {
    return (
      <div>
        <button onClick={this.handleToggle}>Dropdown toggle</button>
        <RelativePortal
          component="div"
          left={0}
          top={10}
          onOutClick={this.handleHide}
        >
          <div style={{ padding: 10, backgroundColor: '#FFF' }}>
            Dropdown content
          </div>
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
