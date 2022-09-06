import { useState, useEffect, createContext, useRef } from 'react';
import {
  Form,
  message,
  Modal,
} from 'antd';
import { formatFormData, initFormData } from "src/utils/format";
import { calcFieldValue, getLayoutRuleResult } from "src/utils/utils";
import { deleteAttachment, getSubRows, uploadAttachment, updateData, cloneAttachment, createData, invokeValidateFunction, getCustomFormJs, invokeLinkageFunction } from "../../service";
import { calcFormulaValue } from "src/utils/custom_function";
import Section from '../Section';
import { netcloud } from './custom_api';
import { View, Text } from "@tarojs/components";
import { NavBar } from "antd-mobile";
import "antd/dist/antd.css";
import { excutePromotionRule } from './promotion_service';
import Taro from '@tarojs/taro';
import moment from 'moment';

const matchKey = (str: string, main_key: string, sub_key?: string) => {
  if (sub_key) {
    if (str.indexOf(`object['${main_key}']['${sub_key}']`) !== -1) {
      return `object['${main_key}']['${sub_key}']`;
    }
    if (str.indexOf(`object["${main_key}"]["${sub_key}"]`) !== -1) {
      return `object["${main_key}"]["${sub_key}"]`;
    }
  } else {
    if (str.indexOf(`object['${main_key}']`) !== -1) {
      return `object['${main_key}']`;
    }
    if (str.indexOf(`object["${main_key}"]`) !== -1) {
      return `object["${main_key}"]`;
    }
  }

  return null;
}

const assiginObj = (target:any = {}, sources = {}) => {
  let obj = target;
  if(typeof target != 'object' || typeof sources != 'object'){
    return sources; // 如果其中一个不是对象 就返回sources
  }
  for(let key in sources){ 
    // 如果target也存在 那就再次合并
    if(target.hasOwnProperty(key)){
      obj[key] = assiginObj(target[key], sources[key]);
    } else {
      // 不存在就直接添加
      obj[key] = sources[key];
    }
  }
  return obj;
}

const alert = (content) => {
  Modal.info({
    content: <div dangerouslySetInnerHTML={{__html: content}} />,
    icon: null,
    okText: "确定"
  });
}

const fixCode = `
  let netcloud = null;
  let params = {};
  let form = null;
  let currentUser = null;
  let moment = undefined;
  let message = undefined;
  let alert = undefined;
  let hidden = undefined;
  let disable = undefined;
  let hiddenSubRowAdd = undefined;
  let hiddenSubRowDelete = undefined;
  export function initModule(option) {
    netcloud = option.api;
    params = option.params;
    form = option.form;
    currentUser = option.currentUser;
    moment = option.moment;
    message = option.message;
    alert = option.alert;
    hidden = option.hidden;
    disable = option.disable;
    hiddenSubRowAdd = option.hiddenSubRowAdd;
    hiddenSubRowDelete = option.hiddenSubRowDelete;
  }
`

export const FormContainerContext = createContext({});
export default (props) => {
  const { form, sections, setSections, data, customSubmit, layoutRules, params, currentUser, title } = props;
  const [loading, setLoading] = useState(false);
  
  const [addresses, setAddresses] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);
  const [overloadData, setOverloadData] = useState({});
  const [step, setStep] = useState(0);
  const [refForm] = Form.useForm();
  const productsRef = useRef({});
  const promotionsRef = useRef({});
  const orderPromotionRef = useRef();
  const fields = sections.map((section) => section.fields).flat();
  const [actionMap, setActionMap] = useState({});
  const [customModule, setCustomModule] = useState<any>();
  const [actionMapInit, setActionMapInit] = useState(false);
  const [subFormOptions, setSubFormOptions] = useState({});

  useEffect(() => {
    if (form.id) {
      getCustomFormJs({form_id: form.id}).then(res => {
        if (res.data) {
          const codes = fixCode + res.data.datas.map(item => item.content).join("\n");
          new Function(`
            const objectURL = URL.createObjectURL(new Blob([\`${codes}\`], { type: 'text/javascript' }));
            return import(objectURL)
          `)().then(module => {
            // console.log(module, "Module")
            module.initModule({
              api: netcloud, 
              form: refForm, 
              currentUser,
              hidden: (fieldNames) => {
                setDisableOrHidden(fieldNames, 'hidden');
              },
              disable: (fieldNames) => {
                setDisableOrHidden(fieldNames, 'disable');
              },
              hiddenSubRowAdd: (subFormName, rowIndexes) => {
                const newOption = {};
                newOption[`${subFormName}_hidden_add`] = rowIndexes;
                setSubFormOptions(option => {
                  return {...option, ...newOption};
                });
              },
              hiddenSubRowDelete: (subFormName, rowIndexes) => {
                const newOption = {};
                newOption[`${subFormName}_hidden_delete`] = rowIndexes;
                setSubFormOptions(option => {
                  return {...option, ...newOption};
                });
              },
              moment, 
              params, 
              message, 
              alert
            });
            setCustomModule(module);
          })
        }
      })
    }
  },[form])

  // 设置各种字段联动配置
  useEffect(() => {
    if (sections.length > 0) {
      const tempFields: any = [];
      fields.forEach(item => {
        if (item.type === "Fields::NestedFormField") {
          item.fields.forEach(subItem => {
            tempFields.push([item, {...subItem, sub_form_name: item.name}]);
          })
        } else {
          tempFields.push([item, null]);
        }
      })

      const fieldMap:any  = {};
      tempFields.forEach(tempField => {
        const [main_field, sub_field] = tempField;
        const field = sub_field ? sub_field : main_field;
        if (field.is_default_relation_field && field.default_relation_field[0]) {
          // 设置关联字段默认值
          const default_relation_field = (sub_field ? main_field.fields : fields).find(item => item.key === field.default_relation_field[0]);
          if (default_relation_field) {
            const key = sub_field ? `${main_field.name}.${default_relation_field.name}` : default_relation_field.name;
            fieldMap[key] ||= {};
            fieldMap[key]['set_default_relation_field'] ||= [];
            fieldMap[key]['set_default_relation_field'].push(field);
          }
        } 
        
        if (field.linkage_function) {
          // 设置onchange远程联动
          const key = sub_field ? `${main_field.name}.${sub_field.name}` : main_field.name;
          fieldMap[key] ||= {};
          fieldMap[key]['invoke_linkage_function'] = field;
        } 
        
        if (field.is_formula && field.formula) {
          // 设置公式字段
          const key = sub_field ? `${main_field.name}.${sub_field.name}` : main_field.name;
          fieldMap[key] ||= {};
          fieldMap[key]['exec_formula'] = {formula: field.formula, reference_fields: [], field};
          fields.forEach(item => {
            if (item.type === "Fields::NestedFormField") {
              item.fields.forEach(subItem => {
                const keyName = matchKey(field.formula, item.label, subItem.label);
                if (keyName) {
                  fieldMap[key]['exec_formula'].reference_fields.push(`${item.name}.${subItem.name}`);
                  fieldMap[key]['exec_formula'].formula = fieldMap[key]['exec_formula'].formula.replaceAll(keyName, `object['${item.name}']['${subItem.name}']`)
                }
              })
            } else {
              const keyName = matchKey(field.formula, item.label);
              if (keyName) {
                fieldMap[key]['exec_formula'].reference_fields.push(item.name);
                fieldMap[key]['exec_formula'].formula = fieldMap[key]['exec_formula'].formula.replaceAll(keyName, `object['${item.name}']`)
              }
            }
          })
        } 
        
        if (field.is_disable_edit && field.disable_edit_condition) {
          // 设置字段禁用
          fields.forEach(item => {
            if (item.type === "Fields::NestedFormField") {
              item.fields.forEach(subItem => {
                if (field.disable_edit_condition.indexOf(`[${item.label}.${subItem.label}]`) !== -1) {
                  const key = `${item.name}.${subItem.name}`;
                  fieldMap[key] ||= {};
                  fieldMap[key]['disable_edit'] ||= [];
                  fieldMap[key]['disable_edit'].push(field);
                }
              })
            } else {
              if (field.disable_edit_condition.indexOf(`[${item.label}]`) !== -1) {
                fieldMap[item.name] ||= {};
                fieldMap[item.name]['disable_edit'] ||= [];
                fieldMap[item.name]['disable_edit'].push(field);
              }
            }
          })
        } 
        
        if (field.hidden_condition) {
          // 设置隐藏字段
          fields.forEach(item => {
            if (item.type !== "Fields::NestedFormField") {
              if (field.hidden_condition.indexOf(`[${item.label}]`) !== -1) {
                fieldMap[item.name] ||= {};
                fieldMap[item.name]['hidden'] ||= [];
                fieldMap[item.name]['hidden'].push(field);
              }
            }
          })
        }
        
        if (field.type === "Fields::SumField") {
          // 设置求和字段
          sections.filter(item => item.category === "sub_form").forEach(section => {
            if (section.fields.find(item => item.id === field.id)) {
              const relation_field = section.fields[0].fields.find(subItem => subItem.key === field.options.field_key);
              if (relation_field) {
                const key = `${section.fields[0].name}.${relation_field.name}`
                fieldMap[key] ||= {};
                fieldMap[key]['sum'] = field;
              }
            }
          })
        }
      })

      // 布局规则
      layoutRules.forEach(layoutRule => {
        layoutRule.conditions.forEach(condition => {
          const changeField = fields.find(item => item.id === condition.field_id);
          if (changeField) {
            fieldMap[changeField.name] ||= {};
            fieldMap[changeField.name]['layout_rule'] ||= [];
            if (!fieldMap[changeField.name]['layout_rule'].find(item => item.id === layoutRule.id)) {
              fieldMap[changeField.name]['layout_rule'].push(layoutRule);
            }
          }
        })
      })

      console.log(fieldMap, "actionMapactionMapactionMapactionMap")
      setActionMap(fieldMap);
      setActionMapInit(true);
    }
  },[sections])

  // 设置关联字段默认值
  const setDefaultRelationField = (fieldkey, selected_data, rowIndex = -1) => {
    console.log('fieldkey', fieldkey);
    if (actionMap[fieldkey]) {
      console.log("setDefaultRelationField");
      const changeFields: any = [];
      const changeValues: any = [];
      const [fieldName, subFieldName] = fieldkey.split(".");
      actionMap[fieldkey]['set_default_relation_field'].forEach(item => {
        const currentValue = selected_data ? selected_data[item.default_relation_field[1]] : null;
        changeValues.push({
          name: subFieldName && rowIndex >= 0 ? [fieldName, rowIndex, item.name] : item.name,
          value: currentValue && (typeof currentValue === 'object') ? currentValue.id : currentValue,
        })
        changeFields.push(subFieldName && rowIndex >= 0 ? `${fieldName}.${item.name}` : item.name);
      })
      refForm.setFields(changeValues);

      // 触发公式计算
      if (Object.keys(actionMap).find(key => actionMap[key]['exec_formula'] && actionMap[key]['exec_formula'].reference_fields.filter(i => changeFields.indexOf(i) !== -1).length > 0)) {
        console.log("setDefaultRelationField","executeFormula");
        if (subFieldName && rowIndex >= 0) {
          executeFormula(fieldName, rowIndex);
        } else {
          executeFormula();
        }
      }
      
      console.log("setDefaultRelationField","setDisableEdit");
      if (subFieldName && rowIndex >= 0) {
        setDisableEdit(changeFields, rowIndex);
      } else {
        setDisableEdit(changeFields);
        setHiddenField(changeFields);
        executeFieldMapLayoutRule(changeFields);
      }
     
      // 触发求和计算
      if (subFieldName && rowIndex >= 0 && Object.keys(actionMap).filter(key => actionMap[key]['sum'] && changeFields.indexOf(key) !== -1).length > 0) {
        console.log("setDefaultRelationField","executeSumField");
        executeSumField(fieldName);
      }
    }
  }

  // 执行表单事件函数
  const executeEventFunction = (func_name, values, subFormName = null, rowIndex = -1) => {
    return new Promise((resolve: any) => {
      customModule[func_name](values).then(res => {
        console.log(res, "changeFields")
        const changeFields = res;
        if (changeFields && Array.isArray(changeFields) && changeFields.length > 0) {
          // 触发公式计算
          if (Object.keys(actionMap).find(key => actionMap[key]['exec_formula'] && actionMap[key]['exec_formula'].reference_fields.filter(i => changeFields.indexOf(i) !== -1).length > 0)) {
            console.log("executeEventFunction", "executeFormula");
            if (subFormName && rowIndex >= 0) {
              executeFormula(subFormName, rowIndex);
            } else {
              executeFormula();
            }
          }
          console.log("executeEventFunction", "setDisableEdit");
          // 触发禁用
          if (subFormName && rowIndex >= 0) {
            setDisableEdit(changeFields, rowIndex);
          } else {
            setDisableEdit(changeFields);
            // 触发隐藏
            setHiddenField(changeFields);
            // 执行布局规则
            executeFieldMapLayoutRule(changeFields);
          }

          // 触发求和计算
          if (subFormName && rowIndex >= 0 && Object.keys(actionMap).filter(key => actionMap[key]['sum'] && changeFields.indexOf(key) !== -1).length > 0) {
            console.log("executeEventFunction", "executeSumField");
            executeSumField(subFormName);
          }

           // 触发布局规则
           if (layoutRules.length > 0) {
            const changedValues = {};
            changeFields.forEach(key => {
              changedValues[key] = null;
            })
            setFieldsOrSectionsVisiable(changedValues, refForm.getFieldsValue(true));
          }
        }

        resolve()
      })
    });
  }

  // 执行远程联动方法
  const executeLinkageFunction = (fieldkey, val, rowIndex = -1) => {
    if (actionMap[fieldkey] && actionMap[fieldkey]['invoke_linkage_function']) {
      console.log("executeLinkageFunction");
      const [subFormName, subFieldName] = fieldkey.split(".");
      const field = actionMap[fieldkey]['invoke_linkage_function'];
      const allValues = formatFormData(refForm.getFieldsValue(true), fields, true);
      const mainData = {};
      let changeFields: any = [];
      fields.forEach((item) => {
        if (item.type !== 'Fields::NestedFormField' && allValues[item.name]) {
          mainData[item.name] = allValues[item.name];
        }
      });
      const params = {
        custom_function_id: field.linkage_function,
        form_id: form.id,
        trigger_field: subFieldName && rowIndex >= 0 ? 'sub_field' : 'main_field',
        field_value: val,
        main_data: mainData,
        current_row: subFieldName && rowIndex >= 0 ? refForm.getFieldValue([subFormName, rowIndex]) : null,
      };
      console.log(params, 'invokeLinkageFunctionParams');
      invokeLinkageFunction(params).then((res) => {
        console.log(res, 'invokeLinkageFunctionResult');
        if (res.code === 200 && res.data && res.data.result && typeof res.data.result === 'object') {
          const newOverloadData = {};
          const messageErrors: any = [];
          const ruleMessages: any = [];
          Object.keys(res.data.result).forEach((key: any) => {
            if (key.indexOf("_SETTING") !== -1) {
              const fieldName = key.replaceAll("_SETTING", "");
              newOverloadData[fieldName] = res.data.result[key];
            } else if (key.indexOf("_ERROR") !== -1) {
              const fieldName = key.replaceAll("_ERROR", "");
              const error = res.data.result[key];
              if (error.type === 'alert') {
                messageErrors.push(error.message || "error");
              } else {
                ruleMessages.push({name: fieldName, errors: [error.message || "error"]});
              }
            }
          })
          const updateValues = initFormData(res.data.result, fields, true);
          changeFields = Object.keys(updateValues);
          refForm.setFieldsValue(updateValues);
          if (subFieldName && rowIndex >= 0 && res.data.result.row_data) {
            Object.keys(res.data.result.row_data).forEach((key: any) => {
              if (key.indexOf("_SETTING") !== -1) {
                const fieldName = key.replaceAll("_SETTING", "");
                newOverloadData[subFormName] ||= [];
                newOverloadData[subFormName][rowIndex] ||= {};
                newOverloadData[subFormName][rowIndex][fieldName] = res.data.result.row_data[key];
              } else if (key.indexOf("_ERROR") !== -1) {
                const fieldName = key.replaceAll("_ERROR", "");
                const error = res.data.result.row_data[key];
                if (error.type === 'alert') {
                  messageErrors.push(error.message || "error");
                } else {
                  ruleMessages.push({name: [subFormName, rowIndex, fieldName], errors: [error.message || "error"]});
                }
              }
            })
    
            const subField = fields.find(item => item.name === subFormName);
            if (subField) {
              const updateColumns: any = [];
              const formatRowData = initFormData(res.data.result.row_data, subField.fields, true);
              Object.keys(formatRowData).forEach((key) => {
                changeFields.push(`${subFormName}.${key}`);
                updateColumns.push({
                  name: [subFormName, rowIndex, key],
                  value: formatRowData[key],
                });
              });
              refForm.setFields(updateColumns); 
            }
          }
          setOverloadData(item => {
            return assiginObj(newOverloadData, item);
          });
          if (ruleMessages.length > 0) {
            refForm.setFields(ruleMessages);
          }
          messageErrors.forEach(item => {
            message.error(item);
          })

          // 触发公式计算
          if (Object.keys(actionMap).find(key => actionMap[key]['exec_formula'] && actionMap[key]['exec_formula'].reference_fields.filter(i => changeFields.indexOf(i) !== -1).length > 0)) {
            console.log("executeLinkageFunction", "executeFormula");
            if (subFieldName && rowIndex >= 0) {
              executeFormula(subFormName, rowIndex);
            } else {
              executeFormula();
            }
          }

          console.log("executeLinkageFunction", "setDisableEdit");
          // 触发禁用
          if (subFieldName && rowIndex >= 0) {
            setDisableEdit(changeFields, rowIndex);
          } else {
            setDisableEdit(changeFields);
            // 触发隐藏
            setHiddenField(changeFields);
             // 执行布局规则
            executeFieldMapLayoutRule(changeFields);
          }

          // 触发求和计算
          if (subFieldName && rowIndex >= 0 && Object.keys(actionMap).filter(key => actionMap[key]['sum'] && changeFields.indexOf(key) !== -1).length > 0) {
            console.log("executeLinkageFunction", "executeSumField");
            executeSumField(subFormName);
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  // 执行自定义函数字段
  const executeFormula = (subFormName = null, rowIndex = -1, ignoreSum = false) => {
    console.log("executeFormula");
    const allValues = formatFormData(refForm.getFieldsValue(true) || {}, fields, true);
    const baseFields: any = {};
    const formulaFields = {};
    if (subFormName && rowIndex >= 0) {
      Object.keys(actionMap).filter(key => actionMap[key]['exec_formula'] && key.indexOf('.') !== -1 && key.split('.')[0] === subFormName).forEach(key => formulaFields[key] = actionMap[key]['exec_formula']);
      const subFormField = fields.find(item => item.name === subFormName);
      if (subFormField) {
        fields.filter(item => item.type !== 'Fields::NestedFormField').forEach(item => baseFields[item.name] = allValues[item.name]);
        baseFields[subFormName] = {};
        subFormField.fields.filter(item => !item.is_formula).forEach(item => baseFields[subFormName][item.name] = allValues[subFormName][rowIndex][item.name]);
        const result = calcFormulaValue(baseFields, formulaFields);
        refForm.setFields(Object.keys(result).map((key) => {
          return {
            name: [subFormName, rowIndex, key],
            value: result[key],
          }
        }));
        if (!ignoreSum) {
          console.log("executeFormula","executeSumField",'sub')
          executeSumField(subFormName);
        }

        console.log("executeFormula","setDisableEdit",'sub');
        // 触发禁用
        setDisableEdit(Object.keys(formulaFields), rowIndex);
      }
    } else {
      Object.keys(actionMap).filter(key => actionMap[key]['exec_formula'] && key.indexOf('.') === -1).forEach(key => formulaFields[key] = actionMap[key]['exec_formula']);
      fields.filter(item => item.type !== 'Fields::NestedFormField' && !item.is_formula).forEach(item => baseFields[item.name] = allValues[item.name]);
      const result = calcFormulaValue(baseFields, formulaFields);
      refForm.setFields(Object.keys(result).map((key) => {
        baseFields[key] = result[key];
        return { name: key, value: result[key] };
      }));
      console.log("executeFormula","setDisableEdit",'main');
      // 触发禁用
      setDisableEdit(Object.keys(formulaFields));
        // 触发隐藏
      setHiddenField(Object.keys(formulaFields));
      // 执行布局规则
      executeFieldMapLayoutRule(Object.keys(formulaFields));

      const subFormulaFields = {};
      Object.keys(actionMap).filter(key => actionMap[key]['exec_formula']).forEach(key => {
        if (key.indexOf('.') !== -1 && actionMap[key]['exec_formula'].reference_fields.filter(item => item.indexOf('.') === -1).length > 0) {
          subFormulaFields[key] = actionMap[key]['exec_formula'];
        }
      });
      Object.keys(subFormulaFields).forEach(key => {
        const subformname = key.split('.')[0];
        if ((allValues[subformname] || []).length === 0) {
          return;
        }

        const subFormField = fields.find(item => item.name === subformname);
        if (subFormField) {
          const newRows: any = [];
          (allValues[subformname] || []).forEach(row => {
            baseFields[subformname] = {};
            subFormField.fields.forEach(item => {
              if (!item.is_formula || row[item.name]) {
                baseFields[subformname][item.name] = row[item.name]
              }
            });
            const result = calcFormulaValue(baseFields, subFormulaFields);
            newRows.push({ ...row, ...result });
          })
          refForm.setFields([{ name: subformname, value: newRows }]);
          if (!ignoreSum) {
            console.log("executeFormula","executeSumField",'main_sub')
            executeSumField(subformname);
          }

          newRows.forEach((_, index) => {
            console.log("executeFormula","setDisableEdit",'main_sub');
            // 触发禁用
            setDisableEdit(Object.keys(subFormulaFields), index);
          })
        }
      })
    }
  }

  // 设置字段禁用
  const setDisableEdit = (fieldkeys, rowIndex = -1, values = null) => {
    const allValues = values || formatFormData(refForm.getFieldsValue(true) || {}, fields, true);
    fieldkeys.forEach(fieldkey => {
      if (actionMap[fieldkey] && actionMap[fieldkey]['disable_edit']) {
        const [subFormName, subFieldName] = fieldkey.split(".");
        if (subFieldName && rowIndex < 0) {
          return;
        }
        console.log("setDisableEdit", fieldkeys, subFieldName, rowIndex);
        if (subFieldName && rowIndex >= 0) {
          const subFormField = fields.find(item => item.name === subFormName)
          actionMap[fieldkey]['disable_edit'].forEach(item => {
            const calcResult = calcFieldValue(item.disable_edit_condition, fields, allValues, subFormField && subFormField.label, allValues[subFormName][rowIndex]);
            refForm.setFields([
              {
                name: [subFormName, rowIndex, `${item.name}_disable_edit`],
                value: calcResult,
              },
            ]);
            setForceUpdate(i => i + 1);
          })
        } else {
          actionMap[fieldkey]['disable_edit'].forEach(i => {
            if (i.sub_form_name) {
              console.log("sub_form_name", i.sub_form_name);
              const subFormName = i.sub_form_name;
              const subFormField = fields.filter(item => item.name === subFormName)[0];
              (allValues[subFormName] || []).forEach((_, index) => {
                const calcResult = calcFieldValue(i.disable_edit_condition, fields, allValues, subFormField && subFormField.label, allValues[subFormName][index]);
                refForm.setFields([
                  {
                    name: [subFormName, index, `${i.name}_disable_edit`],
                    value: calcResult,
                  },
                ]);
                setForceUpdate(num => num + 1);
              })
            } else {
              const calcResult = calcFieldValue(i.disable_edit_condition, fields, allValues);
              setSections((items) => {
                return items.map((item) => {
                  return item.category === 'sub_form'
                    ? item
                    : {
                        ...item,
                        fields: item.fields.map((item2) =>
                          item2.id === i.id
                            ? { ...item2, disable_edit: calcResult }
                            : item2,
                        ),
                      };
                })
              });
            }
          })
        }
      }
    })
  }

  // 设置字段隐藏
  const setHiddenField = (fieldkeys, values = null) => {
    const allValues = values || formatFormData(refForm.getFieldsValue(true) || {}, fields, true);
    fieldkeys.forEach(fieldkey => {
      if (actionMap[fieldkey] && actionMap[fieldkey]['hidden']) {
        console.log("setHiddenField", fieldkeys);
        const hiddenFields:any = {};
        actionMap[fieldkey]['hidden'].forEach(i => {
          const calcResult = calcFieldValue(i.hidden_condition, fields, allValues);
          hiddenFields[i.id] = calcResult;
        })
        if (Object.keys(hiddenFields).length > 0) {
          setSections((items) => {
            return items.map((item) => {
              return item.category === 'sub_form'
                ? item
                : {
                    ...item,
                    fields: item.fields.map((item2) =>
                      Object.keys(hiddenFields).indexOf(item2.id) !== -1
                        ? { ...item2, hidden: hiddenFields[item2.id] }
                        : item2,
                    ),
                  };
            })
          });
        }
      }
    })
  }

  const executeFieldMapLayoutRule = (fieldkeys, values = null) => {
    const allValues = values || formatFormData(refForm.getFieldsValue(true) || {}, fields, true);
    fieldkeys.forEach(fieldkey => {
      if (actionMap[fieldkey] && actionMap[fieldkey]['layout_rule']) {
        actionMap[fieldkey]['layout_rule'].forEach(layoutRule => {
          executeLayoutRule(layoutRule, allValues);
        })
      }
    })
  }

  const setDisableOrHidden = (fieldNames, type) => {
    const mainFields:any = [];
    const subFields:any = [];
    fieldNames.forEach(key => {
      if (key.split('.').length === 3) {
        subFields.push(key.split('.'));
      } else {
        mainFields.push(key);
      }
    })
    if (mainFields.length > 0) {
      setSections((items) => {
        return items.map((item) => {
          return item.category === 'sub_form'
            ? item
            : {
                ...item,
                fields: item.fields.map((item2) => {
                  const newItem = item2;
                  if (mainFields.indexOf(item2.name) !== -1) {
                    if (type === 'hidden') {
                      newItem['hidden'] = true;
                    } else if (type === 'disable') {
                      newItem['disable_edit'] = true;
                    }
                  }
                  return newItem;
                }),
              };
        })
      });
    }

    if (subFields.length > 0) {
      const newOverloadData:any = {};
      subFields.forEach(item => {
        newOverloadData[item[0]] ||= [];
        newOverloadData[item[0]][item[1]] ||= {};
        newOverloadData[item[0]][item[1]][item[2]] ||= {};
        newOverloadData[item[0]][item[1]][item[2]]['disable'] = true;
      })
      if (Object.keys(newOverloadData).length > 0) {
        setOverloadData(item => {
          return assiginObj(newOverloadData, item);
        });
      }
    }
  }

  // 执行求和字段
  const executeSumField = (subFormName) => {
    const sumKeys = Object.keys(actionMap).filter(key => actionMap[key]['sum'] && key.split('.')[0] === subFormName);
    if (sumKeys.length > 0) {
      console.log("executeSumField");
      const subFormRows = refForm.getFieldValue(subFormName) || [];
      const sumFieldNames:any = [];
      sumKeys.forEach(sumKey => {
        const sumField = actionMap[sumKey]['sum'];
        const subFieldName = sumKey.split('.')[1];
        const newValue:any = {};
        sumFieldNames.push(sumField.name);
        newValue[sumField.name] = 0;
        subFormRows.forEach((row) => {
          if (row) {
            newValue[sumField.name] += parseFloat(row[subFieldName] || 0);
          }
        });
        const precision = Math.pow(10, sumField.options.decimal_places || 2);
        if (sumField.options.round_option === "round_up") {
          newValue[sumField.name] = Math.ceil(newValue[sumField.name] * precision) / precision;
        } else if (sumField.options.round_option === "round_down") {
          newValue[sumField.name] = Math.floor(newValue[sumField.name] * precision) / precision;
        } else {
          newValue[sumField.name] = Math.round(newValue[sumField.name] * precision) / precision;
        }
        refForm.setFieldsValue(newValue);
        if (Object.keys(actionMap).find(key => actionMap[key].exec_formula && actionMap[key].exec_formula.reference_fields.indexOf(sumField.name) !== -1)) {
          console.log("executeSumField","executeFormula")
          executeFormula(null, -1, true);
        }
      })
      console.log("executeSumField","setDisableEdit")
      // 触发禁用
      setDisableEdit(sumFieldNames);
      // 触发隐藏
      setHiddenField(sumFieldNames);
      // 执行布局规则
      executeFieldMapLayoutRule(sumFieldNames);
    }
  }

  // 执行布局规则
  const executeLayoutRule = (layoutRule, allValues) => {
    const [newSections, clearValues] = getLayoutRuleResult(layoutRule, {...data, ...allValues}, sections);
    refForm.setFieldsValue(clearValues);
    setSections(newSections);
  }

  const initForm = async () => {
    let newData = data;
    if (customModule['onLoad']) {
      await customModule['onLoad'](data).then(res => {
        if (!params['id'] && res && typeof res === 'object' && !Array.isArray(res)) {
          newData = res;
        }
        console.log(newData, "00000")
      })
    } 
    if (Object.keys(newData).length > 0) {
      refForm.setFieldsValue(newData);
    }
    const newAllValues = refForm.getFieldsValue(true);
    if (Object.keys(newAllValues).length > 0) {
      layoutRules.forEach(layoutRule => {
        executeLayoutRule(layoutRule, newAllValues);
      })

      const mapKeys = Object.keys(actionMap);
      console.log(mapKeys)
      if (mapKeys.length > 0) {
        const mainDisableEditKeys: Array<any>  = [];
        const mainHiddenKeys: Array<any> = [];
        const subDisableEditKeys = {};
        mapKeys.forEach((key) => {
          const [fieldName, subFieldName] = key.split(".");
          if (actionMap[key]['disable_edit']) {
            if (subFieldName) {
              subDisableEditKeys[fieldName] ||= [];
              subDisableEditKeys[fieldName].push(key);
            } else {
              mainDisableEditKeys.push(key);
            }
          }
          if (actionMap[key]['hidden']) {
            mainHiddenKeys.push(key);
          }
        })
        if (mainDisableEditKeys.length > 0) {
          setDisableEdit(mainDisableEditKeys, -1, newAllValues);
        }
        if (Object.keys(subDisableEditKeys).length > 0) {
          Object.keys(subDisableEditKeys).forEach(key => {
            (newAllValues[key] || []).forEach((_, index) => {
              setDisableEdit(subDisableEditKeys[key], index, newAllValues);
            })
          })
        }
        if (mainHiddenKeys.length > 0) {
          setHiddenField(mainHiddenKeys, newAllValues);
        }
      }
    }
  }

  useEffect(() => {
    if (customModule && actionMapInit) {
      initForm();
    }
  }, [data, customModule, actionMapInit]);

  const submitForm = () => {
    if (loading) return;
    refForm.validateFields().then(values => {
      onFinish(values);
    }).catch(errorInfo => {
      message.error(errorInfo.errorFields[0].errors);
      let valueName = document.getElementById(errorInfo.errorFields[0].name[0]);
      if (valueName) {
        valueName.scrollIntoView();
      }
    })
  }

  const setErrors = (values, data_errors) => {
    const errors = Object.keys(data_errors).map((key) => {
      let item:any = {};
      if (key.indexOf('.') !== -1) {
        const name: any = key.split('.');
        name[1] = parseInt(name[1]);
        item = {
          name,
          value: values[name[0]][name[1]][name[2]],
          errors: [data_errors[key][0]],
        };
      } else {
        item = {
          name: key,
          value: values[key],
          errors: [data_errors[key][0]],
        };
      }
      return item;
    });
    Object.keys(values).forEach(key => {
      const error = errors.filter((item) => item.name === key)[0];
      if (!error) {
        errors.push({
          name: key,
          value: values[key],
          errors: [],
        })
      }
    })

    refForm.setFields(errors);
  };

  const uploadFiles = async (id, attachments) => {
    if (attachments) {
      const keys = Object.keys(attachments);
      for(let j = 0; j < keys.length; j++) {
        const key = keys[j];
        for(let k = 0; k < (attachments[key] || []).length; k++) {
          const file = attachments[key][k];
          if (file.delete) {
            await deleteAttachment(file.id)
          } else if (file.originFileObj) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('file', file.originFileObj);
            formData.append('field_id', key);
            await uploadAttachment(form.name, formData);
          } else if (file.id && file.parent_id && file.parent_id !== id) {
            await cloneAttachment(form.name, {id, field_id: key, attachment_id: file.id});
          }
        }
      }
    }
  }

  const uploadSubFiles = async (id, subAttachments) => {
    const keys = Object.keys(subAttachments);
    for(let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (subAttachments[key]) {
        await getSubRows(form.name, {id: id, sub_form_name: key, page: 1, per_page: 100}).then(async res => {
          if (res.data) {
            const subRows = res.data[key];
            for(let i = 0; i < subRows.length; i++) {
              const row = subRows[i];
              await uploadFiles(row.id, subAttachments[key][row.key]);
            }
          }
        })
      }
    }
  }

  const setFieldsOrSectionsVisiable = (changedValues, allValues) => {
    const changeField = fields.filter(item => item.name === Object.keys(changedValues)[0])[0];
    if (changeField && changeField.type !== 'Fields::NestedFormField') {
      layoutRules.forEach(layoutRule => {
        if (layoutRule.conditions.filter(condition => condition.field_id === changeField.id)[0]) {
          console.log(layoutRule, allValues);
          executeLayoutRule(layoutRule, allValues);
        }
      })
    }
  }
  const onFinish = (values: any) => {
    if (form.validate_function_id) {
      invokeValidateFunction({
        custom_function_id: form.validate_function_id, 
        form_id: form.id,
        params: values
      }).then(res => {
        if (res.data && res.data.result && Object.keys(res.data.result).length > 0) {
          const errors:any = [];
          Object.keys(res.data.result).forEach(key => {
            errors.push({
              name: key,
              value: values[key],
              errors: [res.data.result[key]],
            })
          })
      
          refForm.setFields(errors);
        } else {
          submit(values);
        }
      })
    } else if (customModule['onSubmit']) {
      customModule['onSubmit'](values).then(res => {
        if (res === true) {
          submit(values);
        }
      });
    } else {
      submit(values);
    }
  }

  const submit = (values) => {
    setLoading(true);
    if (customSubmit) {
      customSubmit(values)
    } else {
      const allValues = refForm.getFieldsValue(true);
      console.log('Success:', values, allValues);
      const attachments:any = {};
      const subAttachments:any = {};
      if (data.id) {
        fields.forEach((field) => {
          if (field.type === 'Fields::NestedFormField') {
            (data[field.name] || []).forEach((item) => {
              const oldRow = allValues[field.name].filter((i) => i.id === item.id)[0];
              if (!oldRow) {
                allValues[field.name].push({...item, _destroy: 1});
              }
            });
            (allValues[field.name] || []).forEach((item, index) => {
              field.fields.forEach(sub_field => {
                if (sub_field.type === 'Fields::MultipleAttachmentField' || sub_field.type === 'Fields::MultipleImageField') {
                  if (item[sub_field.name]) {
                    subAttachments[field.name] ||= [];
                    subAttachments[field.name][item.key] ||= {};
                    subAttachments[field.name][item.key][sub_field.id] = item[sub_field.name];
                  }
                  delete allValues[field.name][index][sub_field.name];

                  ((data[field.name][index] && data[field.name][index][sub_field.name]) || []).forEach(old_item => {
                    const oldFile = ((subAttachments[field.name] && subAttachments[field.name][item.key] && subAttachments[field.name][item.key][sub_field.id]) || []).filter(i => i.uid === old_item.id || i.id === old_item.id)[0];
                    if (!oldFile) {
                      subAttachments[field.name] ||= [];
                      subAttachments[field.name][item.key] ||= {};
                      subAttachments[field.name][item.key][sub_field.id] ||= [];
                      subAttachments[field.name][item.key][sub_field.id].push({...old_item, delete: true});
                    }
                  })
                }
              })
            });
          } else if ((field.type === 'Fields::MultipleAttachmentField' || field.type === 'Fields::MultipleImageField')) {
            if (allValues[field.name]) {
              attachments[field.id] = allValues[field.name];
            }
            delete allValues[field.name];

            (data[field.name] || []).forEach(item => {
              const oldFile = (attachments[field.id] || []).filter(i => i.uid === item.id || i.id === item.id)[0];
              if (!oldFile) {
                attachments[field.id] ||= [];
                attachments[field.id].push({...item, delete: true});
              }
            })
          }
        });
        console.log(allValues, "allValuesallValues", attachments, subAttachments)
        const formatValues = formatFormData(allValues, fields);
        console.log('params', params);
        if (params.query.process_node_id) {
          formatValues['process_node_id'] = params.query.process_node_id;
        }
        updateData(form.name, data.id, formatValues).then(async (res: any) => {
          if (res.code === 200 && res.data) {
            await uploadFiles(data.id, attachments);
            await uploadSubFiles(data.id, subAttachments);
            message.success('更新成功！');
            Taro.navigateBack();
          } else if (res.error)  {
            setErrors(values, res.error);
          } else {
            message.error(res.tips);
          }
        }).catch((err) => {
          message.error(err.tips);
          if (err.error) {
            setErrors(values, err.error);
          }
        });
      } else {
        fields.forEach((field) => {
          if (field.type === 'Fields::MultipleAttachmentField' || field.type === 'Fields::MultipleImageField') {
            if (allValues[field.name]) {
              attachments[field.id] = allValues[field.name];
            }
            delete allValues[field.name];
          } else if (field.type === 'Fields::NestedFormField') {
            field.fields.forEach(sub_field => {
              if (sub_field.type === 'Fields::MultipleAttachmentField' || sub_field.type === 'Fields::MultipleImageField') {
                (allValues[field.name] || []).forEach((item, index) => {
                  if (item[sub_field.name]) {
                    subAttachments[field.name] ||= [];
                    subAttachments[field.name][item.key] ||= {};
                    subAttachments[field.name][item.key][sub_field.id] = item[sub_field.name];
                  }
                  delete allValues[field.name][index][sub_field.name];
                })
              }
            })
          }
        });
        console.log(allValues, "allValuesallValues", attachments, subAttachments)
        createData(form.name, { ...data, ...formatFormData(allValues || {}, fields) }).then(async (res: any) => {
          if (res.code === 200) {
            await uploadFiles(res.data.id, attachments);
            await uploadSubFiles(res.data.id, subAttachments);
            message.success('创建成功！');
            Taro.navigateBack();
          } else if (res.error) {
            setErrors(values, res.error);
          } else {
            message.error('创建失败');
          }
        }).catch((err) => {
          if (err.error) {
            setErrors(values, err.error);
          }
        });
      }
    }
  }

  const providerValue = {
    ...props, 
    fields, 
    refForm, 
    productsRef, 
    addresses, 
    setAddresses, 
    forceUpdate, 
    setForceUpdate, 
    overloadData, 
    actionMap, 
    setDefaultRelationField, 
    executeFormula, 
    executeLinkageFunction, 
    setDisableEdit, 
    setHiddenField, 
    executeSumField,
    setOverloadData, 
    promotionsRef, 
    orderPromotionRef,
    customModule,
    executeEventFunction,
    subFormOptions,
  };

  return (
    <FormContainerContext.Provider value={providerValue}>
      <NavBar onBack={() => Taro.navigateBack()} right={<Text className='form-container-save' onClick={submitForm}>{params.query.process_node_id ? '提交并通过' : '保存'}</Text>}>{title ? title : data.id ? '编辑': '创建'}</NavBar>
      <View className="form-container-container">
        <Form
          form={refForm}
          layout="horizontal"
          labelWrap
          onFinish={(values) => onFinish(values)}
          onValuesChange={(changedValues, allValues) => {
            if (changedValues) {
              if (form.name === "sales_orders") {
                excutePromotionRule(providerValue, changedValues, allValues);
              }
              if (layoutRules.length > 0) {
                setFieldsOrSectionsVisiable(changedValues, allValues);
              }
            }
          }}
        >
        {sections.filter(item => !item.hidden).map((section, index) => {
          return <Section key={section.id || section.key} form={form} data={data} section={section} sectionIndex={index} step={step} setStep={setStep} />
        })}
        </Form>
      </View>
    </FormContainerContext.Provider>
  )
}