/**
 * 百分数
 */
import { View } from '@tarojs/components';
import {
  InputNumber,
} from 'antd';
import './style.scss';

export default (props) => {
  const { value, isDisable, placeholder, onChange, onBlur } = props;

  return (
    <View className='form-field'>
      <InputNumber
        className="form-field-percent"
        placeholder={placeholder}
        step={1}
        onChange={(v) => onChange && onChange(v)}
        onBlur={(v) => onBlur && onBlur(v)}
        value={value || undefined}
        addonAfter="%"
        disabled={isDisable}
      />
    </View>
  )
}