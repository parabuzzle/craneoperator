import axios from 'axios';

const url = "/api/containers/"

export default function DeleteTagAPI(container, tag){
  const u = url + container + "/" + tag
  return axios.delete(u)
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + u + " (Code: " + response.status + ")");
      throw(response)
    });
}
