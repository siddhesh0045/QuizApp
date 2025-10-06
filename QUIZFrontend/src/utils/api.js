

///changing for the httponly
// src/utils/api.js
import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api", // your backend for dev
  baseURL: "https://quizapp-xjhl.onrender.com/api", // for production
  withCredentials: true, // crucial: sends cookies with requests
});

export default api;
