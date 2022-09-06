import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Upload, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteAttachment, uploadAttachment } from '../form/service';
import { View, Text } from "@tarojs/components";
const { confirm } = Modal;

const FieldAttachments = (props) => {
  const { moduleName, data, field, canUpdated, section } = props;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    setAttachments(
      ((field && data[field.name]) || []).map((item) => {
        return {
          uid: item.id,
          name: (
            <span>
              {item.name}
              {item.size ? <span style={{ marginLeft: 20, color: '#ccc' }}>{item.size}KB</span> : null}
              <span style={{ marginLeft: 20, color: '#ccc' }}>{item.created_at}</span>
            </span>
          ),
          status: 'done',
          url: item.url,
        };
      }),
    );
  }, []);

  const options = {
    name: 'file',
    multiple: true,
    fileList: attachments,
    defaultFileList: attachments,
    showUploadList: {
      showRemoveIcon: canUpdated,
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <View className='content-detail-content'>
      <View className='content-detail-content-top'>
        <Text className='content-detail-content-name'>{section.title || ''}</Text>
      </View>
      {attachments.length ? (
        <View className='content-detail-content-text'>
            <Upload {...options} />
        </View>
      ) : (
        <Text className='content-detail-content-label' style={{flex: 1, width: '100%'}}>暂无{section.title}</Text>
      )}
    </View>
  );
};
export default FieldAttachments;
