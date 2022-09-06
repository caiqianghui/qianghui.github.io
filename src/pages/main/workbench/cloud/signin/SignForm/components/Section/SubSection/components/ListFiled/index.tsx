import { View } from "@tarojs/components";
import { AutoCenter } from "antd-mobile";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import FormItem from "../FormItem";
import {
  UpOutline,
} from 'antd-mobile-icons'

const getDefaultValue = (field) => {
  const defaultValue = field.default_value || field.options.default_value || field.options.default_enable;
  if (!defaultValue && (field.type === 'Fields::DateField' || field.type === 'Fields::DatetimeField') && field.options.default_current_date) {
    return dayjs();
  }
  if (defaultValue && field.type === 'Fields::MultipleSelectField') {
    return [defaultValue];
  }
  return defaultValue;
}

export default (props: any) => {

  const { field, section, record, fieldData, setActiveKey, index} = props;

  const [values, setValues] = useState({});

  useEffect(() => {
    let objs = {};
    field.fields.map((item) => {
      objs[item.name] = getDefaultValue(item) || null;
    });
    setValues(objs);
  }, []);

  return (
    <View className="swiperContent">
      <View className="swiperContent-content">
        {field.fields.map((item) => {
          return (
            <FormItem {...{values, record, setValues, fieldData, section}} field={item} index={index}/>
          );
        })}
      </View>
      <View className="buttomBtn" onClick={() => setActiveKey('')}>
        <AutoCenter className="buttomBtnText">收起{section.title + (record.name + 1)}<UpOutline /></AutoCenter>
      </View>
    </View>
  );
}