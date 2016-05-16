import React    from 'react';
import RepoTags from './Repos/RepoTags';
import List     from './Repos/List';

class Tags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      repo: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      repo: nextProps.repo
    })
  }
  render() {
    return (
      <div>
        <RepoTags repo={this.state.repo} setTag={this.props.setTag}/>
      </div>
    );
  }
}

export default Tags;

Tags.propTypes = {
  setTag: React.PropTypes.func.isRequired
}
