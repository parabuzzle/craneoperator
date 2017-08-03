import React from 'react';
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Login from '../../components/Login.jsx';

export default class Header extends React.Component {
  title(){
    if(this.props.registry.title){
      return(this.props.registry.title)
    }
    return("Crane Operator")
  };



  render(){
    return (
      <div>
        <Navbar staticTop={true}>
          <Navbar.Header>
            <img className='navbar-brand' src="mini-logo.svg"/>
              <Navbar.Brand>
                <Link to="/">{this.title()}</Link>
              </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <Login registry={this.props.registry} eventKey={1}/>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
