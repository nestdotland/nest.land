import axios from "axios";

export const HTTP = axios.create({
  baseURL: window.location.href.split("#")[0] + "api/",
  headers: {
    // Authorization: 'Bearer {token}'
  },
});
