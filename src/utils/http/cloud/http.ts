import axios, {AxiosRequestConfig} from 'axios';
import { getCloudToken } from 'src/utils/utils';

export interface ResponseData<T> {
  code: string | number;
  data: any;
  tips?: string;
  error?: any;
}

const http = axios.create({
  baseURL: process.env.CLOUD_URL,
  timeout: 30 * 1000,
});

http.interceptors.request.use(
  function (config: any): Promise<AxiosRequestConfig> {
    return new Promise<AxiosRequestConfig>(async function (resolve) {
      if (config.url) {
        console.log(config.url);
        if (config.url !== '/api/v1/functions/single_sign_on/execute' && config.url !== '/oauth/token') {
          const cToken = await getCloudToken();
          console.log('cToken', cToken);
          if (cToken) {
            const headers = {
              Accept: 'application/json',
              Authorization: cToken,
            };
            config.headers = headers;
          }
        }
      }
      resolve(config);
    });
  },
  (error: any): any => {
    return Promise.reject(error);
  },
);

export default http;
