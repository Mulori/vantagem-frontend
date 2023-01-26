import axios from "axios";

const apiImgur = axios.create({
  baseURL: "https://api.imgur.com/3",
});

export default apiImgur;