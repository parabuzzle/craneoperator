import React from 'react';

export default class RepoConfig extends React.Component {

  render() {
    return (
      <div>
        <h3>Configuration</h3>
        <div className="row">
          <div className="col-md-3">
            <b>Entrypoint:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.Entrypoint && this.props.config.Entrypoint.map((point, index) => (
              <span key={index}>{point} </span>
            ))}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <b>CMD:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.Cmd && this.props.config.Cmd.map((cmd, index) => (
              <span key={index}>{cmd} </span>
            ))}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <b>ENV:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.Env && this.props.config.Env.map((env, index) => (
              <div key={index}>{env}</div>
            ))}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <b>Exposed Ports:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.ExposedPorts && Object.keys(this.props.config.ExposedPorts).map((port, index) => (
              <div key={index}>{port}</div>
            ))}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <b>Volumes:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.Volumes && Object.keys(this.props.config.Volumes).map((volume, index) => (
              <div key={index}>{volume}</div>
            ))}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <b>Labels:</b>
          </div>
          <div className="col-md-9">
            {this.props.config.Labels && Object.keys(this.props.config.Labels).map((label, index) => (
                <div key={index}>{label} : {this.props.config.Labels[label]}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

RepoConfig.propTypes = {
  config: React.PropTypes.object.isRequired
}
