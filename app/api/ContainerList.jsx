import axios from 'axios';

const url = "/api/containers"

export default function ContainerList(){
  return axios.get(url)
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + url + " (Code: " + response.status + ")");
      throw(response)
    });
}
