import { View, Text } from "@tarojs/components";
import { Dialog, Image, Toast } from "antd-mobile";
import dayjs from "dayjs";
import _ from "lodash";
import SigninMap from "src/components/SigninMap";
import './index.scss';
import { SigninInfo } from ".";
import Taro from "@tarojs/taro";
import ReactImage from "src/components/ReactImage";

interface Props {
  data: SigninInfo;
  address: string;
  setSigninListDetail: any;
  signinList: Array<SigninInfo>;
  setSigninList: any;
}

export default (props: Props) => {

  const {data, address, setSigninListDetail, signinList, setSigninList} = props;
  return (
    <View className="signin-list-datail">
      {data ? (
        <View className='list-item'>
          <View className="list-item-head">
            <View className="list-item-head-left">
              <View className="list-item-head-left-text-content center">
                <Text>{data.module.label}：</Text>
                <Text className="list-item-head-left-text-name bg">
                  <Text>{data.module.data?.name}</Text>
                  <Text>{data.module.data?.description}</Text>
                  <Text>{data.module.data?.phone}</Text>
                  <Text>{data.module.data?.amount}</Text>
                </Text>
              </View>
              <View className="list-item-head-left-text-content">
                <Text>位置：</Text>
                <Text className="list-item-head-left-text-name webkit-hidden2">{data.address}</Text>
              </View>
              <View className="list-item-head-left-text-content">
                <Text>备注：</Text>
                <Text className="list-item-head-left-text-name webkit-hidden2">{data.remark}</Text>
              </View>
              <View className="list-item-head-left-text-content">
                <Text>签到类型：</Text>
                <Text className="list-item-head-left-text-name webkit-hidden2">{data.type.label}</Text>
              </View>
            </View>
          </View>
          <View className="list-item-content">
            {data.images.map((image, index) => {
              return (
                <ReactImage className="list-item-content-image" images={data.images.map((img) => (img.url))} url={image.url} index={index}/>
                // <Image
                //   key={image.url}
                //   className="list-item-content-image"
                //   fit='cover'
                //   lazy
                //   src={image.url}
                // />
              )
            })}
          </View>
          <SigninMap height={200} location={data.location}/>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text className="list-item-created">签到者：{data?.created_by?.name}</Text>
            <Text className="list-item-time">签到时间：{dayjs(data.time).format('HH:mm:ss')}</Text>
          </View>
          {/* 拜访、询盘、成交、回访：这几种类型有签到、签离） */}
          {!data.signed ? (
            ['pay_a_visit', 'enquiry', 'return_visit', 'deal'].join(',').indexOf(data.type.value) !== -1 ? (
              <View className="signin-btn">
                <Text
                  className="signin-text"
                  onClick={_.throttle(() => {
                    Dialog.confirm({
                      content: '确定签离？',
                      onConfirm: () => {
                        Toast.show({ content: '已签离', position: 'bottom' });
                        const itemInfo = {...data, signed: {time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), address} };
                        const newList = signinList.map((item) => item.id === data.id ? {...itemInfo} : {...item});
                        setSigninList(newList);
                        Taro.setStorage({key: 'signinData', data: newList})
                        setSigninListDetail(undefined);
                      },
                      onCancel: () => {}
                    })
                  }, 5000)}
                >
                  {'签离'}
                </Text>
              </View>
            ) : null
          ) : (
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <Text className="list-item-created">签离时间：{data?.signed?.time}</Text>
              <Text className="list-item-time">签离位置：{data.signed.address}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  )
}