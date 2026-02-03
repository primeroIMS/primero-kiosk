import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    responseType: "json",
});

export default axiosClient;
