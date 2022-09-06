import { useEffect, useContext } from 'react';
import { getRules } from 'src/utils/utils';
import { Form } from 'antd';
import dayjs from 'dayjs';
import FormElement from '../FormElement';
import { FormContainerContext } from '../../FormContainer';
import { View } from "@tarojs/components";
import { getRecordAddresses } from 'src/pages/services/tab';
import classname from 'classnames';

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
    fields,
    refForm,
    fieldMapDependencies,
    setSections,
    addresses,
    setAddresses,
    data,
    overloadData,
    actionMap,
    setDefaultRelationField,
    executeFormula,
    executeLinkageFunction,
    setDisableEdit,
    setHiddenField,
    customModule,
    executeEventFunction,
  } = useContext<any>(FormContainerContext);
  const { field, options } = props;

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

  useEffect(() => {
    if (field.type === 'Fields::ResourceField' && data.id) {
      fetchAddress({ id: data[field.name] });
    }
  }, [data]);

  const setRelatedResourceField = (selected_data) => {
    const fieldMapDependency = (fieldMapDependencies || []).filter(
      (item) => item.parent_field_id === field.id,
    )[0];
    if (fieldMapDependency) {
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

  const onFocus = async () => {
    if (customModule[`${field.name}_onSelectFocus`]) {
      await executeEventFunction(`${field.name}_onSelectFocus`, {allValue: refForm.getFieldsValue(true)});
    }
  }

  const onBlur = async (val) => {
    console.log('customModule', customModule);
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
    if (customModule[`${field.name}_onSelect`]) {
      await executeEventFunction(`${field.name}_onSelect`, {value: selected_data, allValue: refForm.getFieldsValue(true)});
    }

    if (actionMap[field.name] && actionMap[field.name].set_default_relation_field) {
      setDefaultRelationField(field.name, selected_data);
    }

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
  const isDisable = isDisableEdit || field.accessibility === 'read_only' || !field.can_modify || field.is_formula;

  return (
    <View>
      {field.type === 'Fields::SumField' ? (
        <Form.Item
          label={null}
          name={field.name}
          tooltip={field.is_show_tip && field.tip_type === 'icon' ? field.hint : false}
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 8 }}
          initialValue={getDefaultValue() || 0}
          {...options}
        >
          <FormItem
            isDisable={isDisable}
            onBlur={onBlur}
            onSelect={onSelect}
            onFocus={onFocus}
            field={field}
            overloadData={overloadData}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label={null}
          name={field.name}
          rules={getRules(field)}
          tooltip={field.is_show_tip && field.tip_type === 'icon' ? field.hint : false}
          initialValue={getDefaultValue()}
          {...formItemLayout}
          {...options}
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
      )}
    </View>
  );
};

// 换行
const FormItem = (props) => {
  const {isDisable, field} = props;
  // 是否必填
  const is_required = getRules(field).find((item) => item.required);
  const label = field.type === 'Fields::MultipleAttachmentField' || field.type === 'Fields::MultipleImageField' ? '  ' : field.label;
  const itemClass = classname({
    'form-container-container-base-item': true,
    disable: isDisable,
  })

  return (
    <View className={itemClass} id={field.name} onClick={() => console.log('props', props)}>
      <span className="form-container-container-base-item-label">
        {label}
      </span>
      <div className="form-container-container-base-item-required" style={{opacity: is_required ? 1 : 0}} />
      <View className="form-container-container-base-item-element">
        <FormElement
          {...props}
        />
      </View>
    </View>
  );
}