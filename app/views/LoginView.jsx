import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, Col, Row } from 'react-bootstrap';

export default class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: undefined,
      password: undefined
    }
  }

  handleUsername(event){
    this.setState({
      username: event.target.value
    })
  }

  handlePassword(event){
    this.setState({
      password: event.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>Login to Docker Registry</h1>
        <Row>
          <form>
            <Col md={4}>
              <Row style={{paddingBottom: "1em", paddingTop: "2em"}}>
                <Col sm={12}>
                  <FormControl type="text"
                    placeholder="Username"
                    onChange={(event) => this.handleUsername(event)}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <FormControl type="password"
                    placeholder="Password"
                    onChange={(event) => this.handlePassword(event)}
                  />
                </Col>
              </Row>

            </Col>
          </form>
        </Row>
      </div>
    );
  }
}
