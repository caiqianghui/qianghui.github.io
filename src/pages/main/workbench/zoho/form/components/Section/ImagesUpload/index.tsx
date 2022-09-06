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
  return (
    <View className="form-item-label">
      <Collapse>
        <Collapse.Panel key="" title={section.display_label}>
          <Form.Item
            className="element-field"
            name={section.fields[0].api_name}
            style={{ marginBottom: 0 }}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <MultipleImageField isDisable={false} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </View>
  )
}