import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
    // baseURL: "https://piggy-tracker.miskinbanget.eu.org", // prod
    baseURL: "http://localhost:8000", // dev
    withCredentials: true,
});

export default api;
