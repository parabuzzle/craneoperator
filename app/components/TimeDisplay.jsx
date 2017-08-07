import React, { Component } from 'react';
import Time       from 'react-time';

export default class TimeDisplay extends Component {
  render() {
    return (
      <span>
          <Time value={this.props.time} format="MM/DD/YYYY hh:mma" /> UTC
          <span className='small text-muted'> (<Time value={this.props.time} titleFormat="YYYY/MM/DD HH:mm" relative />)</span>
      </span>
    );
  }
}
