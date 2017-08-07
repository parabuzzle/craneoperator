import axios from 'axios';

const url = "/api/tags/"

export default function ContainerListAPI(container, filter=undefined){
  const params = {}

  const tagUrl = url + container

  if(filter){
    params.filter = filter
  }
  return axios.get(tagUrl, {params: params})
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + tagUrl + " (Code: " + response.status + ")");
      throw(response)
    });
}
