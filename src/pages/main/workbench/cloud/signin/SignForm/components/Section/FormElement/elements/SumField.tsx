import {
  Input,
} from 'antd';

export default (props) => {
  const { value, placeholder, onChange } = props;
  
  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className='disableSumInput'
      bordered={false}
    />
  )
}