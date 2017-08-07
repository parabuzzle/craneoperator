import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class TitleValue extends Component {
  render() {
    return (
      <Row>
        <Col md={3}>
          <b>{this.props.title}</b>
        </Col>
        <Col md={9}>
          {this.props.children || this.props.value}
        </Col>
      </Row>
    );
  }
}
