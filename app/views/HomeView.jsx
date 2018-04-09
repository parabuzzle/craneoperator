import React, { Component } from 'react';
import ContainerListAPI from '../api/ContainerList.jsx';
import TagsListAPI from '../api/TagsList.jsx';
import ImageInfoAPI from '../api/ImageInfo.jsx';
import { Button, FormGroup, FormControl, Col, Row, Panel} from 'react-bootstrap';
import { debounce } from 'throttle-debounce';
import queryString from 'query-string';
import ContainerList from '../components/ContainerList.jsx';
import TagList from '../components/TagList.jsx';
import NotFound from '../components/NotFound.jsx'
import ImageInfo from '../components/ImageInfo.jsx';
import RegistryInfo from '../api/RegistryInfo.jsx';
import Loader from 'react-loader';

export default class HomeView extends Component {
  constructor(props){
    super(props);
    let container = undefined
    let tag = undefined
    const parsedQuery = queryString.parse(this.props.location.search)
    const container_filter = (parsedQuery.container_filter) ? parsedQuery.container_filter : undefined
    const tag_filter = (parsedQuery.tag_filter) ? parsedQuery.tag_filter : undefined
    if(props.match.params.container_name){
      container = props.match.params.container_name.replace(/\/tag.*/, '')
      const tagRE = props.match.params.container_name.match(/\/tag\/(.*)/)
      tag = tagRE ? tagRE[1] : undefined
    }
    this.state = {
      containers_loaded: false,
      containers: [],
      container: container,
      container_filter: container_filter,
      tags_list: [],
      tags_loaded: false,
      tag_filter: tag_filter,
      tag: tag,
      main_error: undefined,
      error: undefined,
      tags_error: undefined,
      container_not_found: false,
      main_loaded: false,
      active: false,
      image_info_loaded: false,
      image_info: undefined,
      registry: {}
    }
    // Debounce api calls
    this.fetchContainerList = debounce(350, this.fetchContainerList)
    this.fetchTagsList = debounce(350, this.fetchTagsList)
  }

  // component callbacks
  componentWillMount() {
    this.fetchContainerList()
    this.fetchTagsList(this.state.container)
    this.fetchImageInfo(this.state.container, this.state.tag)
    RegistryInfo()
      .then(function (response) {
        this.setState({
          registry: response.data,
        })
      }.bind(this))
      .catch(function(response){})
  }

  componentWillReceiveProps(nextProps) {
    const parsedQuery = queryString.parse(nextProps.location.search)
    if(!nextProps.match.params.container_name){
      const filter = (parsedQuery.container_filter !== this.state.container_filter) ? parsedQuery.container_filter : this.state.container_filter
      this.setState({
        container: undefined,
        tag: undefined,
        tags_list: [],
        container_filter: filter,
        containers_loaded: false
      })
      this.fetchContainerList()
    }
  }

  updateList(){
    this.fetchContainerList()
  }
  // end component callbacks

  // API calls
  fetchContainerList(){
    ContainerListAPI(this.state.container_filter)
    .then(function(response){
      this.setState({
        containers: response.data,
        containers_loaded: true,
        main_loaded: true,
        active: true
      })
    }.bind(this))
    .catch(function(response){
      console.log("Error fetching container list")
      console.log(response)
      this.setState({
        containers_loaded: true,
        main_error: response.data.message,
        main_loaded: true,
        error: <div><div>Error loading data from Registry</div><div>status code: {response.status}</div></div>
      })
    }.bind(this))
  }

  fetchTagsList(container=undefined, filter=undefined){
    const f = filter ? filter : this.state.tag_filter
    if(!this.state.container){
      return(null)
    }
    TagsListAPI(container, f)
    .then(function(response){
      const tag = (response.data.length === 1) ? response.data[0] : this.state.tag
      this.setState({
        tags_list: response.data,
        tags_loaded: true,
        main_loaded: true,
        tag: tag
      })
      if(tag){
        this.fetchImageInfo(this.state.container, tag)
        this.props.history.push({
          pathname: ("/containers/" + this.state.container + "/tag/" + tag),
          search: this.props.location.search
        })
      }
    }.bind(this))
    .catch(function(response){
      this.setState({
        tags_loaded: true,
        main_loaded: true,
        container_not_found: ((response.status === 404) ? true : false),
        tags_error: <div><div>Error loading data from Registry</div><div>status code: {response.status}</div></div>
      })
    }.bind(this))
  }

  fetchImageInfo(container=undefined, tag=undefined){
    const c = container ? container : this.state.container
    const t = tag ? tag : this.state.tag
    if(!c){
      return(null)
    }
    if(!t){
      return(null)
    }
    ImageInfoAPI(c, t)
    .then(function(response){
      this.setState({
        image_info: response.data,
        image_info_loaded: true
      })
    }.bind(this)).catch(function(response){
      this.setState({
        image_info_loaded: true,
        image_info_error: <div><div>Error loading data from Registry</div><div>status code: {response.status}</div></div>
      })
    }.bind(this))
  }
  // end API calls

  //filter handling
  handleContainerFilter(event){
    const s = queryString.parse(this.props.location.search)
    if (event.target.value === ""){
      delete s.container_filter
      this.setState({
        containers_loaded: false,
        containers: [],
        container_filter: event.target.value,
        container: undefined,
        image_info: undefined
      })
      this.updateList()
      this.props.history.push({
        pathname: "/containers/",
        search: queryString.stringify(s)
      })

    } else {
      s.container_filter = event.target.value
      this.setState({
        containers_loaded: false,
        containers: [],
        container_filter: event.target.value,
        conatiner: undefined,
        image_info: undefined
      })
      this.updateList()
      this.props.history.push({
        pathname: "/containers/",
        search: queryString.stringify(s)
      })
    }
  }

  handleTagFilter(event){
    const s = queryString.parse(this.props.location.search)
    if (event.target.value === ""){
      delete s.tag_filter
      this.setState({
        tags_loaded: false,
        tags: [],
        tag: undefined,
        tag_filter: event.target.value,
        image_info: undefined
      })
      this.fetchTagsList(this.state.container, event.target.value)
      this.props.history.push({
        pathname: "/containers/" + this.state.container,
        search: queryString.stringify(s)
      })

    } else {
      s.tag_filter = event.target.value
      this.setState({
        tags_loaded: false,
        tags: [],
        tag: undefined,
        tag_filter: event.target.value,
        image_info: undefined
      })
      this.fetchTagsList(this.state.container, event.target.value)
      this.props.history.push({
        pathname: "/containers/" + this.state.container,
        search: queryString.stringify(s)
      })
    }
  }
  //end filter handling


  // Click Handlers
  handleContainerClick(container){
    this.fetchTagsList(container)
    this.setState({
      container: container,
      tags_loaded: false,
      tag_filter: undefined,
      tags_list: [],
      tag: undefined,
      image_info: undefined
    })
    this.props.history.push({
        pathname: "/containers/" + container,
        search: this.props.location.search
      })
  }

  handleTagClick(tag){
    this.setState({
      tag: tag
    })
    this.props.history.push({
        pathname: "/containers/" + this.state.container + "/tag/" + tag,
        search: this.props.location.search
      })
    this.fetchImageInfo(this.state.container, tag)
  }
  // end Click Handlers


  // Renderers
  displayErrors(){
    if(this.state.main_error){
      return(
          <Panel header="Error Loading Page" bsStyle="danger">
            {this.state.main_error}
          </Panel>
        )
    }
  }

  renderTagsList(){
    if(this.state.container){
      return(
          <TagList
            filter={this.state.tag_filter}
            list={this.state.tags_list}
            loaded={this.state.tags_loaded}
            error={this.state.tags_error}
            tag={this.state.tag}
            onClick={(tag) => this.handleTagClick(tag)}
            onFilterChange={(event) => this.handleTagFilter(event)}
          />
        )
    }
  }

  renderPage(){
    if(this.state.container_not_found){
      return(<NotFound/>)
    }
    return(
      <div>
        <Col md={3}>
          <h2>Images</h2>
          <ContainerList
            filter={this.state.container_filter}
            list={this.state.containers}
            loaded={this.state.containers_loaded}
            error={this.state.error}
            container={this.state.container}
            onClick={(container) => this.handleContainerClick(container)}
            onFilterChange={(event) => this.handleContainerFilter(event)}
          />
        </Col>
        <Col md={3}>
          <h2>Tags</h2>
          {this.renderTagsList()}
        </Col>
      </div>
    )
  }

  renderImageInfo(){
    if(!this.state.image_info){
      return("")
    }
    if(this.state.main_loaded){
      return(
        <ImageInfo
          should_render={!this.state.container_not_found}
          loaded={this.state.image_info_loaded}
          error={this.state.image_info_error}
          container={this.state.container}
          tag={this.state.tag}
          info={this.state.image_info}
          public_url={this.state.registry.public_url}
          delete_allowed={this.state.registry.delete_allowed}
          history={this.props.history}
          location={this.props.location}
        />
        )
    }
  }

  renderImageContainer(){
    if(!this.state.container_not_found){
      return(
        <Col md={6} className="col-left-border  ">
        <h2>Information</h2>
          {this.renderImageInfo()}
        </Col>
      )
    }
  }
  // end Renderers

  render() {
    return (
      <Loader loaded={this.state.main_loaded} color="red">
        {this.displayErrors()}
        {this.renderPage()}
        {this.renderImageContainer()}
      </Loader>
    );
  }
}
