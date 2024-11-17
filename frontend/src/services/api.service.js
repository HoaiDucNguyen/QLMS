import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default (baseURL) => {
  return axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + baseURL,
    ...commonConfig,
    withCredentials: true
  });
};
