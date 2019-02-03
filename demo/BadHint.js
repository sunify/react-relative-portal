import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'inline-block',
  },
  icon: {
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '16px',
    width: 16,
    height: 16,
    backgroundColor: '#fc0',
    borderRadius: 8,
    cursor: 'help',
  },
  tooltipW: {
    position: 'absolute',
    marginLeft: 5,
  },
  tooltip: {
    width: 120,
    padding: 5,
    backgroundColor: '#fc0',
  },
};

export default class BadHint extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  state = {
    hover: false,
  };

  render() {
    const { children } = this.props;
    const { hover } = this.state;

    return (
      <div style={styles.container}>
        <span
          style={styles.icon}
          onMouseOver={() => this.setState({ hover: true })}
          onMouseOut={() => this.setState({ hover: false })}
        >
          ?
        </span>
        {hover && (
          <span style={styles.tooltipW}>
            <div style={styles.tooltip}>{children}</div>
          </span>
        )}
      </div>
    );
  }
}
