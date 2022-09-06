import { useState, useEffect, useContext } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormContainerContext } from '../../../FormContainer';
import { View } from '@tarojs/components';

interface Props {
  placeholder?: string;
  isDisable: boolean;
  value?: any;
  onChange?: (e: string) => void;
}

export default (props: Props) => {
  const { isDisable, onChange } = props;
  const [attachments, setAttachments] = useState([]);
  const { type } = useContext<any>(FormContainerContext);

  useEffect(() => {
    const data = (props.value || []).map((item) => {
      return {
        uid: item.id,
        name: (
          <span>
            {item.name}
            <span style={{ marginLeft: 20, color: '#ccc' }}>{item.size}KB</span>
          </span>
        ),
        status: 'done',
        url: item.url,
      };
    })
    setAttachments(type !== 'new' ? data : []);
  }, []);

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: attachments,
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      setAttachments(info.fileList);
      onChange && onChange(info.fileList);
    },
  };

  return (
    <View className="attachment-field">
      <Upload {...uploadProps}>
        {!isDisable && <Button icon={<UploadOutlined />}>{'选择文件'}</Button>}
      </Upload>
    </View>
  );
};
