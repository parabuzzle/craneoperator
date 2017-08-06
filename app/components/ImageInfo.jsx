import { Button, Col, ButtonGroup } from 'react-bootstrap';
import React from 'react';
import TitleValue from './TitleValue.jsx';
import TimeDisplay from './TimeDisplay.jsx';
import ImageConfig from './ImageConfig.jsx';
import LayerInfo from './LayerInfo.jsx';

export default class ImageInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active_tab: 'configuration'
    }
  }

  delete_functions() {
    if ( this.props.delete_allowed === true ) {
      return(
          <div className="trash">
            <a href="#" onClick={() => this.props.handleTagDelete(this.props.container, this.props.tag)}><i className="fa fa-trash" aria-hidden="true"></i> <span className="trashText">Delete Image</span></a>
          </div>
        )
    } else {
      return(
          <div></div>
        )
    }
  }

  toggleTab(){
    if(this.state.active_tab === "configuration"){
      this.setState({
        active_tab: 'layerinfo'
      })
    }
    if(this.state.active_tab === "layerinfo"){
      this.setState({
        active_tab: 'configuration'
      })
    }
  }

  renderActiveTab(){
    if(this.state.active_tab === "configuration"){
      return(<ImageConfig config={this.props.info.information.config}/>)
    }
    if(this.state.active_tab === "layerinfo"){
      console.log(this.props.info)
      return(<LayerInfo/>)
    }
  }

  renderInfo(){
    if(this.props.info){
      return(
          <div>
            <div className="row">
              <div className="col-md-12">
                {this.delete_functions()}
              </div>
            </div>
            <TitleValue title="Architecture" value={this.props.info.architecture}/>
            <TitleValue title="OS" value={this.props.info.information && this.props.info.information.os}/>
            <TitleValue title="Created">
              <TimeDisplay time={this.props.info.information && this.props.info.information.created_millis}/>
            </TitleValue>
            <TitleValue title="Author" value={this.props.info.information && this.props.info.information.author}/>
            <TitleValue title="ID" value={this.props.info.information && this.props.info.information.id}/>
            <TitleValue title="Container" value={this.props.info.information && this.props.info.information.container}/>
            <TitleValue title="Docker Version" value={this.props.info.information && this.props.info.information.docker_version} />
            <TitleValue title="Pull Command" value={"docker pull " + this.props.public_url + '/' + this.props.container + ':' + this.props.tag} />
            <hr/>
            <ButtonGroup justified>
              <Button href="#" bsStyle="default" active={this.state.active_tab === "configuration"} onClick={() => this.toggleTab()}>Configuration</Button>
              <Button href="#" bsStyle="default" active={this.state.active_tab === "layerinfo"} onClick={() => this.toggleTab()} >Layer Info</Button>
            </ButtonGroup>
            {this.renderActiveTab()}
          </div>
        )
    }
  }

  render(){
    return(
      <div>
        {this.renderInfo()}
      </div>
    )
  }
}
