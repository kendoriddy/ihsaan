import axios from "axios";

// Axios baseURL
const baseurl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROD,
});

export { baseurl };
