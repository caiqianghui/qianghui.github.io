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
  form: any;
}

export default (props: Props) => {
  const { section, form } = props;
  const [attachments, setAttachments] = useState([]);
  const field = section.fields[0];

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
