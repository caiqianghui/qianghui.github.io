import {
  Input,
} from 'antd-mobile';

export default (props) => {
  const { value, isDisable, placeholder, onChange, onBlur, option } = props;
  
  return (
    <Input
      {...props}
      className="field"
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      value={value || undefined}
      disabled={isDisable}
      maxLength={255}
      {...option}
    />
  )
}