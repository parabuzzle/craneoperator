import axios from 'axios';

const url = "/api/containers/"

export default function ImageInfoAPI(container, tag){
  const containerUrl = url + container + "/" + tag
  return axios.get(containerUrl)
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + containerUrl + " (Code: " + response.status + ")");
      throw(response)
    });
}
