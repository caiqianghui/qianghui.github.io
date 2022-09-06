import {useContext} from 'react';
import { View } from "@tarojs/components";
import { Form } from "antd";
import MultipleImageField from "../FormElement/elements/MultipleImageField";
import { FormContainerContext } from '../../FormContainer';
import SignInImageField from '../FormElement/elements/SignInImageField';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

interface Props {
  section: any;
}

export default (props: Props) => {
  const {
    module,
    address,
  } = useContext<any>(FormContainerContext);
  const { section } = props;
  return (
    <View className="form-item-label">
      <Form.Item
        className="element-field"
        name={section.fields[0].name}
        style={{ marginBottom: 0 }}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={section.fields[0].validations.presence ? [{ required: true, message: section.title + "不能为空" }] : []}
      >
        { module === 'SalesSignIn' ? (
            <SignInImageField address={address} />
          ) : (
            <MultipleImageField isDisable={false} />
          )}
      </Form.Item>
    </View>
  )
}