import React from 'react';
import axios from 'axios';

import { Navbar } from 'react-bootstrap';

export default class Footer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      registry: {}
    }
  }

  getRegistryInfo(){
    return axios.get(`/registryinfo`)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (response) {
        console.log('ERROR IN AXIOS! ' + response);
      });
  };

  componentDidMount(){
    this.getRegistryInfo()
      .then(function(data){
        this.setState({
          registry: data
        })
      }.bind(this));
  }

  render() {
    return (
      <div className='footer-pad'>
        <Navbar inverse={true} fixedBottom={true}>
          <Navbar.Text>
            Crane Operator browsing {this.state.registry.host}
          </Navbar.Text>
          <Navbar.Text pullRight>
            <Navbar.Link href="https://github.com/parabuzzle/craneoperator" target="_blank">GitHub Project</Navbar.Link>
          </Navbar.Text>
        </Navbar>
      </div>
    );
  }
}
