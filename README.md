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
* **top (number, default 0)** — set top offset from current position
* **right (number)** — set right offset from current position. If undefined, portal positons from left.
* **left (number, default 0)** — set left offset from current position. If `right` prop is set, `left` ignores.
* **onOutClick (function)** — fire when user click outside portal element
* **component(any, default 'span')** — component class or dom tagName
* **children (any)** — portal content
