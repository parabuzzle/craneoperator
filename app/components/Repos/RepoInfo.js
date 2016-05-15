import React      from 'react';
import Time       from 'react-time';
import Loader     from 'react-loader';
import RepoConfig from './RepoConfig';


require('react-datetime');

export default class RepoTagInfo extends React.Component {

  render(){
    console.log(this.props.info)
    return(
      <div>
        <div className="row">
          <div className="col-md-3"><b>Architecture:</b></div>
          <div className="col-md-7">{this.props.info.architecture}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>OS:</b></div>
          <div className="col-md-7">{this.props.info.information && this.props.info.information.os}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Created:</b></div>
          <div className="col-md-7">
            {this.props.info.information && <Time value={this.props.info.information.created_millis} format="MM/DD/YYYY hh:mma" />} UTC
            <span className='small text-muted'> ({this.props.info.information && <Time value={this.props.info.information.created_millis} titleFormat="YYYY/MM/DD HH:mm" relative />})</span></div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Author:</b></div>
          <div className="col-md-7">{this.props.info.information && this.props.info.information.author}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>ID:</b></div>
          <div className="col-md-7">{this.props.info.information && this.props.info.information.id}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Container:</b></div>
          <div className="col-md-7">{this.props.info.information && this.props.info.information.container}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><b>Docker Version:</b></div>
          <div className="col-md-7">{this.props.info.information && this.props.info.information.docker_version}</div>
        </div>
      </div>
    )
  }
}
