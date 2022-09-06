/**
 * 加签
 */

import { View, Text } from "@tarojs/components"
import { message } from "antd";
import { Loading, NavBar, TextArea } from "antd-mobile";
import { useState } from "react";
import { processAppend } from "src/pages/services/model_process";
import {RightOutline, CheckOutline} from 'antd-mobile-icons';
import UserField from "../../form/components/Section/FormElement/elements/UserField";

interface ConfirmProps {
  id: string,
  onClose: (e?: string) => void,
}

const methods = [
  {
    title: '后加签',
    value: 'after_append',
  },
];

export default (props: ConfirmProps) => {
  const {id, onClose} = props;

  const [values, setValues] = useState({
    method: 'after_append',
    user_id: null,
    remark: '加签',
  });


  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);  

  const onSubmit = () => {
    console.log(values, 'valuesvaluesvalues');
    if (!values.method) {
      message.error('加签方式不能为空');
    } else if (!values.user_id) {
      message.error('加签人员不能为空');
    } else if (!values.remark) {
      message.error('加签理由不能为空');
    } else {
      if (loading) return;
      setLoading(true);
      processAppend({...values, process_node_id: id}).then(
        (res) => {
          message.success(res.data.results.tip || '加签成功');
          onClose('success');
          setLoading(false);
        },
      );
    }
  };

  return (
    <View className="cloud-show-modal">
      <NavBar onBack={() => onClose()}>确定加签</NavBar>
      <View className="cloud-show-modal-content">
        <TextArea className="cloud-show-modal-content-textarea" value={values.remark} onChange={(e) => setValues({...values, remark: e})} placeholder="请输入加签理由"/>
        {/* <View className="cloud-show-modal-content-list" onClick={() => setVisible(!visible)}>
          <Text className="cloud-show-modal-content-list-label">加签方式</Text>
          <View className="cloud-show-modal-content-list-right">
            <Text className="cloud-show-modal-content-list-right-value">{'后加签'}</Text>
            <RightOutline style={{marginLeft: '5px'}}/>
          </View>
        </View> */}
        {visible &&
          <View className="cloud-show-modal-content-append">
            {methods.map((item) => {
              return (
                <View className="cloud-show-modal-content-append-item" key={item.value} onClick={() => setValues({...values, method: item.value})}>
                  <Text style={{marginRight: "10px"}}>{item.title}</Text>
                  {item.value === values.method && <CheckOutline />}
                </View>
              );
            })}
          </View>
        }
        <View className="cloud-show-modal-content-list" onClick={() => {
          setVisible(false);
        }}>
          <Text className="cloud-show-modal-content-list-label">加签人员</Text>
          <View className="cloud-show-modal-content-list-right">
            <UserField right={true} onChange={(e) => {
              setValues({...values, user_id: e})
            }}/>
          </View>
        </View>
      </View>
      <View className="cloud-show-modal-btns">
        <Text className="cloud-show-modal-btns-btn cancel" onClick={() => onClose()}>取消</Text>
        <Text className="cloud-show-modal-btns-btn" onClick={onSubmit}>确定{loading && <Loading color='white'/>}</Text>
      </View>
    </View>
  )
}