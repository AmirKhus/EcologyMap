import axios from "axios";

// base url
const locaclhost = "8000";
const instance = axios.create({
  baseURL: `http://localhost:${locaclhost}`,
});

export default instance;
