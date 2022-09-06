/**
 * 选择列表
 */
import { View, Text } from "@tarojs/components";
import { Picker } from "antd-mobile"
import { useEffect, useState } from "react";
import './style.scss'
import { RightOutline } from 'antd-mobile-icons'

export default (props: any) => {
  const {onChange, isDisable, field, placeholder, onSelect} = props;

  const {map_choices, choices} = field;

  const [columns, setColumns] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // if (props.value) {
    //   onChange && onChange(props.value);
    // }
  }, []);
  
  
  useEffect(() => {
    setColumns((map_choices || choices).map((item: any) => ({...item, value: item.label})));
    if (field.validations.presence) {
      if (map_choices && map_choices.length) {
        setColumns(map_choices.map((item: any) => ({...item, value: item.label})));
      } else {
        setColumns(choices.map((item: any) => ({...item, value: item.label})));
      }
    }
  }, [field])

  return (
    <View className="field" onClick={() => {
      // if (!columns.length) {
      //   message.warn(`${field.label}列表为空`);
      //   return;
      // }
      if (!isDisable) {
        setVisible(true);
      }
    }}>
      <Picker
        columns={[columns]}
        value={[props.value || '']}
        visible={visible}
        popupClassName="select-field-picker"
        onClose={() => {
          setVisible(false);
        }}
        onSelect={(_val) => {
          if (_val[0]) {
            onChange && onChange(_val[0]);
            onSelect && onSelect(_val[0])
          }
        }}
        onConfirm={(_val) => {
          if (_val[0]) {
            onChange && onChange(_val[0]);
            onSelect && onSelect(_val[0])
          }
          setVisible(false);
        }}
      >
        {items => {
          const _value = items.map(item => item?.label).join('-');
          return (
            <View className="field-content">
              {_value ? (
                <Text className="field-text">{_value}</Text>
              ) : (
                <Text className="field-placeholder">{placeholder || ''}</Text>
              )}
              <RightOutline />
            </View>
          )
        }}
      </Picker>
    </View>
  )
}