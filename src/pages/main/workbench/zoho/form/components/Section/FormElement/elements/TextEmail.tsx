/**
 * 邮箱
 */

import {
  Input,
} from 'antd-mobile';
import './style.scss';
import { MailOutline } from 'antd-mobile-icons'

export default (props) => {
  const {field, isDisable, placeholder, onChange, onBlur } = props;
  
  return (
    <Input
      {...props}
      className="field"
      clearable
      value={props.value || undefined}
      placeholder={placeholder}
      disabled={isDisable}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      maxLength={field.length || 255}
      suffix={<MailOutline />}
    />
  )
}