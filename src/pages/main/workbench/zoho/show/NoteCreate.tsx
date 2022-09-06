import { View, Text } from "@tarojs/components"
import { message } from "antd";
import { Input, NavBar, TextArea } from "antd-mobile"
import { FillinOutline } from "antd-mobile-icons"

import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";

interface Props {
  data?: any;
  onBack: (e?: string) => void;
  module?: string;
  zoho_id?: string;
}

export default (props: Props) => {
  const {onBack, module, zoho_id, data} = props;
  const [description, setDescription] = useState('');

  const [title, setTitle] = useState('');

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data && data.id) {
      setIsEdit(true);
      setTitle(data.Note_Title || '');
      setDescription(data.Note_Content || '');
    }
  }, [data])

  const onSave = () => {
    if (description) {
      NetCloudFun.post(`/crm/v2/${module}/${zoho_id}/Notes`, {
       data: [
        {
          Note_Title: '',
          Note_Content: description
        }
       ]
      }).then((res) => {
        if (res.data) {
          message.success('添加成功');
          onBack('success');
        } else {
          message.error('添加失败-请重试');
        }
      })
    }
  }

  return (
    <View className="note-content">
      <NavBar onBack={() => {
        onBack();
        setIsEdit(false);
      }} right={isEdit ? null : <Text className={description ? 'note-content-save' : 'note-content-save disabled'} onClick={onSave}>保存</Text>}>添加备注</NavBar>
      {title ? (
        // <Input value={title} disabled={isEdit} className="input-title"/>
        <View className="input-title">
          <Text>{title}</Text>
        </View>
      ) : null}
        <TextArea
          value={description}
          disabled={isEdit}
          className="input-description"
          onChange={(e) => setDescription(e)}
          placeholder={'添加备注'}
          autoSize={{ minRows: 2, maxRows: 10 }}
        />
    </View>
  )
}