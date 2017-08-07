import axios from 'axios';

const url = "/api/containers"

export default function ContainerListAPI(filter=null){
  const params = {}
  if(filter){
    params.filter = filter
  }
  return axios.get(url, {params: params})
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + url + " (Code: " + response.status + ")");
      throw(response)
    });
}
