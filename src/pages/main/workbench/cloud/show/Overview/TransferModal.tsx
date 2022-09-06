/**
 * 转交
 */

 import { View, Text } from "@tarojs/components"
 import { message } from "antd";
 import { Loading, NavBar, TextArea } from "antd-mobile";
 import { useState } from "react";
 import { processTransfer } from "src/pages/services/model_process";
 import UserField from "../../form/components/Section/FormElement/elements/UserField";
import { ProcessNodeMoudle } from "..";
 
 interface ConfirmProps {
  currentProcessNode?: ProcessNodeMoudle,
   onClose: (e?: string) => void,
 }
 
 export default (props: ConfirmProps) => {
   const {currentProcessNode, onClose} = props;
 
   const [values, setValues] = useState({
     user_id: null,
     remark: '转交',
   });
   const [loading, setLoading] = useState(false);  
 
   const onSubmit = () => {
    if (!values.user_id) {
      message.error('转交对象不能为空');
    } else if (!values.remark) {
      message.error('转交理由不能为空');
    } else if (currentProcessNode?.approver_ids.indexOf(values.user_id) !== -1) {
      message.error('转交对象已经是当前节点审批人');
    } else {
      if (loading) return;
      setLoading(true);
      processTransfer({
        ...values,
        process_node_id: currentProcessNode.id,
      }).then((res) => {
        if (res.code === 200) {
          message.success(res.data.results.tip || '转交成功');
          onClose('success');
        }
        setLoading(false);
      });
    }
  };
 
   return (
     <View className="cloud-show-modal">
       <NavBar onBack={() => onClose()}>确定转交</NavBar>
       <View className="cloud-show-modal-content">
         <TextArea className="cloud-show-modal-content-textarea" value={values.remark} onChange={(e) => setValues({...values, remark: e})} placeholder="请输入转交理由"/>
         <View className="cloud-show-modal-content-list">
           <Text className="cloud-show-modal-content-list-label">转交方式</Text>
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