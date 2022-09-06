import {
  InputNumber,
} from 'antd';
import './style.scss';

export default (props) => {
  const { value, isDisable, placeholder, onChange, onBlur } = props;

  return (
    <InputNumber
      className="field percent"
      placeholder={placeholder}
      step={1}
      onChange={(v) => onChange && onChange(v)}
      onBlur={(v) => onBlur && onBlur(v)}
      value={value || undefined}
      addonAfter=""
      disabled={isDisable}
    />
  )
}