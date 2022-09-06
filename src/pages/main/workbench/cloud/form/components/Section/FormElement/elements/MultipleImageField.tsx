/**
 * 图片上传
 */
 import { useState, useEffect, useContext } from "react";
 import { Upload, Image } from 'antd';
 import { PlusOutlined } from '@ant-design/icons';
import { FormContainerContext } from "../../../FormContainer";
import { View } from "@tarojs/components";

 const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

 interface Props {
   placeholder?: string;
   isDisable: boolean;
   value?: any;
   onChange?: (e: string) => void;
 }
 
 export default (props: Props) => {
  const { isDisable, onChange } = props;
  const { type } = useContext<any>(FormContainerContext);

   useEffect(() => {
     const data = (props.value || []).map((item) => {
      return {
        uid: item.id,
        name: item.name,
        status: 'done',
        url: item.url,
        thumbUrl: item.thumb_url,
      };
    })
    setAttachments(type !== 'new' ? data : []);
    if (data.length) onChange && onChange(data);
   }, [])
 
   const [attachments, setAttachments] = useState([]);
   const [previewVisible, setPreviewVisible] = useState(false);
   const [previewImage, setPreviewImage] = useState('');

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: attachments,
    accept: 'image/*',
    defaultFileList: attachments,
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      // console.log('info', info);
      setAttachments(info.fileList);
      onChange && onChange(info.fileList);
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewVisible(true);
      setPreviewImage(file.url || file.preview);
    },
  };

   return (
     <View className="form-field">
       <Upload listType={'picture-card'} {...uploadProps}>
        {!isDisable && (
          <PlusOutlined />
        )}
      </Upload>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{ visible: previewVisible, onVisibleChange: (vis) => setPreviewVisible(vis) }}
        >
          <Image src={previewImage} />
        </Image.PreviewGroup>
      </div>
     </View>
   )
 }