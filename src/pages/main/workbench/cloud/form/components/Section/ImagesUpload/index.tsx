import { View } from "@tarojs/components";
import { Form } from "antd";
import { Collapse } from "antd-mobile";
import MultipleImageField from "../FormElement/elements/MultipleImageField";

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
  const { section, form } = props;
  const field = section.fields[0];

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
            rules={field.validations.presence ? [{ required: true, message: section.title + "不能为空" }] : []}
          >
            <MultipleImageField isDisable={false} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </View>
  )
}