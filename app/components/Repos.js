import React from 'react';
import List  from './Repos/List';

class Repos extends React.Component {
  render(){
    return(
      <div>
        <h3>Repos</h3>
          <List setRepo={this.props.setRepo}/>
      </div>
    )
  }
}

export default Repos;
