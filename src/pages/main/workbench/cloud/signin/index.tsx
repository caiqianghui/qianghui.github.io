import { View, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {  NavBar, Popup, Steps, DotLoading, Popover } from "antd-mobile";
import {EnvironmentOutline, MoreOutline, DownOutline, UpOutline, CloseOutline} from 'antd-mobile-icons'
import { Step } from "antd-mobile/es/components/steps/step";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import SigninMap from "src/components/SigninMap";
import CurrentPosition from "src/utils/getCurrentPosition";
import './index.scss';
import React from "react";
import { message } from "antd";
import HttpClient from "src/utils/http/cloud/HttpClient";
import SignForm from "./SignForm";
import ListItem from "src/components/ListItem";

// 地址组成部分
interface AddressComponent {
  adcode: string,
  // 建筑物
  building: {
    name: Array<any>, type: Array<any>
  },
  // 业务领域
  businessAreas: Array<{
    // 坐标
    location: string,
    // 名称
    name: string,
    id: string,
  }>,
  // 市
  city: string,
  // 城市代码
  citycode: string,
  // 国家
  country: string,
  // 地区
  district: string,
  // 周边
  neighborhood: {
    name: Array<any>, type: Array<any>
  },
  // 省
  province: string,
  // 街道号码
  streetNumber: {
    // 门牌号
    number: string,
    // 坐标
    location: string,
    // 方向
    direction: string,
    // 距离
    distance: string,
    // 街道
    street: string,
  },
  // 镇码
  towncode: string,
  // 乡镇
  township: string,
}

// 地址数据类型
interface AddressData {
  // 格式化的详细地址
  formatted_address: string,
  // 地址组成部分
  addressComponent: AddressComponent,
  // 定位日期
  time: Date,
  surroundingPois?: Array<{
    address: string,
    city: string,
    phoneNumber?: number | string,
    point: {lng: number, lat: number},
    postcode?: number | string
    tags: Array<string>,
    title: string,
    type: number,
    uid: string,
    _poiType: string,
  }>,
}

// 刷新位置时长5分钟
const refreshPositionTime = 60 * 5;

const SignIn = ({time}) => {

  // 当前存储位置信息
  const [address, setAddress] = useState<AddressData>();

  const [addressVisible, setAddressVisible] = useState(false);
  
  const [refreshText, setRefReshText] = useState('重新定位');

  // 地图坐标
  const [location, setLocation] = useState<Array<number>>([]);
  // 高德地图ref
  const [refMap, setRefMap] = useState<any>();

  // 签到数据
  const [datas, setDatas] = useState<Array<any>>();

  // 控制显示签到表单页面
  const [visible, setVisible] = useState(false);

  // 地图显隐
  const [showMap, setShowMap] = useState(false);

  // 是签到 还是签离
  const [isSignin, setIsSignin] = useState(true);

  // 当前最新数据
  const [data, setData] = useState<any>();

  // 当前用户
  const [user, setUser] = useState<any>();

  // 签到基础数据
  const [signValues, setSignValues] = useState({
    sign_type: '',
    address: '',
    location: '',
  });

  // 定位错误信息
  const [geocodeError, setGeocodeError] = useState('');

  const [isBaidu, setIsBaidu] = useState(false);

  // 定位loading
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  // 是否销毁表单
  const [destroyOnClose, setDestroyOnClose] = useState(false);

  const [signNum, setSignNum] = useState(1);

  useEffect(() => {
    getGeocodeRegeo();
    const cloudCurrentUser = Taro.getStorageSync('cloudCurrentUser');
    if (cloudCurrentUser) {
      setUser(cloudCurrentUser);
      getDatas(cloudCurrentUser.id)
    }

    // watchPostion();

    return () => {
      // clearPosition();
    }
  }, []);


  const watchPostion = () => {
    navigator.geolocation.watchPosition((res) => {
      console.log('监视当前用户地理位置信息', res);
    })
  }
  
  const clearPosition = () => {
    navigator.geolocation.clearWatch
  }

  // 获取签到数据列表
  const getDatas = (id) => {
    HttpClient.get('/api/v1/SalesSignIn', {
      params: {
        q: {'owner_id_eq': id},
        attachment_fields: {
          '6947625331062734848': 'sign_images'
        }
      }
      }).then((res) => {
      if (res.code === 200 && res.data) {
        const datas = res.data.datas;
        const currentData = datas[0];
        if (currentData) {
          setData({
            ...currentData,
            creator_id: null,
            owner_id: null,
            updated_at: null,
            created_at: null,
            sign_type: null,
            address: null,
            location: null,
            sign_remark: null,
          });
          setIsSignin(!('拜访其他客户 拜访询盘客户 拜访B+商机/线索 回访-自己老客户'.indexOf(currentData.visit_type) !== -1 && currentData.sign_type === '签到'));
        }
        setDatas(datas || {});
      }
    }).catch((err) => {
      message.error(err.tips)
    })
    
  }

  // 获取百度定位地址
  const getBmapgl = () => {
    const BMapGL = (window as any).BMapGL;
    const BMapGeolocation = new BMapGL.Geolocation();
    BMapGeolocation.enableSDKLocation();
    // 获取坐标
    BMapGeolocation.getCurrentPosition((result) => {
      console.log('BMapGeolocation', result);
      if (result && result?.latitude && result?.longitude) {
        var y = result.latitude;
        var x = result.longitude;
        var ggPoint = new BMapGL.Point(x,y);
        var geoc = new BMapGL.Geocoder();
        // 坐标逆判断定位
        geoc.getLocation(ggPoint, (res) =>{
          console.log('百度逆地理转换', res);
          // CurrentPosition.getGeocodeRegeo(res.point.lng + ',' + res.point.lat, 'baidu').then((result: any) => {
          //   setGeocodeLoading(false);
          //   setAddress({
          //     ...result,
          //     time: new Date(),
          //   });
          //   if (refMap) {
          //     refMap.setFitView(null, false, [150, 60, 100, 60]);
          //   }
          //   setIsBaidu(true);
          //   setLocation(result.addressComponent.streetNumber.location.split(','));
          //   setSignValues({...signValues, address: result.formatted_address || '未获取位置', location: result.addressComponent.streetNumber.location || ''});
          //   setGeocodeError('');
          // })
          setAddress({
            ...res,
            formatted_address: res.address,
            addressComponent: {
              ...res.addressComponents,
              streetNumber: {
                number: res.addressComponents.streetNumber,
                street: res.addressComponents.street,
                location: res.point.lng + ',' + res.point.lat,
              }
            },
            time: new Date(),
          });
          setLocation([res.point.lng, res.point.lat]);
          setIsBaidu(true);
          setSignValues({...signValues, address: res.address || '', location: res.point.lng + ',' + res.point.lat || ''});
          setGeocodeLoading(false);
          setGeocodeError('');
          if (refMap) {
            refMap.setFitView(null, false, [150, 60, 100, 60]);
          }
        })
      }
    });
  }

  // 获取位置信息
  const getGeocodeRegeo = _.throttle(() => {
    if (geocodeLoading) return;
    setDestroyOnClose(true);
    setGeocodeLoading(true);
    setIsBaidu(false);
    CurrentPosition.getCurrentPosition().then((res: any) => {
      setAddress({
        ...res,
        time: new Date(),
      });
      if (refMap) {
        refMap.setFitView(null, false, [150, 60, 100, 60]);
      }
      setLocation(res.addressComponent.streetNumber.location.split(','));
      setSignValues({...signValues, address: res.formatted_address || '未获取位置', location: res.addressComponent.streetNumber.location || ''});
      setGeocodeError('');
      setGeocodeLoading(false);
      setSignNum(1);
    }).catch((e) => {
      console.log(e);
      if (e && e.error_code) {
        if (signNum === 5 || e.error_code === '位置获取失败, 请重新定位') {
          message.warn('正在切换定位服务');
          getBmapgl();
          setSignNum(1);
        } else {
          setSignNum(signNum + 1);
          setGeocodeError(e.error_code);
          setSignValues({...signValues, address: '', location: ''});
          setAddress(undefined);
          setGeocodeLoading(false);
        }
      } else {
        message.warn('正在切换定位服务');
        getBmapgl();
        setSignNum(1);
      }
    });
  }, 5000);

  // 签到数据渲染
  const renderdatas = () => {
    return datas && datas.length ? (
      <ScrollView scrollY={true} onScroll={() => setAddressVisible(false)}>
        <Steps direction='vertical' className="list-content">
        {/* 只显示当天的日期 */}
        {datas.filter((item) => isToDay(new Date(), item.created_at)).map((item) => {
          return (
            <Step key={item.id} title={<ListItem className="list-item-shadow " data={item}/>} status='process' />
          )
        })}
      </Steps>
      </ScrollView>
    ) : null
  }

  // 签到按钮
  const onSignin = () => {
    if (signValues.address && address && !geocodeLoading && datas) {
      setAddressVisible(false);
      // 地址定位时间
      const addressTime = address.time;

      if (dayjs().unix() - dayjs(addressTime).unix() > refreshPositionTime) {
        setRefReshText('刷新定位');
        message.warn('位置信息过期, 请刷新定位');
        return;
      }
      if (isSignin) {
        setSignValues({...signValues, sign_type: '签到'});
      } else {
        setSignValues({...signValues, sign_type: '签离'});
      }
      setVisible(true);
    }
  }

  // 顶部右侧更多按钮
  const onMore = () => {
    Taro.navigateTo({url: `pages/main/workbench/cloud/signin/list/index`});
  }

  return (
    <View className="signin">
      <NavBar right={<MoreOutline fontSize={24} onClick={onMore}/>} onBack={() => Taro.navigateBack()}>签到</NavBar>
      <View className="map-content">
        {showMap ? (
          <SigninMap height={200} setRefMap={setRefMap} refMap={refMap} location={location} errorText={geocodeError}/>
        ) : null}
        {showMap ? <UpOutline onClick={() => setShowMap(false)}/> : <DownOutline onClick={() => setShowMap(true)}/>}
      </View>        
      <View className="container">
        <View style={{padding: '0 20px'}}>
          <View className="main-content">
            <Text className="time">{time}</Text>
            <View className={datas && signValues.address && !geocodeLoading ? 'signin-btn' : 'signin-btn signin-btn-hover '} onClick={onSignin}>
              <Text className="signin-text">{isSignin ? '签到' : '签离'}</Text>
            </View>
            <View className="address-content">
              {address?.surroundingPois && address.surroundingPois.length ? (
                <Popover
                  visible={addressVisible}
                  content={
                    <View style={{display: 'flex', flexDirection: 'column', width: '240px'}}>
                      {address.surroundingPois.map((item, index) => {
                        return (
                          <Text style={signValues.address  === item.address ? {padding: '10px 0 10px 10px', borderBottom: '1px solid #f2f2f2', background: '#f2f2f2'} : {padding: '10px 0 10px 10px', borderBottom: '1px solid #f2f2f2'} } key={index} onClick={() => {
                            setDestroyOnClose(true);
                            setAddress({
                              ...address,
                              formatted_address: item.address,
                            });
                            setSignValues({
                              ...signValues,
                              address: item.address,
                              location: item.point.lng + ',' +  item.point.lat,
                            });
                            setLocation([item.point.lng, item.point.lat]);
                            setAddressVisible(false);
                            if (refMap) {
                              refMap.setFitView(null, false, [150, 60, 100, 60]);
                            }
                          }}>{item.address}</Text>
                        )
                      })}
                    </View>
                  }
                  placement='bottom-start'
                  trigger='click'
                >
                  <Text
                    className="address"
                    onClick={() => {
                      setAddressVisible(v => !v);
                    }}>
                      <EnvironmentOutline className="icon"/>
                      {geocodeLoading ? (
                        <Text><DotLoading />获取定位中</Text>
                      ) : (
                        <Text>{signValues.address || geocodeError}</Text>
                      )}
                    </Text>
                </Popover>
              ) : (
                <Text
                  className={geocodeError ? "address geocodeError" : "address"}>
                    <EnvironmentOutline className="icon"/>
                    {geocodeLoading ? (
                      <Text><DotLoading />获取定位中</Text>
                    ) : (
                      <Text>{signValues.address || geocodeError}</Text>
                    )}
                  </Text>
              )}
              <View className="relocation" hoverClass="relocation-hover">
                <Text onClick={getGeocodeRegeo}>{refreshText}</Text>
              </View>
            </View>
            {isBaidu ? <Text style={{width: '100%', marginTop: '10px', marginLeft: '10px', color: '#ff8f18'}}>请确定当前位置是否准确</Text> : null}
          </View>
        </View>
        {renderdatas()}
      </View>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
          setDestroyOnClose(false);
        }}
        bodyStyle={{height: '80vh'}}
        destroyOnClose={destroyOnClose}
      >
          <View className="signin-popup">
            <Text className="signin-popup-title" onClick={() => Taro.removeStorage({key: 'signinData'})}>{signValues.sign_type}信息</Text>
            <CloseOutline fontSize={20} className='popup-close' onClick={() => setVisible(false)}/>
            <SignForm signValues={!isSignin ? {...data, ...signValues} : {...signValues}} address={address} module="SalesSignIn" onSubmit={(e) => {
              if (e === 'success' && user) {
                getDatas(user.id);
                setVisible(false);
                setDestroyOnClose(true);
              }
            }}/>
        </View>
      </Popup>
    </View>
  )
}

class Index extends React.Component {

  state = {
    time: '',
  }

  interval = setInterval(() => {
    this.setState({
      time: showTime()
    })
  }, 1000);
  

  componentDidMount() {
    this.interval;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render(): React.ReactNode {
    return <SignIn time={this.state.time}/>
  }
}

export default Index;

function showTime () {
  var d = new Date();

  var hour = doubleNum(d.getHours());
  var min = doubleNum(d.getMinutes());
  var sec = doubleNum(d.getSeconds());

  var str = hour + ":" + min + ":" + sec;
  return str;
}

function doubleNum(n){
  if(n < 10){
      return "0" + n;
  }else{
      return n;
  }
}

// 当天时间
function isToDay(today: Date, time: string) {
  return today.setHours(0,0,0,0) === new Date(dayjs(time).format('YYYY/MM/DD HH:mm:ss')).setHours(0,0,0,0);
}