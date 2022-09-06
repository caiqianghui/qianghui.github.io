/**
 * 选择列表
 */
import { View, Text } from "@tarojs/components";
import { Picker, Rate, Toast } from "antd-mobile"
import { useEffect, useState } from "react";
import './style.scss'
import { RightOutline } from 'antd-mobile-icons'
 
export default (props: any) => {
  const {onChange, isDisable, field, onDropdown, placeholder, onSelect, overloadData, subFormName, index, onFocus} = props;

  const {map_choices} = field;

  const [columns, setColumns] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);
  const [choices, setChoices] = useState(field.choices);

  const overloadChoices = subFormName ? ((overloadData[subFormName] || [])[index] && overloadData[subFormName][index][field.name] && overloadData[subFormName][index][field.name].choices) : (overloadData[field.name] && overloadData[field.name].choices);
 
  useEffect(() => {
    if (props.value) {
      onChange && onChange(props.value);
      onFocus && onFocus(props.value)
      // onSelect && onSelect(props.value);
    }
    setColumns((overloadChoices || map_choices || choices).map((item: any) => ({...item, value: item.label})) || []);
  }, [field, map_choices, choices, overloadChoices]);

  return (
    <View className="form-field" onClick={() => {
      onDropdown && onDropdown({ choices: overloadChoices || map_choices || choices, setChoices});
      if (!isDisable) {
        setVisible(true);
      }
    }}>
      {/* <Rate onChange={val => Toast.show(val.toString())} /> */}
      <Picker
        columns={[columns]}
        value={[props.value || '']}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={(_val) => {
          setVisible(false);
          if (!_val[0]) {
            onChange && onChange(columns[0].value);
          //  onBlur && onBlur(columns[0].value);
            onSelect && onSelect(columns[0].value)
          } else {
            onChange && onChange(_val[0]);
          //  onBlur && onBlur(_val[0]);
            onSelect && onSelect(_val[0])
          }
        }}
      >
        {items => {
          const _value = items.every(item => item === null) ? props.value : items.map(item => item?.label).join('-');
          return (
            <View className="form-field-content">
              {_value ? (
                <Text className="form-field-content-text">{_value}</Text>
              ) : (
                <Text className="form-field-content-placeholder">{placeholder || ''}</Text>
              )}
              <RightOutline />
            </View>
          )
        }}
      </Picker>
    </View>
  )
}