import axios from "axios";

import { BASE_URL, Strings } from "@/constants";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    responseType: Strings.json,
});

export default axiosClient;
