import { Button, View, Text } from "@tarojs/components";
import { Popover } from "antd";
import { useEffect, useRef, useState } from "react";
import FormElement from "../form/components/Section/FormElement";
import {DownFill} from 'antd-mobile-icons';
import { Checkbox } from "antd-mobile";
import ProvinceCityAreaField from "../form/components/Section/FormElement/elements/ProvinceCityAreaField";

interface Props {
  data: any;
  field: any;
  content: Array<any>;
  onChanges: (e: any) => void;
}

export default (props: Props) => {

  const {data, field, content, onChanges} = props
  const [node, setNode] = useState<any>();
  const [active, setActive] = useState(data.active)
  const [value, setValue] = useState(data.value);

  const popoverRef = useRef(Popover || null);

  useEffect(() => {
    if (active) {
      setNode(content[0]);
    }
  }, [active]);

  const contentRender = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'column', maxHeight: 80, overflowY: 'scroll'}}>
        {content.map((item) => {
          return (
            <Text style={node && node.key === item.key ? {padding: '5px 10px', background: '#f2f2f2'} : {padding: '5px 10px'}} key={item.key} onClick={() => {
              setNode(item);
              onChanges({active, node: item, value});
              // console.log(popoverRef)
            }}>{item.text}</Text>
          )
        })}
      </View>
    )
  }

  return (
    <View className='screen-item'>
      <Checkbox defaultChecked={active} checked={data.active} className='screen-check' onChange={(e) => {
        setActive(e);
        setNode(content[0]);
        onChanges({active: e, node: content[0], value})
      }} value={field.id}>{field.api_name !== 'Street' ? field.field_label : '省/市/区'}</Checkbox>
      {data.active ? (
        <View className='screen-active'>
          <Popover ref={popoverRef} trigger="click" placement="bottomLeft" content={contentRender}>
            <Button className='screen-active-left' onClick={() => {
            }}>{node && node.text }<DownFill fontSize={12} style={{marginLeft: 10}}/></Button>
          </Popover>
          <View className='screen-active-right'>
            {field.data_type === 'picklist' ? (
              <FormElement value={value} field={field} onChange={(e) => {
                setValue(e);
                onChanges({active, node, value: e})
              }} />
            ) : field.api_name === 'Street' ? (
              <ProvinceCityAreaField onChange={(e) => {
                setValue(e);
                if (e) {
                  onChanges({active, node, value: e})
                }
              }} />
            ) : (
              <FormElement value={value} field={field} onChange={(e) => {
                console.log(e);
                setValue(e);
                if (e) {
                  onChanges({active, node, value: e})
                }
              }} />
            )}
          </View>
        </View>
      ) : null}
    </View>
  )
}