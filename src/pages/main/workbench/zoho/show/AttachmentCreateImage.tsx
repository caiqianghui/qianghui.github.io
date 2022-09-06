import { View, Text } from "@tarojs/components"
import { message } from "antd";
import { Input, NavBar, Image } from "antd-mobile"

import NetCloudFun from "src/pages/services/functions";

interface Props {
  onBack: (e?: string) => void;
  module: string;
  zoho_id: string;
}

export default (props: Props) => {
  const {onBack, module, zoho_id} = props;

  const onAddAttachment = () => {
    NetCloudFun.post(`/crm/v2/${module}/${zoho_id}/photo`, {
      file: ''
    }).then((res) => {
      if (res.data) {
        message.success('添加成功');
        onBack('success');
      } else {
        message.error('添加失败-请重试');
      }
    })
  }


  return (
    <View className="attachment-content">
      <NavBar onBack={() => {
        onBack();
      }} right={<Text className={ 'attachment-content-save'} onClick={onAddAttachment}>添加附件</Text>}>附件</NavBar>
      <Input placeholder="点击这里输入文件名"/>
      <Image />
    </View>
  )
}