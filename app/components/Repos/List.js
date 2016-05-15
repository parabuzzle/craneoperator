import React  from 'react';
import axios  from 'axios';
import Loader from 'react-loader';

import { Button } from 'react-bootstrap';

export default class List extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      repos: [],
      repo: undefined,
      loaded: false,
      error: undefined
    }
  }

  init(){
    this.props.setRepo;
    this.getReposList()
      .then(function(data){
        this.setState({
          repos: data,
          loaded: true,
          repo: this.props.repo
        })
      }.bind(this));
  }

  componentDidMount(){
    this.init();
  }

  getReposList(){
    return axios.get(`/containers.json`)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (response){
        this.setState({
          loaded: true,
          error: response
        })
      });
  }

  handleClick(name){
    this.props.setRepo(name);
    this.setState({
      repo: name
    })
  }

  render(){
    return(
      <ul className="list-group">
        <Loader loaded={this.state.loaded} color="red" scale={0.75}>
          {this.state.error && "Error Fetching Repos"}
          {this.state.repos.map((repo, index) => (
            this.state.repo === repo ?
              <Button bsClass="list-group-item active" key={index} onClick={() => this.handleClick(repo)}>{repo}</Button>
              :
              <Button bsClass="list-group-item" key={index} onClick={() => this.handleClick(repo)}>{repo}</Button>
          ))}
        </Loader>
      </ul>
    )
  }
}
