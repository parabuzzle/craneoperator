import React, { Component } from 'react';

export default class HomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      term: ""
    }
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}
