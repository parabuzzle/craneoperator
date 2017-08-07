import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Login from '../../components/Login.jsx';

export default class Header extends React.Component {
  title(){
    if(this.props.registry.title){
      return(this.props.registry.title)
    }
    return("Crane Operator")
  };

  showLogin(){
    if(this.props.registry.login_allowed){
      return(
            <Login registry={this.props.registry} eventKey={1}/>
            )
    }
  }



  render(){
    return (
      <div>
        <Navbar staticTop={true}>
          <Navbar.Header>
            <img className='navbar-brand' src="/mini-logo.svg"/>
              <Navbar.Brand>
                <a href="/">{this.title()}</a>
              </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            {this.showLogin()}
          </Nav>
        </Navbar>
      </div>
    );
  }
}
