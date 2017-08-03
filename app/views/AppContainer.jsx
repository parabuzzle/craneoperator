import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import HomeView from './HomeView.jsx';
import LoginView from './LoginView.jsx';
import Header from './sections/Header.jsx';
import Footer from './sections/Footer.jsx';

export default class AppContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      registry: {}
    }
  }

  fetchRegistryInfo(){
    return axios.get(`/api/registryinfo`)
      .then(function (response) {
        this.setState({
          registry: response.data
        })
      }.bind(this))
      .catch(function (response) {
        console.log('ERROR IN AXIOS! ' + response);
      });
  };

  componentDidMount() {
    this.fetchRegistryInfo()
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

