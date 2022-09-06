import { View } from '@tarojs/components';
import {
  TextArea,
} from 'antd-mobile';
import './style.scss'

export default (props: any) => {
  const { isDisable, placeholder, onChange, onBlur } = props;

  return (
    <View className="form-field">
      <TextArea
        {...props}
        value={props.value || undefined}
        className="form-field-area"
        placeholder={placeholder}
        autoSize={{ minRows: 2, maxRows: 4 }}
        disabled={isDisable}
        onChange={(e) => onChange && onChange(e)}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
      />
    </View>
  )
}