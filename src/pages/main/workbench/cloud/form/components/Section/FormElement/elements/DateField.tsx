/**
 * 日期
 */

 import { DatePicker, Toast } from "antd-mobile"
 import { useEffect, useState } from "react"
 import dayjs from "dayjs"
 import { View, Text, Image } from "@tarojs/components"
 import dateIcon from 'src/assets/icons/date-icon.png';
 import './style.scss'
 
 export default (props) => {
   const {onChange, isDisable, placeholder, onBlur, field} = props;
   const [pickerVisible, setPickerVisible] = useState(false)
   const formatType = 'YYYY-MM-DD';
   const str = dayjs(props.value).format(formatType);
   const date = new Date(Date.parse(str.replace(/-/g,"/")));
   const [value, setValue] = useState(props.value ? date : undefined);
   useEffect(() => {
     if (props.value) {
       onChange && onChange(dayjs(date).format(formatType));
      //  onBlur && onBlur(dayjs(date).format(formatType));
     };
   }, []);

   return (
     <View
       onClick={() => {
         if (!isDisable) {
           setPickerVisible(true)
         }
       }}
       className="form-field"
     >
       <DatePicker
         visible={pickerVisible}
         defaultValue={props.value ? value : undefined}
         value={props.value ? value : undefined}
         onClose={() => {
           setPickerVisible(false)
         }}
         onConfirm={val => {
           setValue(val);
           const value = dayjs(val).format(formatType);
           Toast.show(value);
           onChange && onChange(value);
           onBlur && onBlur(value);
         }}
       >
         {_value => {
           _value ? onChange && onChange(dayjs(props.value).format(formatType)) : null;
           return (
             <View className="form-field-content">
               {value ? (
                 <Text className="form-field-content-text">
                   {dayjs(value).format(formatType)}
                 </Text>
               ) : (
                 <Text className="form-field-content-placeholder">{placeholder || ' '}</Text>
               )}
               <Image src={dateIcon} className="form-field-icon" />
             </View>
           )
         }}
       </DatePicker>
     </View>
   )
 }