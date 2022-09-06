/**
 * 价钱
 */
import { useContext } from 'react';
import {
  InputNumber,
} from 'antd';
import './style.scss'
import { FormContainerContext } from '../../../FormContainer';
import { Popover } from 'antd-mobile';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import { View } from "@tarojs/components";

export default (props) => {
  const { refForm, form, productsRef} = useContext<any>(FormContainerContext);
  const { field, value, isDisable, placeholder, onChange, onBlur, subFormName, index, onSelect } = props;
  const currentProduct = form.name === "sales_orders" && field.name === "price" && subFormName === "sales_order_items" && refForm && productsRef.current[refForm.getFieldValue([subFormName, index, 'product_id'])];
  const element = (
    <View className='form-field'>
      <InputNumber
        // {...props}
        className="form-field-prefix"
        status={currentProduct && parseFloat(currentProduct.current_client_price || 0) !== parseFloat(value || 0) && "warning"}
        step={1}
        type='number'
        bordered={false}
        placeholder={placeholder}
        onBlur={(e) => {
          !!onBlur && onBlur(e.target.value);
        }}
        disabled={field.is_formula || isDisable}
        parser={(v) => {
          let val: any = v;
          const precision = Math.pow(10, field.options.decimal_places || 2);
          if (field.options.round_option === "round_up") {
            val = Math.ceil(Number(v) * precision) / precision;
          } else if (field.options.round_option === "round_down") {
            val = Math.floor(Number(v) * precision) / precision;
          }
          return val;
        }}
        value={value}
        precision={field.options.decimal_places || 2}
        prefix={field.options.hide_currency ? '' : '￥'}
        onChange={(e) => {
          console.log(e);
          onChange && onChange(e);
        }}
      />
    </View>
  )

  return currentProduct ? ( 
    <View className='row-center'>
      {element}
      <Popover
        placement="top"
        // overlayClassName="promotionTip"
        content={
          <div>
            <div style={{ color: 'red', textDecoration: parseFloat(currentProduct.current_client_price || 0) !== parseFloat(value || '0') ? "line-through" : 'none' }}>{currentProduct.current_client_price_type}：{currentProduct.current_client_price}</div>
            <div style={{ color: 'red' }}>当前价：{value}</div>
          </div>
        }
      >
        <ExclamationCircleOutlined style={{marginLeft: '4px'}}/>
      </Popover>
    </View>
  ) : element
}