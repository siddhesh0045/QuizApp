// // src/utils/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // replace with your backend URL
// });

// // Automatically attach JWT token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Optional: handle 401 globally
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;




///changing for the httponly
// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend
  withCredentials: true, // crucial: sends cookies with requests
});

export default api;
