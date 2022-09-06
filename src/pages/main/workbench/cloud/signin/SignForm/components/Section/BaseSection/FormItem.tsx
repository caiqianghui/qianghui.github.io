import { useContext } from 'react';
import { getRules } from 'src/utils/utils';
import { Form } from 'antd';
import dayjs from 'dayjs';
import FormElement from '../FormElement';
import { FormContainerContext } from '../../FormContainer';
import { View } from "@tarojs/components";
import { getRecordAddresses } from 'src/pages/services/tab';

export default (props) => {
  const {
    fields,
    refForm,
    fieldMapDependencies,
    setSections,
    addresses,
    setAddresses,
    // data,
    overloadData,
    actionMap,
    setDefaultRelationField,
    executeFormula,
    executeLinkageFunction,
    setDisableEdit,
    setHiddenField,
    customModule,
    executeEventFunction,
    module,
    moduleName, setModuleName,
    moduleRule, setModuleRule,
  } = useContext<any>(FormContainerContext);
  const { field } = props;

  // 模块id 字段
  const moduleId = {
    "id": "6947625329724751872",
    "key": "Fields::TextField_466f7ac-2742-dda3-dca2-c41a536da3d2",
    "name": "module_id",
    "accessibility": "read_and_write",
    "validations": {
      "presence": false,
      "uniqueness": false,
      "length": {
        "minimum": 0,
        "maximum": 0,
        "is": 0
      },
      "format": {
        "with": "",
        "message": ""
      }
    },
    "options": {
      "multiline": false
    },
    "type": "Fields::TextField-iBbodor",
    "form_id": "6947617662113415168",
    "label": "签到模块id",
    "hint": null,
    "is_show_tip": false,
    "tip_type": null,
    "custom_field": true,
    "is_quick_create": false,
    "is_default_relation_field": false,
    "default_relation_field": [],
    "is_store": true,
    "can_modify": true,
    "is_formula": false,
    "formula": null,
    "default_value": null,
    "linkage_function": null,
    "section_id": "6947617662138580992",
    "sort_num": 5,
    "system_mandatory": false,
    "view": [
      "index",
      "show",
      "new",
      "edit",
      "print"
    ],
    "mobile_view": [],
    "column_width": null,
    "is_disable_edit": null,
    "disable_edit_condition": null,
    "hidden_condition": null,
    "nested_form_id": null,
    "fields": [],
    "choices": null,
    "search_columns": null,
    "search_condition": null
  };

  const fetchAddress = (val) => {
    if (
      ['categories', 'units', 'brands', 'warehouses'].indexOf(field.options.data_source_type) === -1
    ) {
      if (val && val.id) {
        getRecordAddresses(field.options.data_source_type, { id: val.id }).then((res) => {
          if (res.data) {
            const newAddress = {};
            newAddress[field.label] = res.data.datas;
            setAddresses({ ...addresses, ...newAddress });
          }
        });
      } else {
        const newAddress = {};
        newAddress[field.label] = [];
        setAddresses({ ...addresses, ...newAddress });
      }
    }
  };

  // useEffect(() => {
  //   if (field.type === 'Fields::ResourceField' && data.id) {
  //     fetchAddress({ id: data[field.name] });
  //   }
  // }, [data]);

  const setRelatedResourceField = (selected_data) => {
    const fieldMapDependency = (fieldMapDependencies || []).filter(
      (item) => item.parent_field_id === field.id,
    )[0];
    if (fieldMapDependency) {
      let mapField;
      fields.forEach((item) => {
        if (item.id === fieldMapDependency.sub_field_id) {
          mapField = item;
          return;
        } else if (item.fields.length > 0) {
          item.fields.forEach((item2) => {
            if (item2.id === fieldMapDependency.sub_field_id) {
              mapField = item2;
              return;
            }
          });
        }
      });
      if (mapField) {
        const condition = {};
        if (fieldMapDependency.related_field_name) {
          condition[`${fieldMapDependency.related_field_name}_eq`] =
            (selected_data && selected_data.id) || 0;
        }
        if (
          mapField.related_field_search_condition &&
          Object.values(mapField.related_field_search_condition)[0] !== 0
        ) {
          refForm.setFields([
            {
              name: mapField.name,
              value: null,
            },
          ]);
          if (addresses[mapField.label]) {
            const newAddress = addresses;
            newAddress[mapField.label] = [];
            setAddresses({ ...newAddress });
          }
        }
        setSections((items) => {
          return items.map((item) => {
            return item.category === 'sub_form'
              ? {
                  ...item,
                  fields: item.fields.map((item2, index) => {
                    if (index > 0) {
                      return item2;
                    }

                    return {
                      ...item2,
                      fields: item2.fields.map((item3) =>
                        item3.id === mapField.id
                          ? { ...item3, related_field_search_condition: condition }
                          : item3,
                      ),
                    };
                  }),
                }
              : {
                  ...item,
                  fields: item.fields.map((item2) =>
                    item2.id === mapField.id
                      ? { ...item2, related_field_search_condition: condition }
                      : item2,
                  ),
                };
          });
        });
      }
    }
  };

  // 字段依赖
  const setRelatedSelectField = (val) => {
    const fieldMapDependency = (fieldMapDependencies || []).filter(
      (item) => item.parent_field_id === field.id,
    )[0];
    if (fieldMapDependency) {
      const currentChoice = field.choices.filter((choice) => choice.label === val)[0];
      const currentChoiceId = val && currentChoice && currentChoice.id;
      let mapField;
      fields.forEach((item) => {
        if (item.id === fieldMapDependency.sub_field_id) {
          mapField = item;
        } else if (item.fields.length > 0) {
          item.fields.forEach((item2) => {
            if (item2.id === fieldMapDependency.sub_field_id) {
              mapField = item2;
            }
          });
        }
      });
      if (mapField) {
        const newChoices: any = [];
        const fieldMapDependencyItem =
          currentChoiceId &&
          fieldMapDependency.field_map_dependency_items.filter(
            (item) => item.parent_value === currentChoiceId,
          )[0];
        if (fieldMapDependencyItem) {
          mapField.choices.forEach((choice) => {
            if (fieldMapDependencyItem.sub_values.indexOf(choice.id) !== -1) {
              newChoices.push(choice);
            }
          });
        }
        const mapFieldValue = refForm.getFieldValue(mapField.name);
        if (
          mapFieldValue &&
          newChoices.filter((item) => item.label === mapFieldValue).length === 0
        ) {
          refForm.setFields([
            {
              name: mapField.name,
              value: null,
            },
          ]);
        }
        setSections((items) => {
          return items.map((item) => {
            return item.category === 'sub_form'
              ? {
                  ...item,
                  fields: item.fields.map((item2, index) => {
                    if (index > 0) {
                      return item2;
                    }

                    return {
                      ...item2,
                      fields: item2.fields.map((item3) =>
                        item3.id === mapField.id ? { ...item3, map_choices: newChoices } : item3,
                      ),
                    };
                  }),
                }
              : {
                  ...item,
                  fields: item.fields.map((item2) =>
                    item2.id === mapField.id ? { ...item2, map_choices: newChoices } : item2,
                  ),
                };
          });
        });
      }
    }
  };

  const onBlur = async (val) => {
    if (customModule[`${field.name}_onBlur`]) {
      await executeEventFunction(`${field.name}_onBlur`, {value: val, allValue: refForm.getFieldsValue(true)});
    }
    
    executeLinkageFunction(field.name, val);

    if (
      Object.keys(actionMap).find(
        (key) =>
          actionMap[key].exec_formula &&
          actionMap[key].exec_formula.reference_fields.indexOf(field.name) !== -1,
      )
    ) {
      executeFormula();
    }
    setDisableEdit([field.name]);
    setHiddenField([field.name]);
  };

  const onSelect = async (selected_data) => {
    if (module === 'SalesSignIn' && selected_data) {
      if (field.name === 'visit_type') {
        const moduleIdValues: any = [
          {
            name: 'module_type',
            value: null,
          },
          {
            name: 'module_data',
            value: null,
          },
          {
            name: moduleId.name,
            value: null,
          }
        ];
        refForm.setFields(moduleIdValues);
        setModuleName('');
        setModuleRule([{
          required: false,
          message: '请选择'
        }]);
      }
      if (field.name === 'module_type') {
        if (selected_data && selected_data.id) {
          const moduleIdValues: any = [
            {
              name: 'module_data',
              value: JSON.stringify(selected_data),
            },
            {
              name: moduleId.name,
              value: selected_data.id,
            }
          ];
          refForm.setFields(moduleIdValues);
        } else {
          setModuleName(selected_data);
          setModuleRule([{
            required: true,
            message: '请选择' + selected_data
          }]);
          const moduleIdValues: any = [
            {
              name: 'module_data',
              value: null,
            },
            {
              name: moduleId.name,
              value: null,
            }
          ];
          refForm.setFields(moduleIdValues);
        }
      }
    } 

    if (customModule[`${field.name}_onSelect`]) {
      // 执行表单事件函数
      await executeEventFunction(`${field.name}_onSelect`, {value: selected_data, allValue: refForm.getFieldsValue(true)});
    }

    if (actionMap[field.name] && actionMap[field.name].set_default_relation_field) {
      // 设置关联字段默认值
      setDefaultRelationField(field.name, selected_data);
    }

    // 执行远程联动方法
    executeLinkageFunction(field.name, selected_data);

    if (field.type === 'Fields::ResourceField') {
      setRelatedResourceField(selected_data);
      fetchAddress(selected_data);
    }

    if (field.type === 'Fields::SelectField') {
      setRelatedSelectField(selected_data);
    }

    if (
      Object.keys(actionMap).find(
        (key) =>
          actionMap[key].exec_formula &&
          actionMap[key].exec_formula.reference_fields.indexOf(field.name) !== -1,
      )
    ) {
      executeFormula();
    }
    
    setDisableEdit([field.name]);
    setHiddenField([field.name]);
  };

  const onDropdown = (values) => {
    if (customModule[`${field.name}_onDropdown`]) {
      executeEventFunction(`${field.name}_onDropdown`, {...values, allValue: refForm.getFieldsValue(true)});
    }
  }

  const getDefaultValue = () => {
    const defaultValue = field.default_value || field.options.default_value || field.options.default_enable;
    if (
      !defaultValue &&
      (field.type === 'Fields::DateField' || field.type === 'Fields::DatetimeField') &&
      field.options.default_current_date
    ) {
      return dayjs();
    }
    if (defaultValue && field.type === 'Fields::MultipleSelectField') {
      return [defaultValue];
    }

    return defaultValue;
  };

  let isDisableEdit = field.is_disable_edit;
  if (field.is_disable_edit && field.disable_edit_condition && field.disable_edit_condition !== '') {
    isDisableEdit = field.disable_edit;
  }
  const isDisable = isDisableEdit || field.accessibility === 'read_only' || !field.can_modify;

  return (
    <View className="form-item">
      <Form.Item
        className='form-item-label'
        label={null}
        name={field.name}
        rules={getRules(field)}
        tooltip={field.is_show_tip && field.tip_type === 'icon' ? field.hint : false}
        initialValue={getDefaultValue()}
      >
        <FormItem
          isDisable={isDisable}
          onBlur={onBlur}
          onSelect={onSelect}
          field={field}
          overloadData={overloadData}
          onDropdown={onDropdown}
        />
      </Form.Item>
      {module === 'SalesSignIn' && field.name === 'module_type' ? (
        <Form.Item
          className='form-item-label'
          label={null}
          name={field.name}
          rules={moduleRule}
        >
          <FormItem
            _rules={moduleRule}
            onSelect={onSelect}
            moduleName={moduleName}
            field={{...moduleId, label: '选择' + moduleName}}
          />
        </Form.Item>
      ) : null}
    </View>
  );
};

// 换行
const FormItem = (props) => {
  const {isDisable, field, _rules} = props;
  // 是否必填
  const is_required = (_rules || getRules(field)).find((item) => item.required);
  const label = field.type === 'Fields::MultipleAttachmentField' || field.type === 'Fields::MultipleImageField' ? '  ' : field.label;
  return (
    <View className={'formItem space-between'} onClick={() => console.log(getRules(field), _rules)}>
      <span className={isDisable ? 'label disable' : 'label'}>
        <span className="required" style={is_required ? {opacity: 1} : {opacity: 0}}>{'*'}</span>
        {label}
      </span>
      <View className={isDisable ? 'element disable' : 'element'}>
        <FormElement
          {...props}
        />
      </View>
    </View>
  );
}