import axios, { AxiosRequestConfig } from "axios";

interface IRequestConfig extends AxiosRequestConfig {
  credentials?: any; // @TODO: define type for credentials
}

/**
 * @description setup axios defaults
 */
const client = axios.create({
  baseURL: "https://randomuser.me/api", //process.env.REACT_APP_API_BASE_URL,
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
});

/**
 * @description called before every API request
 */
client.interceptors.request.use(
  (config) => {
    const { credentials, headers }: IRequestConfig = config;
    // if authed add auth token to header
    if (credentials) {
      return {
        ...config,
        headers: {
          ...headers,
          Authorization: `Bearer ${credentials.access_token}`,
        },
      };
    }

    // return config passed in
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
