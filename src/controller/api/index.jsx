import axios from "axios";

const api = axios.create({
  baseURL: "https://vantagem-backend-r48db.ondigitalocean.app",
});

export default api;