import { Form } from "antd";
import { useContext } from "react";
import { getRules } from "src/utils/utils";
import dayjs from "dayjs";
import FormElement from "../../../FormElement";
import { View } from "@tarojs/components";
import { FormContainerContext } from "../../../../FormContainer";
import classname from 'classnames';

export default (props: any) => {
  const {
    data,
    refForm,
    overloadData,
    setOverloadData,
    fieldMapDependencies,
    actionMap,
    setDefaultRelationField,
    executeFormula,
    executeLinkageFunction,
    executeSumField,
    setDisableEdit,
    customModule,
    executeEventFunction,
    setForceUpdate
  } = useContext<any>(FormContainerContext);
  const {
    record,
    field,
    section,
    index,
  } = props;

  const fields = ((section && section.fields[0].fields) || []).filter(item => item.view.indexOf(data.id ? 'edit' : 'new') !== -1);
  const subFormName = section && section.fields[0].name;

  const setRelatedSelectField = (val) => {
    const fieldMapDependency = (fieldMapDependencies || []).filter(
      (item) => item.parent_field_id === field.id,
    )[0];
    if (fieldMapDependency) {
      const currentChoice = field.choices.filter((choice) => choice.label === val)[0];
      const currentChoiceId = val && currentChoice && currentChoice.id;
      const mapField = fields.filter((item) => item.id === fieldMapDependency.sub_field_id)[0];
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
        const mapFieldValue = refForm.getFieldValue([subFormName, index, mapField.name]);
        if (
          mapFieldValue &&
          newChoices.filter((item) => item.label === mapFieldValue).length === 0
        ) {
          refForm.setFields([
            {
              name: [subFormName, index, mapField.name],
              value: null,
            },
          ]);
        }

        const newOverloadData = { ...overloadData };
        newOverloadData[subFormName] ||= [];
        newOverloadData[subFormName][index] ||= {};
        newOverloadData[subFormName][index][mapField.name] = { choices: newChoices };
        setOverloadData(newOverloadData);
      }
    }
  };

  const setRelatedResourceField = (selected_data) => {
    const fieldMapDependency = (fieldMapDependencies || []).filter(
      (item) => item.parent_field_id === field.id,
    )[0];
    if (fieldMapDependency) {
      const mapField = fields.filter((item) => item.id === fieldMapDependency.sub_field_id)[0];
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
              name: [subFormName, index, mapField.name],
              value: null,
            },
          ]);
        }
        const newOverloadData = { ...overloadData };
        newOverloadData[subFormName] ||= [];
        newOverloadData[subFormName][index] ||= {};
        newOverloadData[subFormName][index][mapField.name] = {
          related_field_search_condition: condition,
        };
        setOverloadData(newOverloadData);
      }
    }
  };

  const onBlur = async (val) => {

    if (customModule[`${subFormName}_${field.name}_onBlur`]) {
      await executeEventFunction(`${subFormName}_${field.name}_onBlur`, {
        value: val,
        currentRow: refForm.getFieldValue([subFormName, index]),
        rowIndex: index,
      }, subFormName, index);
    }

    executeLinkageFunction(`${subFormName}.${field.name}`, val, index);

    if (
      Object.keys(actionMap).find(
        (key) =>
          actionMap[key].exec_formula &&
          actionMap[key].exec_formula.reference_fields.indexOf(`${subFormName}.${field.name}`) !== -1,
      )
    ) {
      executeFormula(subFormName, index);
    }
    
    if (Object.keys(actionMap).find(key => actionMap[key]['sum'] && actionMap[key]['sum'].options.field_key === field.key)) {
      executeSumField(subFormName);
    }

    setDisableEdit([`${subFormName}.${field.name}`], index);
  };

  const onFocus = async () => {
    if (customModule[`${subFormName}_${field.name}_onSelectFocus`]) {
      await executeEventFunction(`${subFormName}_${field.name}_onSelectFocus`, {
        currentRow: refForm.getFieldValue([subFormName, index]),
        rowIndex: index,
      }, subFormName, index);
    }
  }

  const onSelect = async (selected_data) => {
    if (customModule[`${subFormName}_${field.name}_onSelect`]) {
      await executeEventFunction(`${subFormName}_${field.name}_onSelect`, {
        value: selected_data,
        currentRow: refForm.getFieldValue([subFormName, index]),
        rowIndex: index,
      }, subFormName, index);
    }

    if (actionMap[`${subFormName}.${field.name}`] && actionMap[`${subFormName}.${field.name}`].set_default_relation_field) {
      setDefaultRelationField(`${subFormName}.${field.name}`, selected_data, index);
    }

    executeLinkageFunction(`${subFormName}.${field.name}`, selected_data, index);

    if (field.type === 'Fields::ResourceField') {
      setRelatedResourceField(selected_data);
    }

    if (field.type === 'Fields::SelectField') {
      setRelatedSelectField(selected_data);
    }

    if (
      Object.keys(actionMap).find(
        (key) =>
          actionMap[key].exec_formula &&
          actionMap[key].exec_formula.reference_fields.indexOf(`${subFormName}.${field.name}`) !== -1,
      )
    ) {
      executeFormula(subFormName, index);
    }
    
    setDisableEdit([`${subFormName}.${field.name}`], index);
  };

  const onDropdown = (values) => {
    if (customModule[`${subFormName}_${field.name}_onDropdown`]) {
      executeEventFunction(`${subFormName}_${field.name}_onDropdown`, {
        ...values,
        currentRow: refForm.getFieldValue([subFormName, index]),
        rowIndex: index,
      }, subFormName, index);
    }
  }

  const getDefaultValue = () => {
    const defaultValue = field.default_value || field.options.default_value || field.options.default_enable;
    if (!defaultValue && field.type === 'Fields::DateField' && field.options.default_current_date) {
      return dayjs();
    }
    if (defaultValue && field.type === 'Fields::MultipleSelectField') {
      return [defaultValue];
    }

    return defaultValue;
  };

  let isDisableEdit = field.is_disable_edit;

  if (field.is_disable_edit && field.disable_edit_condition && field.disable_edit_condition !== '') {
    if (subFormName) {
      isDisableEdit = refForm.getFieldValue([subFormName, index, `${field.name}_disable_edit`]);
    } else {
      isDisableEdit = field.disable_edit;
    }
  }
  const isDisable = isDisableEdit || field.accessibility === 'read_only' || !field.can_modify || field.is_formula;

  return (
    <View className="form-item">
      <Form.Item
        {...field}
        className='form-item-label'
        name={[record.name, field.name]}
        tooltip={field.is_show_tip && field.tip_type === 'icon' ? field.hint : false }
        label={null}
        initialValue={getDefaultValue()}
        rules={getRules(field)}
        fieldKey={[record.fieldKey, field.name]}
      >
        <FormItem
          subFormName={subFormName}
          isDisable={isDisable}
          index={index}
          overloadData={overloadData}
          field={field}
          onBlur={onBlur}
          onFocus={onFocus}
          onSelect={onSelect}
          onDropdown={onDropdown}
        />
      </Form.Item>
    </View>
  )
}

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
    <View className={itemClass} id={field.name} onClick={() => console.log(field)
    }>
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
  )
}
