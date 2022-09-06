/**
 * 用户
 */
 import { View, Text, ScrollView } from "@tarojs/components";
 import { Button, CheckList, Divider, Popup, SearchBar, Space } from "antd-mobile"
 import {useEffect, useState} from 'react'
 import './style.scss'
 import { RightOutline, CloseOutline } from 'antd-mobile-icons'
import _ from "lodash";
import { Col, Row } from "antd";
 

 export default (props) => {
   const { field, isDisable, onChange, onSelect, onBlur, placeholder } = props;
 
   const [visible, setVisible] = useState(false);
   const [value, setValue] = useState<Array<string>>([]);
   const [multipleValue, setmultipleValue] = useState<Array<string>>([]);
   const [search, setSearch] = useState<string>('');

  const [destroyOnClose, setDestroyOnClose] = useState(false);

  const [lists, setLists] = useState<Array<any>>([]);
  const pickList = (field.pick_list_values || []).map((item, index) => ({...item, value: index, label: item.display_value || item.actual_value}))

   useEffect(() => {
    console.log(props.value);
    if (!props.value) {
      setDestroyOnClose(true);
      setValue([]);
      setmultipleValue([]);
    } else {
      setValue(props.value);
      setmultipleValue(props.value);
      setDestroyOnClose(false);
      onChange && onChange(props.value);
    }
    setLists(pickList);
   }, [props]);

   return (
     <View className="field" onClick={() => {
        setVisible(!isDisable ? true : false);
     }}>
        <View className="field-content">
         {value && value.length ? (
           <View className="field-text">
              {value.map((val, index) => 
                <Text className={'field-text-multiple'} key={index}>{val}</Text>
              )}
            </View>
         ) : (
           <Text className="field-placeholder">{placeholder || ' '}</Text>
         )}
         <RightOutline />
       </View>
       <Popup
         visible={visible}
         destroyOnClose={destroyOnClose}
         onMaskClick={() => {
           setVisible(false)
         }}
         bodyStyle={{height: window.innerHeight * 0.8 + 'px'}}>
         <View className='resource-popup'>
           <View className="search-content">
            <SearchBar
              style={{flex: 1}}
              onClear={() => {
                setLists(pickList);
              }}
              value={search}
              onChange={(e) => {
                setSearch(e);
                if (!e) {
                  setLists(pickList);
                } else {
                  setLists(pickList.filter((list) => list.label.indexOf(e) !== -1));
                }
              }}/>
           </View>
           <View className='main'>
            <ScrollView
              style={{height: '100%'}}
              scrollY={true}
            >
              <CheckList
                multiple={true}
                value={value}
                defaultValue={props.value ? [props.value] : []}
              >
                {lists.map((list, index) => {
                  return (
                    <CheckList.Item key={index} value={list.label} onClick={() => {
                      const isDelete = value.find((item) => item === list.label);
                      if (isDelete) {
                        setValue(value.filter((val) => val !== list.label));
                        setmultipleValue(multipleValue.filter((item) => item !== list.label));
                        onChange && onChange(multipleValue.filter((item) => item !== list.label));
                      } else {
                        setValue(value.concat(list.label));
                        setmultipleValue(multipleValue.concat(list.label));
                        onChange && onChange(multipleValue.concat(list.label));
                      }
               
                    }}>
                      <View className="user-item">
                        <View>{list.label}</View>
                      </View>
                    </CheckList.Item>
                  )
                })}
              </CheckList>
              {!lists.length && <Divider style={{marginTop: '20px'}}>{search ? `未找到${search}` : '暂无数据'}</Divider>}
             </ScrollView>
           </View>
           <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px'}}>
            <Button block style={{marginRight: '5px'}} color='warning' shape='rounded' onClick={() => {
              setValue([]);
              setmultipleValue([]);
              onChange && onChange([]);
            }}>重置</Button>
            <Button block style={{marginLeft: '5px'}} color='primary' shape='rounded' onClick={() => {
              setVisible(false)
            }}>确定</Button>
           </View>
         </View> 
       </Popup>
     </View>
   );
 }