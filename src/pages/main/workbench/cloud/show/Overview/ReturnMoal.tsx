/**
 * 退回
 */

import { View, Text } from "@tarojs/components"
import { message } from "antd";
import { Loading, NavBar, Popup, TextArea } from "antd-mobile";
import { useState } from "react";
import { processReturn } from "src/pages/services/model_process";
import {RightOutline, CheckOutline} from 'antd-mobile-icons';
import { ProcessNodeMoudle } from "..";
import { Step, Steps } from "src/components/Steps";
 
interface ConfirmProps {
  processNodes: Array<ProcessNodeMoudle>,
  id: string,
  onClose: (e?: string) => void,
}
 
export default (props: ConfirmProps) => {
  const {id, onClose, processNodes} = props;

  const [values, setValues] = useState({
  return_node_id: '',
  remark: '退回',
  });

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);  

  const onSubmit = () => {
  // console.log(values, 'valuesvaluesvalues');
  if (!values.return_node_id) {
    message.error('退回节点不能为空');
  } else if (!values.remark) {
    message.error('退回意见不能为空');
  } else {
    if (loading) return;
    setLoading(true);
    processReturn({
      ...values,
      return_node_id: values.return_node_id,
      current_node_id: id,
    }).then((res) => {
      if (res.code === 200) {
        message.success(res.data.results.tip || '退回成功');
        onClose('success');
      }
      setLoading(false);
    });
  }
};
const [processNode, setProcessNode] = useState<ProcessNodeMoudle>();

  return (
    <View className="cloud-show-modal">
      <NavBar onBack={() => onClose()}>确定加签</NavBar>
      <View className="cloud-show-modal-content">
        <TextArea className="cloud-show-modal-content-textarea" value={values.remark} onChange={(e) => setValues({...values, remark: e})}/>
        <View className="cloud-show-modal-content-list" onClick={() => setVisible(!visible)}>
          <Text className="cloud-show-modal-content-list-label">退回标签</Text>
          <View className="cloud-show-modal-content-list-right">
            <Text className="cloud-show-modal-content-list-right-value">{values.return_node_id && processNode && processNode?.approval_node.label}</Text>
            <RightOutline style={{marginLeft: '5px'}}/>
          </View>
        </View>
        {values.return_node_id &&
          <View className="cloud-show-modal-content-return">
          <Text>节点人员：</Text>
            {processNode?.approvers.map((item) => {
              return (
                <View className="cloud-show-modal-content-return-item" key={item.id}>
                  <Text>姓名：{item.name}</Text>
                  <Text>邮箱：{item.email}</Text>
                  <Text>角色：{item.role}</Text>
                </View>
              );
            })}
          </View>
        }
      </View>
      <View className="cloud-show-modal-btns">
        <Text className="cloud-show-modal-btns-btn cancel" onClick={() => onClose()}>取消</Text>
        <Text className="cloud-show-modal-btns-btn" onClick={onSubmit}>确定{loading && <Loading color='white'/>}</Text>
      </View>
      <Popup visible={visible} onMaskClick={() => setVisible(false)} bodyStyle={{height: '80vh'}}>
        <View className="cloud-show-modal-return">
          <Steps>
            {processNodes.map((item, index, arr) => {
              return (
                <View className="cloud-show-modal-return-item" key={item.id} onClick={() => {
                  setValues({...values, return_node_id: item.id});
                  setProcessNode(item);
                  setVisible(false);
                }}>
                  <Step
                    {...props}
                    step={arr}
                    status="wait_audit"
                    currentNum={index + 1}
                    title={
                      <View className="cloud-show-modal-return-item-step">
                        <Text className="cloud-show-modal-return-item-label">{item.approval_node.label}</Text>
                      </View>
                    }
                    description={
                      <View className="cloud-show-modal-return-item-step">
                        {item.approvers.map((approver) => {
                          return (
                            <View key={approver.id} className="cloud-show-modal-return-item-step-content">
                              <View className="cloud-show-modal-return-item-step-content-avatar">
                                <Text key={approver.id}>
                                  {approver.name[0]}
                                </Text>
                              </View>
                              <Text key={approver.id}>{approver.name}</Text>
                            </View>
                          );
                        })}
                      </View>
                    }
                  />
                  <CheckOutline color="#0061ca" fontSize={24} style={{opacity: item.id === values.return_node_id ? 1 : 0}}/>
                </View>
              )
            })}
          </Steps>
        </View>
      </Popup>
    </View>
  );
}