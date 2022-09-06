import { Button, View, Text } from "@tarojs/components";
import { Popover } from "antd";
import { useRef, useState } from "react";
import FormElement from "../form/components/Section/FormElement";
import {DownFill} from 'antd-mobile-icons';
import { Checkbox } from "antd-mobile";

interface Props {
  data: any;
  field: any;
  content: Array<any>;
  onChange: (e: any) => void;
}

export default (props: Props) => {

  const {data, field, content, onChange} = props

  const [node, setNode] = useState<any>();
  const [active, setActive] = useState(false)
  const [value, setValue] = useState();

  const popoverRef = useRef(Popover || null);

  const contentRender = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'column', maxHeight: 80, overflowY: 'scroll'}}>
        {content.map((item) => {
          return (
            <Text style={node && node.key === item.key ? {padding: '5px 10px', background: '#f2f2f2'} : {padding: '5px 10px'}} key={item.key} onClick={() => {
              setNode(item);
              onChange({active, node: item, value});
              console.log(popoverRef)
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
        onChange({active: e, node: content[0], value})
      }} value={field.id}>{field.field_label}</Checkbox>
      {data.active ? (
        <View className='screen-active'>
          <Popover ref={popoverRef} trigger="click" placement="bottomLeft" content={contentRender}>
            <Button className='screen-active-left' onClick={() => {
            }}>{node && node.text}<DownFill fontSize={12} style={{marginLeft: 10}}/></Button>
          </Popover>
          <View className='screen-active-right'>
            {field.data_type === 'picklist' ? (
              <FormElement value={value} field={field} onChange={(e) => {
                setValue(e);
                onChange({active, node, value: e})
              }} />
            ) : (
              <FormElement field={field} onChange={(e) => {
                setValue(e);
                onChange({active, node, value: e})
              }} />
            )}
          </View>
        </View>
      ) : null}
    </View>
  )
}