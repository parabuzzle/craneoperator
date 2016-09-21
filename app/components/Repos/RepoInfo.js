import React      from 'react';
import Time       from 'react-time';
import Loader     from 'react-loader';
import RepoConfig from './RepoConfig';
import { Button } from 'react-bootstrap';


require('react-datetime');

export default class RepoTagInfo extends React.Component {

  delete_functions() {
    if ( this.props.registry.delete_allowed === true ) {
      return(
          <div className="trash">
            <a href="#" onClick={() => this.props.handleTagDelete(this.props.repo, this.props.tag)}><i className="fa fa-trash" aria-hidden="true"></i> <span className="trashText">Delete Image</span></a>
          </div>
        )
    } else {
      return(
          <div></div>
        )
    }
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-md-12">
            {this.delete_functions()}
          </div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Architecture:</b></div>
          <div className="col-md-9">{this.props.info.architecture}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>OS:</b></div>
          <div className="col-md-9">{this.props.info.information && this.props.info.information.os}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Created:</b></div>
          <div className="col-md-9">
            {this.props.info.information && <Time value={this.props.info.information.created_millis} format="MM/DD/YYYY hh:mma" />} UTC
            <span className='small text-muted'> ({this.props.info.information && <Time value={this.props.info.information.created_millis} titleFormat="YYYY/MM/DD HH:mm" relative />})</span></div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Author:</b></div>
          <div className="col-md-9">{this.props.info.information && this.props.info.information.author}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>ID:</b></div>
          <div className="col-md-9">{this.props.info.information && this.props.info.information.id}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Container:</b></div>
          <div className="col-md-9">{this.props.info.information && this.props.info.information.container}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Docker Version:</b></div>
          <div className="col-md-9">{this.props.info.information && this.props.info.information.docker_version}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Pull Command:</b></div>
          <div className="col-md-9">docker pull {this.props.registry.public_url}/{this.props.repo}:{this.props.tag}</div>
        </div>
      </div>
    )
  }
}

RepoTagInfo.propTypes = {
  info: React.PropTypes.object.isRequired,
  registry: React.PropTypes.object.isRequired,
  handleTagDelete: React.PropTypes.func.isRequired,
  repo: React.PropTypes.string,
  tag: React.PropTypes.string
}
