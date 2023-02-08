import axios from "axios";

//const api = axios.create({
//  baseURL: "https://vantagem-backend-r48db.ondigitalocean.app",
//});

const api = axios.create({
  baseURL: "http://localhost:2258",
});

export default api;