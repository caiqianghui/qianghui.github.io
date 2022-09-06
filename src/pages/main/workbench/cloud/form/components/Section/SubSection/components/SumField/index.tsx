import { View } from "@tarojs/components";
import { Form, Input } from "antd";

export default (props: any) => {
  const {field, data} = props;

  return (
    <Form.Item
      className="sumFieldContent"
      key={field.id}
      label={null}
      name={field.name}
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 8}}
      initialValue={(data && data[field.name]) || 0}
    >
      <FormItem field={field}/>
    </Form.Item>
  );
}

const FormItem = (props: any) => {
  const {field} = props;
  return (
    <View className="form-container-container-sum">
      <View className="form-container-container-sum-item">
        <span className="form-container-container-sum-item-label">{field.label}:</span>
        <View className="form-container-container-sum-item-input">
          <Input
            {...props}
            disabled
            bordered={false}
          />
        </View>
      </View>
    </View>
  )
}