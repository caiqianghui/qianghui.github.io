/**
 * 审批同意
 */

import { View, Text } from "@tarojs/components";
import { message } from "antd";
import { Loading, NavBar, TextArea } from "antd-mobile"
import { useState } from "react";
import { processAudit } from "src/pages/services/model_process";

interface Props {
  onClose: (e?: string) => void;
  id: string;
}

export default (props: Props) => {
  const {onClose, id} = props;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);  

  return (
    <View className="cloud-show-modal">
      <NavBar onBack={onClose}>确定要同意吗？</NavBar>
      <View className="cloud-show-modal-content">
        <TextArea className="cloud-show-modal-content-textarea" autoSize={{ minRows: 3, maxRows: 5 }} onChange={(e) => setValue(e)} value={value}/>
      </View>
      <View className="cloud-show-modal-btns">
        <Text className="cloud-show-modal-btns-btn cancel" onClick={() => onClose()}>取消</Text>
        <Text className="cloud-show-modal-btns-btn" onClick={() => {
          if (loading) return;
          setLoading(true);
          processAudit({
            process_node_id: id,
            status: 'passed',
            remark: value,
          }).then((res) => {
            if (res.code === 200) {
              message.success(res.data.results.tip || '操作成功');
              // freshProcess();
              onClose('success');
            } else {
              message.error(res.tips);
            }
            setLoading(false);
          })
          .catch(() =>
            // 错误提示
            message.success('操作失败')
            // AtAlert.showToast(I18n.t('custom-tip-approvErr'), 3000),
          );
        }}>确定{loading && <Loading color='white'/>}</Text>
      </View>
    </View>
  )
}