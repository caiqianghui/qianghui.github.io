import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Tag } from "antd-mobile";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import './styles.scss';
import ibodor from "src/pages/main/workbench/ibodor";

interface Props {
  data: any;
  className?: string;
  onClick?: () => void;
}

const {signInTypes} = ibodor;
export default (props: Props) => {

  const {data, className, onClick} = props;

  const [color, setColor] = useState('');

  const [time, setTime] = useState('');

  useEffect(() => {
    if (data.visit_type) {
      const currentType = signInTypes.find((item) => item.label === data.visit_type);
      setColor(currentType ? currentType.color : '#69a794');
    }
    if (data.created_at) {
      setTime(isToDay(new Date(), data.created_at) ? dayjs(data.created_at).format('HH:mm:ss') : data.created_at);
    }
  }, []);

  return (
    <View className={`sign-list-item ${className}`} style={{background: data?.active ? 'rgba(247, 247, 248)' : '#fff'}}>
      {data ? (
        <View className="item-box" onClick={() => {
          Taro.navigateTo({url: `pages/main/workbench/cloud/signin/show/index?signin_id=${data.id}`});
          onClick && onClick();
        }}>
          <Text className="item-created_at" style={{fontSize: '18px', margin: '4px 0'}}>{data.sign_type}时间：{time}</Text>
          <View className="item-box-top">
            <View className="item-top-left">
              {(data.module_type && data.module_data) && <Text className="item-module_data webkit-hidden1">{data.module_type}: {data.module_data && JSON.parse(data.module_data).name}</Text>}
              <Text>{data.sign_type}者: {data.owner_id && data.owner_id.name}</Text>
            </View>
            <View className="item-top-right">
              <Tag color={color} fill='outline' style={{ '--border-radius': '2px' }}>
                {data.sign_type} - {data.visit_type}
              </Tag>
            </View>
          </View>
          {data.sign_remark && <Text className="item-remark webkit-hidden2">拜访结果： {data.sign_remark}</Text>}
          {data.accompanied_person && <Text className="item-remark webkit-hidden2">陪访人： {data.accompanied_person.name}</Text>}
          <Text className="item-address">位置： {data.address}</Text>
          <View className="item-images">
            {data.sign_images.slice(0, 3).map((image) => {
              return (
                <Image className="item-images-img" src={image.thumb_url} key={image.id}/>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  )
}

// 当天时间
function isToDay(today: Date, time: string) {
  return today.setHours(0,0,0,0) === new Date(dayjs(time).format('YYYY/MM/DD HH:mm:ss')).setHours(0,0,0,0);
}