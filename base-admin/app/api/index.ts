import axios, { type AxiosInstance } from "axios"
import { getCookie } from "~/utils/cookies";

class AxiosConnection {
    api: AxiosInstance;

    constructor(api?: string) {
        this.api = axios.create({
            baseURL: api || ((import.meta as any).env?.VITE_API_BASE_URL)
        });
        this.api.interceptors.request.use((config) => {
            const authToken = getCookie("authToken");
            if (authToken) {
                config.headers = config.headers || {};
                config.headers["Authorization"] = `Bearer ${authToken}`;
            }
            return config;
        });
    }

}

export default new AxiosConnection()