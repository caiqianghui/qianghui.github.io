import { View, Text, ScrollView, Image } from "@tarojs/components";
import { NavBar, Popup, Tag, Toast } from "antd-mobile";
import { EnvironmentOutline } from "antd-mobile-icons";
import dayjs from "dayjs";
import _ from "lodash";
import './index.scss';
import Taro, { getCurrentInstance } from "@tarojs/taro";
import ReactImage from "src/components/ReactImage";
import { useEffect, useState } from "react";
import { getDataById } from "../SignForm/service";
import HttpLoading from "src/utils/http/cloud/HttpLoading";
import ibodor from "src/pages/main/workbench/ibodor";
import copy from "copy-to-clipboard";  

const {signInTypes} = ibodor;

export default () => {
  const signinId = getCurrentInstance().router?.params.signin_id || '';
  const [data, setData] = useState<any>();
  const [data2, setData2] = useState<any>();
  const [textarea, setTextarea] = useState('');

  const [location, setLocation] = useState('');

  const [color, setColor] = useState('');

  const handleCopy = value => { copy(value); Toast.show({content: '已复制'}) }

  const [formatType, setFormatType] = useState('HH:mm:ss');

  const refreshData = () => {
    getDataById('SalesSignIn', signinId).then((res) => {
      // console.log('getDataById', res);
      if (res.code === 200 && res.data) {
        setData(res.data);
        const signInType = signInTypes.find((type) => type.label === res.data.visit_type);
        setColor(signInType ? signInType.color : '#69a794');
        if (('拜访其他客户 拜访询盘客户 拜访B+商机/线索 回访-自己老客户'.indexOf(res.data.visit_type) !== -1)) {
          if (res.data.sales_sign_in_id) {
            getEqData(false, res.data.sales_sign_in_id.id);
          } else {
            getEqData(true, res.data.id);
          }
        }
      }
    })
  };

  // 查找关联签到
  const getEqData = (type, id) => {
    const eq = type ? {
      sales_sign_in_id_eq: id
    } : {
      id_eq: id
    }
    HttpLoading.get('/api/v1/SalesSignIn', {
      params: {
        q: {...eq},
        attachment_fields: {
          '6947625331062734848': 'sign_images'
        }
      }
    }).then((res) => {
      if (res.code=== 200 &&  res.data) {
        setData2(res.data.datas[0]);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (data) {
      if (!isToDay(data.created_at)) {
        setFormatType('M月D日 HH:mm:ss');
      }
      if (data2 && (!isToDay(data.created_at) || !isToDay(data2.created_at))) {
        setFormatType('M月D日 HH:mm:ss');
      }
    }
  }, [data, data2]);

  return (
    <View className="signin-show">
      <NavBar onBack={() => Taro.navigateBack()}>
        <View className="signin-show-navbar">
          {data && 
            <>
              <Text className="signin-show-navbar-title">{data.sign_type}详情</Text>
              <View className="signin-show-navbar-tag">
                <Tag color={color} fill='outline' style={{ '--border-radius': '2px' }}>
                  {data.sign_type}-{data.visit_type}
                </Tag>
              </View>
            </>
          }
        </View>
      </NavBar>
      {data && 
        <View className='signin-show-content'>
          <View className="signin-show-content-bg">
            {data.module_data && 
              <View className="signin-show-content-item row">
                <Text className="signin-show-content-item-title">{data.module_type}：</Text>
                <Text className="signin-show-content-item-content" onClick={() => {
                  let moduleName = '';
                  const id = JSON.parse(data.module_data).id;
                  switch(data.module_type) {
                    case '线索':
                      moduleName = 'Leads';
                      break;
                    case '商机':
                      moduleName = 'Deals';
                      break;
                    case '线索公海':
                      moduleName = 'Public_Leads';
                      break;
                  }
                  if (moduleName && id) {
                    Taro.navigateTo({
                      url: `pages/main/workbench/zoho/show/index?module_name=${moduleName}&zoho_id=${id}`
                    })
                  } else {
                    handleCopy(JSON.parse(data.module_data)?.name);
                  }
                }}>{JSON.parse(data.module_data)?.name}</Text>
              </View>
            }
            <View className="signin-show-content-item row">
              <Text className="signin-show-content-item-title">签到者：</Text>
              <Text className="signin-show-content-item-content" onClick={() => handleCopy(data.creator_id.name)}>{data.creator_id.name}</Text>
              {/* <Image className="signin-show-content-item-icon" onClick={() => handleCopy(JSON.parse(data.module_data)?.name)} src={copyIcon}/> */}
            </View>
            <View className="signin-show-content-item time">
              <Text className="signin-show-content-item-title">签到时间：</Text>
              {data && data2 ? (
                data.sign_type === '签到' ? (
                  <Text>{dayjs(data.created_at).format(formatType)} --- {dayjs(data2.created_at).format(formatType)}</Text>
                ) : (
                  <Text>{dayjs(data2.created_at).format(formatType)} --- {dayjs(data.created_at).format(formatType)}</Text>
                  )
                ) : (
                  <Text>{dayjs(data.created_at).format(formatType)}</Text>
                )}
            </View>
            {data.accompanied_person && 
              <View className="signin-show-content-item">
                <Text className="signin-show-content-item-title">陪访人：</Text>
                <Text>{data.accompanied_person.name}</Text>
              </View>
            }
            {data.sign_remark && 
              <View className="signin-show-content-item" onClick={() => setTextarea(data.sign_remark)}>
                <Text className="signin-show-content-item-title">拜访结果：</Text>
                <Text className="signin-show-content-item-content webkit-hidden2">{data.sign_remark}</Text>
              </View>
            }
            {data2 && data2.sign_remark && 
              <View className="signin-show-content-item" onClick={() => setTextarea(data.sign_remark)}>
                <Text className="signin-show-content-item-title">拜访结果：</Text>
                <Text className="signin-show-content-item-content webkit-hidden2">{data2.sign_remark}</Text>
              </View>
            }
            <View className="signin-show-content-item">
              <Text className="signin-show-content-item-title">{data.sign_type}位置：</Text>
              <Text onClick={() => {
                window.open(`http://uri.amap.com/marker?position=${data.location}&name=${data.address}&coordinate=gaode&callnative=1`);
              }}><EnvironmentOutline fontSize={16} style={{marginRight: '4px'}}/>{data.address}</Text>
            </View>
            <View className="signin-show-content-item">
              <Text className="signin-show-content-item-title">{data.sign_type}照片：</Text>
              <View className="signin-show-content-item-images">
                {data.sign_images.map((image, index) => 
                  <View key={index} className="signin-show-content-item-images-item">
                    <ReactImage
                      className="signin-show-content-item-image"
                      url={image.url}
                      thumb_url={image.thumb_url}
                      index={index}
                      />
                  </View>
                )}
              </View>
            </View>
          </View>
          {data2 && (
            <View className="signin-show-content-bg">
              <View className="signin-show-content-item">
                <Text className="signin-show-content-item-title">{data2.sign_type}位置：</Text>
                <Text onClick={() => {
                  window.open(`http://uri.amap.com/marker?position=${data2.location}&name=${data.address}&coordinate=gaode&callnative=1`);
                }}><EnvironmentOutline fontSize={16} style={{marginRight: '4px'}}/>{data.address}</Text>
              </View>
              <View className="signin-show-content-item">
                <Text className="signin-show-content-item-title">{data2.sign_type}照片：</Text>
                <View className="signin-show-content-item-images">
                  {data2.sign_images.map((image, index) => 
                    <View key={index} className="signin-show-content-item-images-item">
                      <ReactImage
                        className="signin-show-content-item-image"
                        url={image.url}
                        thumb_url={image.thumb_url}
                        index={index}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      }
      <Popup
        visible={!!textarea}
        bodyStyle={{height: '40vh'}}
        onMaskClick={() => setTextarea('')}
      >
       <View className='popup-textarea'>
         <Text style={{fontSize: '14px'}}>{textarea}</Text>
       </View>
     </Popup>
     <Popup
        visible={!!location}
        bodyStyle={{height: '80vh'}}
        onMaskClick={() => setLocation('')}
      >
        {/* {location && 
        <SigninMap location={location.split(',')}/>
        } */}
     </Popup>
    </View>
  )
}

// 当天时间
function isToDay(time: string) {
  return new Date().setHours(0,0,0,0) === new Date(dayjs(time).format('YYYY/MM/DD HH:mm:ss')).setHours(0,0,0,0);
}