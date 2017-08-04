import React, { Component } from 'react';
import { Button, FormControl, FormGroup, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import Login from '../api/Login.jsx';

export default class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      error_state: null,
      error: undefined
    }
  }

  onSubmit(){
    if(!this.state.username || !this.state.password) {
      this.setState({
        error_state: 'error',
        error: "You must enter a username and password"
      })
      return(false)
    }
    const login = Login(this.state.username, this.state.password)
    .then(function(response){
      this.setState({
        error_state: null,
        error: undefined
      })
      // Have to force a window redirect here to ensure good login state display
      window.location.assign('/');
    }.bind(this))
    .catch(function(response){
      this.setState({
        error_state: 'error',
        error: 'Invalid login credentials, please check and try again.'
      })
    }.bind(this))
  }

  handleFormKey(event){
    if(event.key == 'Enter'){
      this.onSubmit()
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

  displayError(){
    if(this.state.error){
      return(
        <Panel header="Error" bsStyle="danger">
          {this.state.error}
        </Panel>
        )
    }
  }

  render() {
    return (
      <div onKeyPress={(event) => this.handleFormKey(event)}>

        <h1>Login to Docker Registry</h1>
        {this.displayError()}
        <Row>
          <form>
            <FormGroup
              validationState={this.state.error_state}
            >
              <Col md={4}>
                <Row style={{paddingBottom: "1em"}}>
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
                <Row style={{paddingBottom: "1em", paddingTop: "1em"}}>
                  <Col md={4}>
                    <Button bsStyle="primary" onClick={() => this.onSubmit()}>
                      Login
                    </Button>
                  </Col>
                </Row>
              </Col>
            </FormGroup>
          </form>
        </Row>
      </div>
    );
  }
}
