import { message } from 'antd';
import Taro from '@tarojs/taro';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import http, {ResponseData} from './http';

window
declare const window: Window & { ReactNativeWebView: any, WVJBCallbacks: any };

export class AntNetError<T> extends Error {
  data?: ResponseData<T>;
}

export default class HttpClient {
  /**
   * 解析网络请求的返回结果
   * @param res 网络访问的返回值
   */
  static parseResponse<T>(
    res: AxiosResponse<ResponseData<T>>,
  ): ResponseData<T> | Promise<ResponseData<T>> {
    console.log('parseResponse', res);
    const data: ResponseData<T> = res.data;
    if (res.status === 201) {
      return data;
    }
    return Promise.reject(data);
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
      .then((res) => HttpClient.parseResponse<T>(res));
  }
}
