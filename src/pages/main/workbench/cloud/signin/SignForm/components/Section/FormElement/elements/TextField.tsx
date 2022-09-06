import {
  Input,
} from 'antd-mobile';
import { useEffect } from 'react';
import './style.scss';

export default (props) => {
  const {field, isDisable, placeholder, onChange, onBlur } = props;
  
  useEffect(() => {
    console.log(props.value);
  }, []);

  return (
    <Input
      {...props}
      className="field"
      clearable
      placeholder={placeholder}
      disabled={isDisable}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => {
        onBlur && onBlur(e.target.value);
        onChange && onChange(e.target.value.trim());
      }}
      maxLength={field.validations.length.maximum || 255}
    />
  )
}