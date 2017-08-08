import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import TitleValue from './TitleValue.jsx';
import TimeDisplay from './TimeDisplay.jsx';

export default class Layer extends Component {
  constructor(props){
    super(props);
    this.state = {
      show: false
    }
  }

  formatCmd(cmd){
    if(!cmd[0]){
      return(cmd)
    }
    let c = cmd[0].replace(/^\/bin\/sh -c /, "RUN ")
    let c1 = c.replace(/^RUN \#\(nop\)/, "")
    return(c1)
  }

  render() {
    return (
      <div>
        <TitleValue title="Layer ID" value={this.props.info.id}/>
        <TitleValue title="Parent Layer" value={this.props.info.parent || "base layer"}/>
        <TitleValue title="Created">
          <TimeDisplay time={this.props.info.created}/>
        </TitleValue>
        <TitleValue title="Command">
          <span className='small'>{this.formatCmd(this.props.info.container_config.Cmd)}</span>
        </TitleValue>
        <hr/>
      </div>
    );
  }
}
