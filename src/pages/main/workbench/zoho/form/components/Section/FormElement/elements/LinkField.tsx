import {
  Input,
} from 'antd-mobile';

export default (props) => {
  const { field, value, isDisable, placeholder, onChange, onBlur, option } = props;
  
  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      value={value || undefined}
      disabled={isDisable}
      maxLength={field.length || 255}
      {...option}
    />
  )
}