/**
 * 省市区
 */

 import { useState, useEffect } from 'react'
 import { Cascader } from 'antd-mobile'
 
 import { cities } from './city'
 import { View, Text } from '@tarojs/components';
 import './style.scss'
 import { RightOutline } from 'antd-mobile-icons'
 
 // 渲染所选值
 export default (props: any) => {
   const {onChange, isDisable, onBlur, placeholder, onSelect} = props;
   const [visible, setVisible] = useState(false);
   const [value, setValue] = useState<Array<string>>(props.value || []);
   useEffect(() => {
     if (props.value) {
       setValue(props.value);
       onChange && onChange(props.value);
      //  onBlur && onBlur(value);
     };
   }, [])
   return (
     <View
       className='form-field'
       onClick={() => {
         if (!isDisable) {
           setVisible(true);
         }
       }}
     >
       <Cascader
         options={cities}
         visible={visible}
         defaultValue={props.value}
         onClose={() => {
           setVisible(false)
         }}
         value={value}
         onConfirm={setValue}
         onSelect={(val) => {
           setValue(val);
           onChange && onChange(val);
           onSelect && onSelect(val);
           onBlur && onBlur(val);
         }}
       >
         {items => {
           return (
             <View className="form-field-content">
               {!items.every(item => item === null) ? (
                 <Text className="form-field-content-text">{items.map(item => item?.label).join('-')}</Text>
               ) : (
                 <Text className="form-field-content-placeholder">{placeholder || ''}</Text>
               )}
               <RightOutline />
             </View>
           );
         }}
       </Cascader>
     </View>
   )
 }
 