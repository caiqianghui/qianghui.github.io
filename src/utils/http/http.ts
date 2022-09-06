import axios, {AxiosRequestConfig} from 'axios';

export interface ResponseData<T> {
  data: T;
  info?: any;
}

const http = axios.create({
  baseURL: process.env.CLOUD_URL,
  timeout: 30 * 1000,
});

http.interceptors.request.use(
  function (config: any): Promise<AxiosRequestConfig> {
    return new Promise<AxiosRequestConfig>(async function (resolve) {
      resolve(config);
    });
  },
  (error: any): any => {
    return Promise.reject(error);
  },
);

export default http;
