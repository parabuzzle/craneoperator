import React from 'react';

import { Navbar } from 'react-bootstrap';

export default class Footer extends React.Component {

  render() {
    return (
      <div className='footer-pad'>
        <Navbar inverse={true} fixedBottom={true}>
          <Navbar.Text>
            Crane Operator browsing {this.props.registry.public_url}
          </Navbar.Text>
          <Navbar.Text pullRight>
            <Navbar.Link href="https://github.com/parabuzzle/craneoperator" target="_blank">GitHub Project</Navbar.Link>
          </Navbar.Text>
        </Navbar>
      </div>
    );
  }
}
