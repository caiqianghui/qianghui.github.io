/**
 * 选择列表 选项
 */
 import { View, Text } from "@tarojs/components";
 import { Divider, Input, Popup, SearchBar } from "antd-mobile"
 import { useEffect, useState } from "react";
 import './style.scss'
 import { RightOutline, CheckOutline, SearchOutline } from 'antd-mobile-icons'
 
 export default (props: any) => {
  const {onChange, isDisable, field, onBlur, onSelect} = props;

  const {pick_list_values, maps} = field;

  const [columns, setColumns] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);

  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    if (props.value) {
      onChange && onChange(props.value);
      // onBlur && onBlur(props.value);
    }
    setColumns(maps && maps.length ? maps : pick_list_values);
  }, [field, maps, pick_list_values]);

  return (
    <View className="field" onClick={() => {
      if (!isDisable) {
        setVisible(true);
      }
    }}>
      <View className="field-content">
        <Text className="field-text">{props.value || columns.length && columns[0].display_value}</Text>
        <RightOutline />
      </View>
      <Popup
        className="picklist-popup"
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        bodyStyle={{ height: '90vh' }}
      >
        <View className="picklist-popup-content">
          <View className="picklist-view-input">
            <SearchBar clearable value={searchKey} placeholder={'搜索' + field.display_label} onChange={val => {
              setSearchKey(val)
              setColumns(pick_list_values.filter((item) => item.display_value.indexOf(val) !== -1));
            }}/>
          </View>
          <View className="picklist">
            {columns.map((column, index) => {
              const active = (props.value || '-None-') === column.display_value;
              return (
                <View key={index} onClick={() => {
                  if (column.display_value === '-None-') {
                    onChange && onChange(null);
                  } else {
                    onChange && onChange(column.display_value);
                  }
                  onSelect && onSelect(column);
                  setVisible(false)
                }} className={active ? 'picklist-item active' : 'picklist-item' }>
                  {column.display_value}
                  {active ? (
                    <CheckOutline />
                  ) : null}
                </View>
              )
            })}
            {!columns.length && searchKey && <Divider>未找到 “{searchKey}”</Divider>}
          </View>
        </View>
      </Popup>
    </View>
  )
}