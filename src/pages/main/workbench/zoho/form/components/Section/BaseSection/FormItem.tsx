import { useEffect, useContext } from 'react';
import { Form } from 'antd';
import FormElement from '../FormElement';
import { FormContainerContext } from '../../FormContainer';
import { View } from "@tarojs/components";
import NetCloudFun from 'src/pages/services/functions';

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

export default (props) => {
  const {
    data,
    refForm,
    setSections,
    module,
  } = useContext<any>(FormContainerContext);
  const { field, options, section } = props;

  const onSelect = (selected_data) => {
    // 省 市 映射
    if (selected_data?.maps && selected_data?.maps.length) {
      if (selected_data?.maps[0].pick_list_values) {
        const pick_list_values = selected_data?.maps[0].pick_list_values;
        const changeValues: any = {};
        changeValues.name = selected_data?.maps[0].api_name;
        if (pick_list_values.length) {
          changeValues.value = pick_list_values[0].display_value;
        }
        refForm.setFields([changeValues]);
        setSections((sections) => {
          sections.map((_section) => {
            if (_section.id === section.id) {
              _section.fields.map((_field) => {
                if (_field.api_name === selected_data?.maps[0].api_name) {
                  _field.maps = pick_list_values
                }
              })
            }
          });
          return sections;
        });
      }
    }

    if (selected_data?.role && module === 'Leads') {

      if (selected_data?.role.name.indexOf('战区') !== -1) {
        const warZone = {
          name: 'War_Zone',
          value: selected_data?.role.name,
        };
        refForm.setFields([warZone]);
      }

      gethigherrole(selected_data.role.name);
      getDepartment(selected_data.role.id, selected_data.role.name);
    }
  }

  // 获取大区
  const gethigherrole = (roleName) => {
    NetCloudFun.get(`/crm/v2/functions/gethigherrole/actions/execute`, {
      auth_type: 'oauth',
      roleName
    }).then((res: any) => {
      if (res) {
        if (res.code === "success") {
          const {details} = res;
          // 基本信息 客户所属大区
          const region = {
            name: 'Region',
            value: JSON.parse(details.output).name
          };
          if (region.value) {
            refForm.setFields([region]);
          } 
        }
      }
    })
  }

  // 通过职位获取分部信息
  const getDepartment = (id, roleName) => {
    NetCloudFun.get(`/crm/v2/functions/getDepartment/actions/execute`, {
      auth_type: 'oauth',
      roleName,
      id
    }).then((res: any) => {
      if (res) {
        if (res.code === "success") {
          const {details} = res
          // 基本信息 客户所属部门
          const accountDepartment = {
            name: 'Account_Department',
            value: details.output
          };
          if (accountDepartment.value) {
            refForm.setFields([accountDepartment]);
          } 
          // 销售线索详情 所属公海
          const publicLead = {
            name: 'Public_Lead',
            value: details.output
          };
          if (publicLead.value) {
            refForm.setFields([publicLead]);
          } 
        }
      }
    })
  }


  return (
    <View className="form-item">
      <Form.Item
        className='form-item-label'
        label={null}
        name={field.api_name}
        rules={[{required: field.required, message: field.field_label + '不能为空'}]}
        tooltip={field.is_show_tip && field.tip_type === 'icon' ? field.hint : false}
        initialValue={data[field.api_name] || field.default_value}
        {...formItemLayout}
        {...options}
      >
        <FormItem
          onSelect={onSelect}
          field={field}
        />
      </Form.Item>
    </View>
  );
};

// 换行
const FormItem = (props) => {
  const {isDisable, field} = props;
  // 是否必填
  return (
    <View id={field.api_name} className={'formItem space-between'} >
      <span className={isDisable ? 'label disable' : 'label'} onClick={() => console.log(field)}>
        <span className="required">{field.required ? '*' : ''}</span>
        {field.field_label}
      </span>
      <View className={isDisable ? 'element disable' : 'element'}>
        <FormElement
          {...props}
        />
      </View>
    </View>
  );
}