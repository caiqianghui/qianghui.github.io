import { Input } from 'antd-mobile';
import './style.scss'

export default (props) => {
  const { isDisable, placeholder, onChange, onBlur, field } = props;

  return (
    <Input
      className="field"
      {...props}
      value={props.value || undefined}
      type='number'
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(Number(e))}
      onBlur={(e) =>  onBlur && onBlur(Number(e.target.value))}
      disabled={field.is_formula || isDisable}
      clearable
    />
  );
};
