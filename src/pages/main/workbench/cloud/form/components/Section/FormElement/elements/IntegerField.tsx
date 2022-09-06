/**
 * 整数
 */
import { View } from '@tarojs/components';
import { InputNumber } from 'antd';
import './style.scss'

export default (props) => {
  const { isDisable, placeholder, onChange, onBlur, field } = props;

  return (
    <View className='form-field'>
      <InputNumber
        style={{width: '100%', border: 'none'}}
        value={props.value || undefined}
        type='number'
        className='form-field-integer'
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(Number(e))}
        onBlur={(e) =>  onBlur && onBlur(Number(e.target.value))}
        disabled={field.is_formula || isDisable}
      />
    </View>
  );
};
