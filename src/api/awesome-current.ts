import axios from "axios";

const current = axios.create({
  baseURL: "https://economia.awesomeapi.com.br/",
});

export default current;
