import React      from 'react';
import Time       from 'react-time';
import axios      from 'axios';
import Loader     from 'react-loader';
import RepoConfig from './RepoConfig';
import RepoInfo   from './RepoInfo';

require('react-datetime');

export default class RepoTagInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      repo: undefined,
      tag: undefined,
      info: undefined,
      loaded: true,
      error: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.getinfo){
      this.setState({
        repo: nextProps.repo,
        loaded: false,
        tag: nextProps.tag
      })
      this.updateList(nextProps.repo, nextProps.tag)
    } else {
      this.setState({
          info: undefined,
          tag: undefined,
          repo: undefined,
          loaded: true
        })
    }
  }

  updateList(repo, tag){
    this.getTagInfo(repo, tag)
      .then(function(data){
        this.setState({
          info: data,
          loaded: true
        })
      }.bind(this));
  }

  getTagInfo(repo, tag){
    return axios.get(`/container/${repo}/${tag}.json`)
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

  render(){
    const {info} = this.state;
    return(
      <div>
        <Loader loaded={this.state.loaded} color="red" scale={0.75} >
          {this.state.error && "Error Fetching Repos"}
          { this.state.info && <RepoInfo info={this.state.info} />}
          <div className="row">
            <div className="col-md-12">
              {this.state.info && <RepoConfig config={this.state.info.information.config} />}
            </div>
          </div>
        </Loader>
      </div>
    )
  }
}
