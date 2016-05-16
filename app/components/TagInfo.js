import React       from 'react';
import RepoTags    from './Repos/RepoTags';
import RepoTagInfo from './Repos/RepoTagInfo';

class TagInfo extends React.Component {
  render() {
    return (
      <div>
        <h3>Information</h3>
        <RepoTagInfo tag={this.props.tag} repo={this.props.repo} getinfo={this.props.getinfo}/>
      </div>
    );
  }
}


export default TagInfo;

TagInfo.propTypes = {
  getinfo: React.PropTypes.bool.isRequired,
  tag: React.PropTypes.string,
  repo: React.PropTypes.string
}
