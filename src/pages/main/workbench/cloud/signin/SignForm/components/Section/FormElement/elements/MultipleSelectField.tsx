
/**
 * 多选列表
 */
import { useEffect, useState } from "react";
import { Selector } from "antd-mobile"
import './style.scss'
import { View } from "@tarojs/components";

export default (props) => {
  const { field, isDisable, onChange, onSelect, onBlur } = props;
  const list = (field.map_choices || field.choices).map((item, index) => ({...item, value: index}))
  
  useEffect(() => {
    setVal();
  }, []);
  const [value, setValue] = useState<Array<any>>([]);

  const setVal = () => {
    if (props.value && props.value?.length) {
      const values = props.value || [];
      onChange && onChange(props.value);
      // onBlur && onBlur(props.value);
      setValue(() => {
        const arr = list.filter((item) => {
          return values.find((v) => v === item.label)
        }).map((item) => item.value)
        return arr;
      });
    }
  }
  return (
    <View className="MultipleSelectField">
      <Selector
        options={list}
        disabled={isDisable}
        // 默认选项 为编辑时传入
        defaultValue={value}
        value={value}
        multiple
        onChange={(_arr, extend) => {
          const val = extend.items.map((item) => item.label)
          setValue(_arr)
          onChange && onChange(val);
          onSelect && onSelect(val);
          onBlur && onBlur(val);
        }}
      />
    </View>

  )
}