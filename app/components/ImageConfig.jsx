import React from 'react';
import TitleValue from './TitleValue.jsx';

export default class ImageConfig extends React.Component {

  render() {
    return (
      <div>
        <h3>Configuration</h3>
        <TitleValue title="Entrypoint">
          {this.props.config.Entrypoint && this.props.config.Entrypoint.map((point, index) => (
            <span key={index}>{point} </span>
          ))}
        </TitleValue>

        <hr/>

        <TitleValue title="CMD">
          {this.props.config.Cmd && this.props.config.Cmd.map((cmd, index) => (
            <span key={index}>{cmd} </span>
          ))}
        </TitleValue>

        <hr/>

        <TitleValue title="ENV">
          {this.props.config.Env && this.props.config.Env.map((env, index) => (
            <div key={index}>{env}</div>
          ))}
        </TitleValue>

        <hr/>

        <TitleValue title="WORKDIR" value={this.props.config.WorkingDir}/>

        <hr/>

        <TitleValue title="Exposed Ports">
          {this.props.config.ExposedPorts && Object.keys(this.props.config.ExposedPorts).map((port, index) => (
            <div key={index}>{port}</div>
          ))}
        </TitleValue>

        <hr/>

        <TitleValue title="Volumes">
          {this.props.config.Volumes && Object.keys(this.props.config.Volumes).map((volume, index) => (
            <div key={index}>{volume}</div>
          ))}
        </TitleValue>

        <hr/>

        <TitleValue title="Labels">
          {this.props.config.Labels && Object.keys(this.props.config.Labels).map((label, index) => (
              <div key={index}>{label} : {this.props.config.Labels[label]}</div>
          ))}
        </TitleValue>
      </div>
    );
  }
}
