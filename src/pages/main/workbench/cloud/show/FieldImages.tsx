import React, { useState, useEffect } from 'react';
import { Image, Upload, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteAttachment, uploadAttachment } from '../form/service';
import { View, Text } from "@tarojs/components";

const { confirm } = Modal;
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const FieldAttachments = (props) => {
  const { moduleName, data, field, canUpdated, section } = props;
  const [attachments, setAttachments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    setAttachments(
      ((field && data[field.name]) || []).map((item) => {
        return {
          uid: item.id,
          name: item.name,
          status: 'done',
          url: item.url,
          thumbUrl: item.thumb_url,
        };
      }),
    );
  }, []);

  const options = {
    name: 'file',
    listType: 'picture-card',
    accept: 'image/*',
    multiple: true,
    fileList: attachments,
    defaultFileList: attachments,
    showUploadList: {
      showRemoveIcon: canUpdated,
    },
  };

  return (
    <View className='content-detail-content'>
      <View className='content-detail-content-top'>
        <Text className='content-detail-content-name'>{section.title || ''}</Text>
      </View>
      <View className='content-detail-content-label'>
        <Upload {...options} />
      </View>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{ visible: previewVisible, onVisibleChange: (vis) => setPreviewVisible(vis) }}
        >
          <Image src={previewImage} />
        </Image.PreviewGroup>
      </div>
    </View>
  );
};
export default FieldAttachments;
