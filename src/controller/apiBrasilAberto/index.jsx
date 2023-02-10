import axios from "axios";

const apiBrasilAberto = axios.create({
  baseURL: "https://brasilaberto.com",
});

export default apiBrasilAberto;