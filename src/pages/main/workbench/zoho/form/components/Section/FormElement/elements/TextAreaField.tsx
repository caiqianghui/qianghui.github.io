/**
 * 多行
 */
 import {
  TextArea,
} from 'antd-mobile';
import './style.scss'

export default (props: any) => {
  const { isDisable, placeholder, onChange, onBlur } = props;

  return (
    <TextArea
      {...props}
      value={props.value || undefined}
      className="text-area-field"
      placeholder={placeholder}
      autoSize={{ minRows: 2, maxRows: 5 }}
      disabled={isDisable}
      onChange={(e) => onChange && onChange(e)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
    />
  )
}