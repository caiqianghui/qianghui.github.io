import {
  Input,
} from 'antd-mobile';
import { useEffect } from 'react';
import './style.scss';

export default (props) => {
  const {field, isDisable, placeholder, onChange, onBlur } = props;
  
  useEffect(() => {
    if (props.value) {
      console.log(field.label, props.value);
      onChange && onChange(props.value);
    }
  }, [props.value]);

  return (
    <Input
      {...props}
      value={props.value || undefined}
      className="form-field"
      clearable
      placeholder={placeholder}
      disabled={isDisable}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      maxLength={field.validations.length.maximum || 255}
    />
  )
}