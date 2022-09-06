import { View } from "@tarojs/components";
import { Form } from "antd";
import { Collapse } from "antd-mobile";
import { useEffect, useState } from "react";
import MultipleAttachmentField from "../FormElement/elements/MultipleAttachmentField";


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

  return (
    <View className="form-item-label">
      {form.category === 'step_form' ? (
        <Form.Item
          className="element-field"
          name={section.fields[0].name}
          style={{ marginBottom: 0 }}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <MultipleAttachmentField isDisable={false} />
        </Form.Item>
      ): (
        <Collapse>
          <Collapse.Panel key="" title={section.title}>
            <Form.Item
              className="element-field"
              name={section.fields[0].name}
              style={{ marginBottom: 0 }}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <MultipleAttachmentField isDisable={false} />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      )}
    </View>
  );
};
