import HttpClient from './HttpClient';
import {AxiosRequestConfig} from 'axios';
import {ResponseData} from './http';
import Taro from '@tarojs/taro';

export default class HttpLoading {
  /**
   * 发起get请求，会自动弹出加载框以及错误信息
   * @param url 请求连接
   * @param config 请求配置
   */
  static get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    Taro.showLoading();
    return HttpClient.get(url, config)
      .then((res) => {
        Taro.hideLoading();
        return res;
      })
      .catch((e) => {
        Taro.hideLoading();
        return Promise.reject(e);
      });
  }

  /**
   * 发起get请求，会自动弹出加载框以及错误信息
   * @param url 请求连接
   * @param config 请求配置
   */
  static put<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    Taro.showLoading();
    return HttpClient.put(url, config)
      .then((res) => {
        Taro.hideLoading();
        return res;
      })
      .catch((e) => {
        Taro.hideLoading();
        return Promise.reject(e);
      });
  }

  /**
   * 发起post请求，会自动弹出加载框以及错误信息
   * @param url 请求连接
   * @param data 请求参数
   * @param config 请求配置
   */
  static post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    Taro.showLoading();
    return HttpClient.post(url, data, config)
      .then((res) => {
        Taro.hideLoading();
        console.log('HttpLoading.posr-then', res);
        return Promise.resolve(res);
      })
      .catch((e) => {
        console.log('post', e);
        Taro.hideLoading();
        return Promise.reject(e);
      });
  }
}
