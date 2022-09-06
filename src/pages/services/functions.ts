import HttpClient from "src/utils/http/zoho/HttpClient";
import HttpLoading from "src/utils/http/zoho/HttpLoading";
import { getZOHOtoken } from "src/utils/utils";

const token = 'Bearer NYbImmWjVdyN8Dh8PPq4XqVuKNCNWcp5dCDa8o2Xtyg';

const FUN_URL = '/api/v1/functions/forward_request/callback'

export default class NetCloudFun {

  /**
   * 
   * @param url 
   * @param params 
   * @returns 
   */
  static async get(url: string, params?: any, headers?: any) {
    const cToken = await getZOHOtoken();
    if (cToken) {
      return HttpClient.post(FUN_URL, {
        method: 'GET',
        url: process.env.ZOHO_URL + url,
        access_token: cToken,
        payload: params,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          ...headers,
        }
      })
    } else {
      return {
        data: null,
        info: null
      }
    }
  }

  static async post(url: string, params?: any) {
    const cToken = await getZOHOtoken();
    if (cToken) {
      return HttpLoading.post(FUN_URL, {
        method: 'POST',
        url: process.env.ZOHO_URL + url,
        access_token: cToken,
        payload: params,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
    } else {
      return {
        data: null,
        info: null
      }
    }
  }

  static async delete(url: string, params?: any) {
    const cToken = await getZOHOtoken();
    if (cToken) {
      return HttpClient.post(FUN_URL, {
        method: 'DELETE',
        url: process.env.ZOHO_URL + url,
        access_token: cToken,
        payload: params,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
    } else {
      return {
        data: null,
        info: null
      }
    }
  }

  static async put(url: string, params?: any) {
    const cToken = await getZOHOtoken();
    if (cToken) {
      return HttpLoading.post(FUN_URL, {
        method: 'PUT',
        url: process.env.ZOHO_URL + url,
        access_token: cToken,
        payload: params,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
    } else {
      return {
        data: null,
        info: null
      }
    }
  }
  
}

