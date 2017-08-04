import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import RegistryInfo from '../api/RegistryInfo.jsx';
import HomeView from './HomeView.jsx';
import LoginView from './LoginView.jsx';
import Header from './sections/Header.jsx';
import Footer from './sections/Footer.jsx';

export default class AppContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      registry: {},
      username: null
    }
  }

  componentDidMount() {
    RegistryInfo()
      .then(function (response) {
        const username = response.data.username
        this.setState({
          registry: response.data,
          username: username
        })
      }.bind(this))
      .catch(function(response){})
  }

  render() {
    return (
      <Router>
        <div>
          <Header registry={this.state.registry}/>

          <div className="container">
            <Route exact path="/" component={HomeView}/>
            <Route exact path="/login" component={LoginView}/>
          </div>

          <Footer registry={this.state.registry}/>
        </div>
      </Router>
    );
  }
}

