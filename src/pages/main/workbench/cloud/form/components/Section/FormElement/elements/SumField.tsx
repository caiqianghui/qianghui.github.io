import { View } from '@tarojs/components';
import {
  Input,
} from 'antd';

export default (props) => {
  const { value, placeholder, onChange } = props;
  
  return (
    <View className='form-field'>
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value || undefined}
        className='form-field-disable'
        bordered={false}
      />
    </View>
  )
}