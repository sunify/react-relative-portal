import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownW: {
    position: 'absolute',
    marginTop: 5,
  },
  dropdown: {
    width: 120,
    padding: 5,
    backgroundColor: '#FFF',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
};

export default class Hint extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    position: PropTypes.oneOf(['left', 'right']),
  };

  state = {
    show: false,
  };

  render() {
    const { children, position = 'left' } = this.props;
    const { show } = this.state;
    const dropdownStyle = position === 'left' ? { left: 0 } : { right: 0 };

    return (
      <div style={styles.container}>
        <button
          onClick={() => setTimeout(() => this.setState({ show: !show }))}
        >
          Show content
        </button>

        {show && (
          <div style={{ ...dropdownStyle, ...styles.dropdownW }}>
            <div style={styles.dropdown}>{children}</div>
          </div>
        )}
      </div>
    );
  }
}
