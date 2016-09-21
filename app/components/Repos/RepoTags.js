import React  from 'react';
import axios  from 'axios';
import Loader from 'react-loader';

import { Button } from 'react-bootstrap';

export default class RepoTags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tags: [],
      repo: undefined,
      tag: undefined,
      loaded: true,
      updating: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updating === true){
      this.updateList(this.state.repo)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      updating: true
    })

    if(nextProps.tag === undefined ){
      this.setState({
        tag: undefined,
        loaded: false,
      })
    }

    if(nextProps.repo !== this.state.repo){
      this.setState({
        repo: nextProps.repo,
        loaded: false,
        tag: undefined
      })
    }
  }

  updateList(repo){
    this.getTags(repo)
      .then(function(data){
        this.setState({
          tags: data,
          loaded: true,
          updating: false
        })
      }.bind(this));
  }

  getTags(repo){
    return axios.get(`/container/${repo}/tags.json`)
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

  handleClick(tag){
    this.props.setTag(tag);
    this.setState({
      tag: tag
    })
  }

  render(){
    return(
      <div>
        <h3>Tags</h3>
        <ul className="list-group">
           <Loader loaded={this.state.loaded} color="red" scale={0.75}>
           {this.state.error && "Error Fetching Repos"}
            {this.state.tags.map((tag, index) => (
              this.state.tag === tag ?
                <Button bsClass="list-group-item active" key={index} onClick={() => this.handleClick(tag)}>{tag}</Button>
                :
                <Button bsClass="list-group-item" key={index} onClick={() => this.handleClick(tag)}>{tag}</Button>
            ))}
          </Loader>
        </ul>
      </div>
    )
  }
}

RepoTags.propTypes = {
  setTag: React.PropTypes.func.isRequired,
  tag: React.PropTypes.string
}
