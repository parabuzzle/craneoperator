import React   from 'react';
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
      getinfo: false
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
      repo: name
    })
  }

  render(){
  return(
    <div className="main-container">
      <Header />
      <div className="container">
        <div className="col-sm-3">
          <Repos repo={this.state.repo} setRepo={(name) => this.handleSetRepo(name)}/>
        </div>
        <div className="col-sm-3">
          <Tags repo={this.state.repo} setTag={(name) => this.handleSetTag(name)}/>
        </div>
        <div className="col-sm-6 col-left-border">
          <TagInfo tag={this.state.tag} repo={this.state.repo} getinfo={this.state.getinfo}/>
        </div>
      </div>
      <Footer />
    </div>
  )};
}

export default RepoBrowser;
