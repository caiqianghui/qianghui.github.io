import { View } from "@tarojs/components";
import { Button, Form, Upload } from "antd";
import { Collapse } from "antd-mobile";
import { useEffect, useState } from "react";
// import MultipleAttachmentField from "../FormElement/elements/MultipleAttachmentField";
import { UploadOutlined } from '@ant-design/icons';


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};


interface Props {
  section: any;
  data: any;
  form: any;
}

export default (props: Props) => {
  const { section, data, form } = props;
  const [attachments, setAttachments] = useState([]);
  console.log('section', section);
  const field = section.fields[0];
  
  useEffect(() => {
    setAttachments(
      ((field && data[field.name]) || []).map((item) => {
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
      }),
    );
  }, [data]);

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: attachments,
    accept: field.options.accept || '*/*',
    disabled: field.disable_edit || field.accessibility === 'read_only',
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      setAttachments(info.fileList);
    },
  };

  return (
    <View className="form-item-label">
      <Collapse>
        <Collapse.Panel key="" title={<span>
          {field.validations.presence && <span style={{color: "#ff4d4f", marginRight: 5}}>*</span>}
          <span>{section.title}</span>
        </span>}>
          <Form.Item
            className="element-field"
            name={section.fields[0].name}
            style={{ marginBottom: 0 }}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={field.validations.presence ? [{ required: true, message: "不能为空" }] : []}
          >
            {/* <MultipleAttachmentField isDisable={false} /> */}
            <Upload {...uploadProps}>
              <Button disabled={field.disable_edit || field.accessibility === 'read_only'} icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
  </View>
  );
};
