import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const BASE_URL = `http://localhost:8000`;



function getAccessToken() {
  const storage = JSON.parse(localStorage.getItem("persist:root"))
  const currentUser =  storage ? JSON.parse(storage.currentUser) : null;
  return currentUser ? currentUser?.accessToken : null
}


export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  //headers: { token: `Bearer ${TOKEN}`},
});

userRequest.interceptors.request.use(config => {
  const newToken = getAccessToken();
  if (newToken) {
    config.headers.token = `Bearer ${newToken}`;
  }
  return config;
});