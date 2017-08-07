import { Button, Col, Row, ButtonGroup, Modal } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';
import TitleValue from './TitleValue.jsx';
import TimeDisplay from './TimeDisplay.jsx';
import ImageConfig from './ImageConfig.jsx';
import LayerInfo from './LayerInfo.jsx';
import DeleteTagAPI from '../api/DeleteTag.jsx';

export default class ImageInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active_tab: 'configuration',
      confirm: false
    }
  }

  delete_functions() {
    if ( this.props.delete_allowed === true ) {
      return(
          <div className="trash">
            <a href="#" onClick={() => this.confirm()}><i className="fa fa-trash" aria-hidden="true"></i> <span className="trashText">Delete Image</span></a>
          </div>
        )
    } else {
      return(
          <div></div>
        )
    }
  }

  cancelDelete(){
    this.setState({
      confirm: false
    })
  }

  confirm(){
    this.setState({
      confirm: true
    })
  }

  handleTagDelete(container, tag){
    DeleteTagAPI(container, tag)
    .then(function(){
      window.location.assign("/containers/" + container + this.props.location.search)
    }.bind(this))
  }

  toggleTab(tab){
    this.setState({
      active_tab: tab
    })
  }

  renderActiveTab(){
    if(this.state.active_tab === "configuration"){
      return(<ImageConfig config={this.props.info.information.config}/>)
    }
    if(this.state.active_tab === "layerinfo"){
      return(<LayerInfo info={this.props.info.layer_info}/>)
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
            <ButtonGroup>
              <Button style={{width: 125}} href="#" bsStyle="default" active={this.state.active_tab === "configuration"} onClick={() => this.toggleTab('configuration')}>Configuration</Button>
              <Button style={{width: 125}} href="#" bsStyle="default" active={this.state.active_tab === "layerinfo"} onClick={() => this.toggleTab('layerinfo')} >Layer Info</Button>
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
        <div>
          <Modal show={this.state.confirm} onHide={() => this.cancelDelete()}>
            <Modal.Header>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              Deleting an image is not reversible! Are you sure you want to proceed?
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => this.cancelDelete()}>Nevermind</Button>
              <Button bsStyle="primary" onClick={() => this.handleTagDelete(this.props.container, this.props.tag)}>Yes, I'm Sure</Button>
            </Modal.Footer>

          </Modal>
        </div>
      </div>
    )
  }
}
