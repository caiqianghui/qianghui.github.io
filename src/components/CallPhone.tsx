import { ActionSheet, Button, Dialog, Input, Mask, Modal } from "antd-mobile"
import dayjs from "dayjs"
import { PhoneFill } from 'antd-mobile-icons'
import { View, Text, ViewProps } from "@tarojs/components"
import NetCloudFun from "src/pages/services/functions"
import { message } from "antd"
import { useEffect, useState } from "react"
import './styles.scss';
import Taro from "@tarojs/taro"

interface Props extends ViewProps {
  phone: string;
  name?: string;
  data?: any;
  module_name?: string;
  color?: string;
  onChange?: (e: string) => void;
}

const formatType = 'YYYY-MM-DDTHH:mm:ss';

export default (props: Props) => {

  const {module_name, data, phone, name, color, onChange} = props;

  const [value, setValue] = useState('');
  const [visible, setvisible] = useState(false);
  const [visible2, setvisible2] = useState(false);
  const [status, setStatus] = useState('');
  const [time, setTime] = useState('');

  const [startTime, setStartTime] = useState<Date>();

  const [phones, setPhones] = useState<Array<string>>([]);

  useEffect(() => {
    if (phone) {
      setPhones(phone.split(','));
    }
    return onCancel();
  }, []);

  const onCancel = () => {
    setvisible(false);
    setStartTime(undefined);
    setStatus('');
    setTime('');
    setValue('');
  }

  // 记录通话
  const onRecordingCalls = () => {
    const _startTime = new Date();
    // console.log('_startTime', dayjs(_startTime).format(formatType));
    if (_startTime) {
      Dialog.confirm({
        content: '是否记录此次通话',
        cancelText: '否',
        confirmText: '是',
        onConfirm: () => {
          // const _time = ;
          setTime(getTimeLength(_startTime, new Date()));
          setStartTime(_startTime);
          Dialog.confirm({
            content: '通话状态',
            cancelText: '未接通',
            confirmText: '已接通',
            onConfirm: () => {
              setStatus('已接通');
              setvisible(true);
            },
            onCancel: () => {
              setStatus('未接通');
              setvisible(true);
            }
          });
        },
        onCancel: () => {}
      });
    }
  }
  
  // 通话状态
  const callStatus = () => {
    NetCloudFun.post(`/crm/v2/Calls`, {
      data: [{
        Subject: name ? '给' + name + '打电话' : '打电话给' + phone,
        $se_module: module_name,
        What_Id: data.id,
        Call_Start_Time: dayjs(startTime).format(formatType),
        Call_Duration: time,
        Call_Type: '呼出',
        Description: value || status,
      }],
      trigger: [
        "approval",
        "workflow",
        "blueprint"
    ]
    }).then((res: any) => {
      if (res.data) {
        if (res.data[0].code === 'SUCCESS') {
          message.success('已记录');
          if (module_name === 'TelephoneDevelopment' && data.status !== '已拨打') {
            NetCloudFun.put(`/crm/v2/${module_name}/${data.id}`, {
              data: [{
                ...data,
                status: '已拨打',
                Last_dialed_time: dayjs(startTime).format(formatType), 
              }]
            }).then((res: any) => {
              if (res.data) {
                onChange && onChange(data.id);
                // if (res.data[0].code === 'SUCCESS') {
                // }
              }
            }).catch((err) => {
              // console.log(err);
            })
          } else {
            onChange && onChange('refresh');
          }
          onCancel();
        }
      }
    }).catch((_err) => {
      message.success('错误');
      onCancel();
    })
  }

  return (
   <>
   {phones.length === 1 ? (
      <View onClick={onRecordingCalls}>
        <a style={{color: '#666'}} href={'tel:' + phones[0]} onClick={(event) => {
          Taro.makePhoneCall({
            phoneNumber: phones[0], //仅为示例，并非真实的电话号码
            success: () => {
              message.success('请点击电话跳转进行跳转');
            },
            fail: () => {
              message.error('未能跳转拨打电话界面');
            },
          })
          event.stopPropagation();
        }}>
          <PhoneFill color={color}/>
        </a>
      </View>
   ) : (
    <View onClick={() => setvisible2(true)}>
      <PhoneFill color={color}/>
    </View>
   )}
    <Mask visible={visible} className="call-phone-mask">
      <View className="call-phone-mask-content">
        <Text className="call-phone-mask-content-status">{status}</Text>
        <Text className="call-phone-mask-content-time">{time}</Text>
        <Input className="call-phone-mask-content-input" placeholder="请输入通话描述" value={value} onChange={(e) => setValue(e)}/>
        <View className="call-phone-mask-content-btns">
          <Button className="call-phone-mask-content-btn" size='small' onClick={onCancel}>取消</Button>
          <Button className="call-phone-mask-content-btn" size='small' color='primary' onClick={callStatus}>确定</Button>
        </View>
      </View>
    </Mask>
    <ActionSheet
      visible={visible2}
      cancelText="取消"
      actions={phones.map((item, index) => ({text: <a href={'tel:' + item} onClick={(event) => {
        onRecordingCalls();
        setvisible2(false);
        Taro.makePhoneCall({
          phoneNumber: item, //仅为示例，并非真实的电话号码
          success: () => {
            message.success('请点击电话跳转进行跳转');
          },
          fail: () => {
            message.error('未能跳转拨打电话界面');
          },
        })
      }}>{item}</a>, key: index}))}
      onClose={() => setvisible2(false)}
    />
   </>
  )
}

function doubleNum(n){
  if(n < 10){
    return "0" + n;
  }else{
    return n;
  }
}

const getTimeLength = (_startTime: Date, _endTime: Date) => {
  const startTime = dayjs(_startTime);
  const endTime = dayjs(_endTime);
  if (startTime && endTime) {
    let diffTime = endTime.diff(startTime, 'second');
    if (diffTime <= 0) {
      // 跨天 => 看着 startTime 时间点比 endTime时间点晚， 时间间隔就是（开始时间-24:00） + （00:00-结束时间）
      let diffTime1 = dayjs('24:00:00', 'HH:mm:ss').diff(startTime, 'second');
      let diffTime2 = endTime.diff(dayjs('24:00:00', 'HH:mm:ss'), 'second');
      diffTime = diffTime1 + diffTime2;
    }

    // 秒
    let second = diffTime % 60;
    // 分钟
    let minutes = Math.floor(diffTime / 60) % 60;
    // 小时
    let hours = Math.floor(diffTime / 3600);

    let formEstTime = hours > 0 ? `${doubleNum(hours)}:` : '';
    formEstTime += minutes > 0 ? `${doubleNum(minutes)}:` : '00:';
    formEstTime += second > 0 ? `${doubleNum(second)}` : '00';

    return formEstTime || '00:00';
  } else {
    return '00:00';
  }
}