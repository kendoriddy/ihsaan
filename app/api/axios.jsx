import axios from "axios";

export const Api = axios.create({
    baseURL:'https://ihsaanlms.onrender.com/assessment'
})