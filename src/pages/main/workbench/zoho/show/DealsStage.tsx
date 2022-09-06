/**
 * 商机阶段
 */
import { Input, NavBar, Popup, Form } from "antd-mobile"
import {View, Text} from '@tarojs/components'
import './index.scss';
import { useEffect, useState } from "react";
import { RightOutline, SearchOutline } from 'antd-mobile-icons';
import DealsFileds from "./DealsFileds";
import NetCloudFun from "src/pages/services/functions";
import FormElement from "../form/components/Section/FormElement";

interface Props {
  data: any;
  info: any;
  onSave: (e?: string) => void;
}

export default (props: Props) => {
  const {onSave, data, info} = props;
  const [fields, setFields] = useState<Array<any>>();

  const [formRef] = Form.useForm();
  const [tip, setTip] = useState<any>();

  useEffect(() => {
    if (!fields) {
      // 阶段按钮
      let _fields: Array<any> = [];
      info.fields.forEach((item) => {
        const aenm = DealsFileds.fields.find((field) => field.api_name === item);
        if (item === '丢单原因') {
          _fields.push({
            "webhook": true,
            "field_label": "丢单原因",
            "tooltip": null,
            "type": "used",
            "field_read_only": false,
            "display_label": "丢单原因",
            "read_only": false,
            "association_details": null,
            "businesscard_supported": false,
            "multi_module_lookup": {},
            "id": "181037000000592388",
            "filterable": true,
            "visible": true,
            required: false,
            "refer_from_field": null,
            "profiles": [
              {
                "permission_type": "read_write",
                "name": "Administrator",
                "id": "181037000000016144"
              }
            ],
            "view_type": {
              "view": true,
              "edit": true,
              "quick_create": false,
              "create": true
            },
            "subform": null,
            "separator": false,
            "searchable": true,
            "show_type": 7,
            "external": null,
            "api_name": "task",
            "unique": {},
            "enable_colour_code": false,
            "pick_list_values": [],
            "system_mandatory": false,
            "virtual_field": false,
            "json_type": "string",
            "crypt": null,
            "created_source": "default",
            "available_in_user_layout": true,
            "display_type": -1,
            "ui_type": 110,
            "email_parser": {
              "fields_update_supported": false,
              "record_operations_supported": true
            },
            "currency": {},
            "custom_field": true,
            "lookup": {},
            "length": 2000,
            "column_name": "POTENTIALCF23",
            "display_field": false,
            "pick_list_values_sorted_lexically": false,
            "sortable": false,
            "history_tracking": null,
            "data_type": "textarea",
            "formula": {},
            "additional_column": null,
            "category": 0,
            "decimal_place": null,
            "mass_update": false,
            "multiselectlookup": {},
            "auto_number": {}
          });
        }
        if (aenm) {
          _fields.push(aenm);
        }
      });
      console.log('_fields', _fields);
      setFields(_fields.filter((field) => field.api_name !== 'Stage'));
    }
  }, [info]);

  const onFinish = (values) => {
    NetCloudFun.put(`/crm/v2/Deals/${data.id}`, {
      data: [{
        ...data,
        Stage: info.label,
        ...values,
      }],
      trigger: [
        "approval",
        "workflow",
        "blueprint"
    ]
    }).then((res) => {
      if (res.data) {
        if(res.data[0].code === 'SUCCESS' && res.data[0].status === 'success') {
          onSave('success');
        }
      }
      console.log('onFinish', res);
    }).catch((err) => {
      console.log(err);
    })
    console.log('values', values);
  }

  return (
    <View className="accpunts-blueprint-content">
      <NavBar
        onBack={() => {
          onSave();
          setFields(undefined);
          setTip(undefined);
        }}
        right={
          <Text
            onClick={() => {
              formRef.validateFields().then(values => {
                onFinish(values);
                console.log(data);
              }).catch(errorInfo => {
                // message.error(`表单有${errorInfo.errorFields.length}处填写错误，请根据提示修改后提交`);
              })
            }}
            style={{fontSize: '16px'}}
          >
          保存
          </Text>
        }
      >
        {info.label}
      </NavBar>
      <View className='form'>
        {tip ? (
          <span onClick={() => console.log(tip.Info)}>&nbsp;{tip?.Info}</span>
        ) : null}
        <Form layout='horizontal' mode='card' form={formRef} onFinish={onFinish}>
          {fields && fields.map((field, index) => {
            return (
              <Form.Item
                {...field}
                className="form-item-show"
                key={index}
                rules={[{required: field.field_label === '丢单原因' ? false : true, message: field.field_label + '为空'}]}
                label={field.field_label}
                initialValue={data[field.api_name]}
                name={field.api_name}>
                <FormElement field={field}/>
                {/* {field.data_type === 'picklist' ? <PlckList field={field}/> : <Input placeholder={'请输入' + field.field_label}/>} */}
              </Form.Item>
            )
          })}
        </Form>
      </View>
    </View>
  )
}

const PlckList = (props: any) => {
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
    setColumns(maps && maps.length ? maps : pick_list_values || []);
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
        className="picklist-popup-show"
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        bodyStyle={{ height: '90vh' }}
      >
        <View className="picklist-popup-content">
          <View className="picklist-view-input">
            <Input
              className="picklist-input"
              placeholder={'搜索' + field.display_label}
              clearable
              value={searchKey}
              onChange={val => {
                setSearchKey(val)
                setColumns(pick_list_values.filter((item) => item.display_value.indexOf(val) !== -1));
              }}
              onEnterPress={() => {
              }}
            />
            <SearchOutline fontSize={18} className="icon"/>
          </View>
          <View className="picklist">
            {columns.map((column, index) => {
              const active = (props.value || '-None-') === column.display_value;
              return (
                <View key={index} onClick={() => {
                  if (column.display_value === '-None-') {
                    onChange && onChange(null);
                  } else {
                    console.log(column);
                    onChange && onChange(column.display_value);
                  }
                  onSelect && onSelect(column);
                  setVisible(false)
                }} className={active ? 'picklist-item active' : 'picklist-item' } style={column.colour_code ? {borderLeftColor: column.colour_code} : {}}>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    {column.colour_code ? (
                      <View style={{width: '10px', height: '10px', borderRadius: '50%', background: column.colour_code, marginRight: '10px'}}/>
                    ) : null}
                    <Text>
                      {column.display_value}
                    </Text>
                  </View>
                  {/* {active ? (
                    <CheckOutline />
                  ) : null} */}
                </View>
              )
            })}
          </View>
        </View>
      </Popup>
    </View>
  )
}