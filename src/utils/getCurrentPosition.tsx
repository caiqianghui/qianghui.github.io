import axios from "axios";
import { Toast } from 'antd-mobile';

const KEY = 'da9e76ae1694de81eea019801e4b8e7a';
const AMAP_URL = 'https://restapi.amap.com/v3/';

export default class CurrentPosition {

  /**
   * 坐标转换
   * @returns {longitude: string, latitude: string}
   */
  static getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
          // console.log('getCurrentPosition', location.coords);
          const locations = `${location.coords.longitude},${location.coords.latitude}`
          this.getGeocodeRegeo(locations).then((res) => {
            resolve(res);
          });
        }, (error) => {
          let error_code: string = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              // 用户拒绝了地理定位的请求
              error_code="未开启位置服务, 请在设置应用里授权位置"
              break;
            case error.POSITION_UNAVAILABLE:
              error_code="位置信息不可用, 请在设置应用里授权位置"
              break;
            case error.TIMEOUT:
              // 超时
              error_code="位置获取失败, 请重新定位"
              break;
          }
          reject({...error, error_code});
        }, ({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 75000
          }));
      } else {
        reject();
        Toast.show({
          icon: 'fail',
          content: <span style={{textAlign: 'center'}}>位置获取失败，请检查改app是否开启位置权限</span>,
          duration: 5000,          
        });
      }
    });
  }
  
  // 坐标转换 转换为高德坐标
  static getLongitudeAndLatitude = (locations: string, coordsys: string) => {
    return new Promise<any>((resolve, reject) => {
      axios.get(AMAP_URL + 'assistant/coordinate/convert', {
        params: {
          key: KEY,
          locations,
          coordsys,
        }
      }).then((res) => {
        if (res.status === 200 && res.data.status === '1') {
          resolve(res.data.locations);
        } else {
          reject({
            error_code: '位置获取失败, 请重新定位'
          });
        }
      }).catch((_err) => {
        reject({
          error_code: '位置获取失败, 请重新定位'
        });
      })
    })
  }

  /**
   * 逆地理编码
   * @param longitude  经度
   * @param latitude 纬度
   * @param coordsys 转码格式
   * @returns 
   */
  static getGeocodeRegeo = (locations: string, coordsys = 'gps') => {
    return new Promise((resolve, reject) => {
      this.getLongitudeAndLatitude(locations, coordsys).then((location) => {
        axios.get(AMAP_URL + 'geocode/regeo?parameters', {
          params: {
            key: KEY,
            location
          }
        }).then((res) => {
          if (res.status === 200 && res.data.status === '1') {
            resolve(res.data.regeocode);
          } else {
            reject({
              error_code: '位置获取失败, 请重新定位'
            });
          }
        }).catch((_err) => {
          reject({
            error_code: '位置获取失败, 请重新定位'
          });
        })
      }).catch((_err) => {
        reject({
          error_code: '位置获取失败, 请重新定位'
        });
      })
    })
  }
}
