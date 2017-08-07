import axios from 'axios';

const url = "/api/login"

export default function Login(username, password){
  return axios.post(url, {username: username, password: password})
    .then(function (response) {
      return(response)
    })
    .catch(function (response) {
      console.log("Error calling api at: " + url + " (Code: " + response.status + ")");
      throw(response)
    });
}

