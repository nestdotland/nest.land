import axios from "axios";

export const HTTP = axios.create({
  baseURL: "/api/",
  headers: {
    // Authorization: 'Bearer {token}'
  },
});
