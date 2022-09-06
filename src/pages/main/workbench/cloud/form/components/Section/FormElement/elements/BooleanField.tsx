/**
 * 复选框
 */

 import { View } from "@tarojs/components";
 import { Switch } from "antd"
 import { useEffect, useState } from "react";
import './style.scss'

 export default (props) => {
   const { isDisable, onChange, onBlur} = props;
   const [value, setValue] = useState(props.value || false);
   useEffect(() => {
     if (props.value) {
       onChange && onChange(false);
      //  onBlur && onBlur(false);
     }
   }, []);
   return (
     <View className="form-field">
       <Switch
         className="form-field-boolean"
         onChange={(e) => {setValue(e); onChange && onChange(e); onBlur && onBlur(e)}}
         disabled={isDisable}
         checked={value}
       />
     </View>
   )
 }