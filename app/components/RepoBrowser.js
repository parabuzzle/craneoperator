import React   from 'react';
import axios   from 'axios';
import Footer  from './sections/Footer';
import Header  from './sections/Header';
import Repos   from './Repos';
import Tags    from './Tags';
import TagInfo from './TagInfo';

class RepoBrowser extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      repo: undefined,
      tag: undefined,
      getinfo: false,
      registry: {}
    }
  }

  handleSetTag(name){
    this.setState({
      tag: name,
      getinfo: true
    })
  }

  handleSetRepo(name){
    this.setState({
      getinfo: false,
      repo: name,
      tag: undefined
    })
  }

  componentDidMount(){
    this.getRegistryInfo()
      .then(function(data){
        this.setState({
          registry: data
        })
      }.bind(this));
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

  handleTagDelete(repo, tag){
    bootbox.confirm('Are you sure? You cannot undo this action!', (function(confirmed) {
      if (confirmed) {
        this.deleteTag(repo, tag)
      }
    }).bind(this))
  }

  deleteTag(repo, tag){
    this.deleteTagViaApi(repo, tag)
    this.setState({
      tag: undefined,
      getinfo: false
    })
  }

  deleteTagViaApi(repo, tag){
    return axios.delete(`/container/${repo}/${tag}.json`)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (response){
      });
  }

  render(){
  return(
      <div className="container">
        <div className="col-sm-3">
          <Repos repo={this.state.repo} setRepo={(name) => this.handleSetRepo(name)}/>
        </div>
        <div className="col-sm-3">
          <Tags repo={this.state.repo} tag={this.state.tag} setTag={(name) => this.handleSetTag(name)}/>
        </div>
        <div className="col-sm-6 col-left-border">
          <TagInfo tag={this.state.tag} repo={this.state.repo} handleTagDelete={(repo, tag) => this.handleTagDelete(repo, tag)} getinfo={this.state.getinfo} registry={this.state.registry}/>
        </div>
      </div>
  )};
}

export default RepoBrowser;
