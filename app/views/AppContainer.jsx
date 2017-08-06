import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import RegistryInfo from '../api/RegistryInfo.jsx';
import HomeView from './HomeView.jsx';
import ContainerList from '../components/ContainerList.jsx';
import TagList from '../components/TagList.jsx';
import LoginView from './LoginView.jsx';
import Header from './sections/Header.jsx';
import Footer from './sections/Footer.jsx';
import ImageInfoView from './ImageInfoView.jsx';
import NotFound from '../components/NotFound.jsx';

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
            <Switch>
              <Route exact path="/:container_name*/" component={HomeView}/>
              <Route exact strict path="/login" component={LoginView}/>
              <Route component={NotFound}/>
            </Switch>
          </div>

          <Footer registry={this.state.registry}/>
        </div>
      </Router>
    );
  }
}

