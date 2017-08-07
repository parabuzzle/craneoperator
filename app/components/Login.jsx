import React, { Component } from 'react';
import { NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Login extends Component {

  displayLogin(){
    if (this.props.registry.username){
      return(
          <NavDropdown eventKey={this.props.eventKey} title={"Logged in as " + this.props.registry.username} id="login-dropdown">
            <MenuItem eventKey={this.props.eventKey + 0.1} href="/logout">Logout</MenuItem>
          </NavDropdown>
        )
    }
    return(
        <NavItem eventKey={this.props.eventKey} href="/login">Login</NavItem>
      )
  }

  render() {
    return (
        this.displayLogin()
    );
  }
}
