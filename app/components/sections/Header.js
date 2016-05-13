import React from 'react';

import { Navbar } from 'react-bootstrap';

export default class Header extends React.Component {
  render(){
    return (
      <div>
        <Navbar staticTop={true}>
          <Navbar.Header>
            <img className='navbar-brand' src="mini-logo.svg"/>
              <Navbar.Brand>
                Crane Operator
              </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}
