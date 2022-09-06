/**
 * 日期时间
 */
 import { DatePicker, Toast } from "antd-mobile"
 import { useEffect, useState } from "react"
 import dayjs from "dayjs"
 import { View, Text, Image } from "@tarojs/components"
 import './style.scss'
import dateIcon from 'src/assets/icons/date-icon.png';
 
 export default (props) => {
   const {onChange, isDisable, placeholder, onBlur} = props;
   const formatType = 'YYYY-MM-DDTHH:mm:ss';
   const str = dayjs(props.value).format('YYYY-MM-DD HH:mm:ss');
   const date = new Date(Date.parse(str.replace(/-/g,"/")));
   useEffect(() => {
     if (props.value) {
       onChange && onChange(dayjs(date).format(formatType));
      //  onBlur && onBlur(dayjs(date).format(formatType));
     }
   }, []);
 
   const [pickerVisible, setPickerVisible] = useState(false)
   const [value, setValue] = useState(date);
   return (
     <View
       onClick={() => {
         if (!isDisable) {
           setPickerVisible(true)
         }
       }}
       className="field"
       >
         <DatePicker
           visible={pickerVisible}
           precision='second'
           defaultValue={props.value ? value : undefined}
           value={props.value ? value : undefined}
           onClose={() => {
             setPickerVisible(false)
           }}
           onConfirm={val => {
             setValue(val);
             Toast.show(dayjs(val).format(formatType));
             onChange && onChange(dayjs(val).format(formatType));
             onBlur && onBlur(dayjs(val).format(formatType));
           }}
         >
           {_value => {
             return (
               <View className="field-content">
                 {_value ? (
                   <Text className="field-text">
                     {dayjs(_value).format(formatType)}
                   </Text>
                 ) : (
                   <Text className="field-placeholder">{placeholder || ' '}</Text>
                 )}
                 <Image src={dateIcon} className="date-icon"/>
               </View>
             )
           }}
         </DatePicker>
       </View>
   )
 }