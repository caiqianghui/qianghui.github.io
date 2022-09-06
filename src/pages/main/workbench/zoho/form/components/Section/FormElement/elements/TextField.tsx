/**
 * 单行
 */

import {
  Input,
} from 'antd-mobile';
import './style.scss';

export default (props) => {
  const {field, isDisable, placeholder, onChange, onBlur } = props;

  return (
    <Input
      {...props}
      value={props.value || undefined}
      className="field"
      clearable
      placeholder={placeholder}
      disabled={isDisable}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      maxLength={field.length || 255}
    />
  )
}