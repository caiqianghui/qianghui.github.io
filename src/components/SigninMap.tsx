import { View, Text } from '@tarojs/components'
import _ from 'lodash'

import { Map, APILoader, Marker, Circle, Geolocation } from '@uiw/react-amap';
import CurrentPosition from 'src/utils/getCurrentPosition';
import { useEffect, useState } from 'react';

const akay = '83831a7f5618d984b92d703726d4c407';

interface Props {
  location: Array<number>;
  setRefMap?: any;
  refMap?: any;
  height?: number;
  errorText?: string;
}

export default (props: Props) => {
  const {setRefMap, refMap, height, errorText} = props;

  const getGeocodeRegeo = (x, y) => {
    console.log(x, y);
    CurrentPosition.getGeocodeRegeo(x, y).then((res: any) => {
      // console.log(res);
      // if (res.addressComponent) {
      //   setlocation(res.addressComponent.streetNumber.location);
      // }
    })
  }

  useEffect(() => {
    setlocation(props?.location || []);
  }, [props]);

  const [data, setData] = useState<any>();

  const [location, setlocation] = useState<Array<Number>>([]);

  return (
    <View style={{width: '100%', height: (height || 200) + 'px', overflow: 'hidden'}}>
      <View style={{ width: '100%', height: (height || 200) + 20 + 'px'}}>
        {location.length ? (
          <APILoader akay={akay}>
          <Map
            // dragEnable={false}
            zoom={14} 
            ref={(instance) => {
              if (instance && instance.map && !refMap) {
                setRefMap && setRefMap(instance.map);
              }
            }}
            center={location}
            onClick={(e) => {
              // getGeocodeRegeo(e.lnglat.lng, e.lnglat.lat);
            }}
          >
            {/* <Geolocation
              // 是否使用高精度定位，默认:true
              enableHighAccuracy={true}
              // 超过10秒后停止定位，默认：5s
              timeout={10000}
              convert={true}
              // 定位按钮的停靠位置
              // 官方 v2 不再支持
              // buttonPosition="RB"

              // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              // 官方 v2 不再支持
              // 定位成功后是否自动调整地图视野到定位点
              onComplete={(data) => {
                console.log('返回数据：', data);
                getGeocodeRegeo(data.position.lng, data.position.lat);
                setData(data);
              }}
              onError={(data) => {
                console.log('错误返回数据：', data);
                setData(data);
              }}
            /> */}
            <Marker visiable position={location} />
            <Circle visiable={!!location} radius={200} strokeColor="#fff" strokeWeight={2} center={location}/>
          </Map>
        </APILoader>
        ) : (
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Text>{errorText || '位置获取失败'}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
