import { message } from 'antd';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import http, {ResponseData} from './http';

export class AntNetError<T> extends Error {
  data?: ResponseData<T>;
}

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export default class HttpClient {
  /**
   * 解析网络请求的返回结果
   * @param res 网络访问的返回值
   */
  static parseResponse<T>(
    res: AxiosResponse<ResponseData<T>>,
  ): ResponseData<T> | Promise<ResponseData<T>> {
    const data: ResponseData<T> = res.data;
    console.log('data', data);
    if (data.code === 200) {
      return data;
    } else {
      data.tips = data.tips || data?.error || codeMessage[data.code];
      data.tips && message.error(data.tips);
      return data;
    }
  }

  /**
   * 发起http get请求
   * @param url 请求连接
   * @param config 请求配置
   */
  static get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return http
      .get(url, config)
      .then((res) => HttpClient.parseResponse<T>(res));
  }

  /**
   * 发起http get请求
   * @param url 请求连接
   * @param config 请求配置
   */
  static put<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
    return http.put(url, data).then((res) => HttpClient.parseResponse<T>(res));
  }


  /**
   * 发起http delete请求
   * @param url 请求连接
   * @param config 请求配置
   */
   static delete<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
    // console.log(url, data);
    return http
      .delete(url, data)
      .then((res) => HttpClient.parseResponse<T>(res));
  }


  /**
   * 发起http post请求
   * @param url 请求连接
   * @param data 请求参数
   * @param config 请求配置
   */
  static post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return http
      .post(url, data, config)
      .then((res) => HttpClient.parseResponse<T>(res))
  }
}
