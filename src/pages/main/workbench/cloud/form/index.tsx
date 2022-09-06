import React, { useState, useEffect } from 'react';
import { initFormData } from 'src/utils/format';
import FormContainer from './components/FormContainer';
import { getDataById, getFieldMapDependencies, getLayoutRules } from './service';
import './index.scss';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getSections } from 'src/pages/services/form';
import { getProcessNode } from 'src/pages/services/model_process';

export const TabFormContext = React.createContext({});
const TabForm = () => {
  const module_name = getCurrentInstance().router?.params.module_name;//获取页面?后面传入的token
  const id = getCurrentInstance().router?.params.id;//获取页面?后面传入的token
  const process_node_id = getCurrentInstance().router?.params.process_node_id;//获取页面?后面传入的token
  const title = getCurrentInstance().router?.params.title;//获取页面?后面传入的token

  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({});
  const [data, setData] = useState({});
  const [fieldMapDependencies, setFieldMapDependencies] = useState([]);
  const [layoutRules, setLayoutRules] = useState([]);
  const [currentUser, setcurrentUser] = useState({});

  const getUser = () => {
    const cloudUser = Taro.getStorageSync('currentUser');
    if (cloudUser) {
      setcurrentUser(cloudUser);
    }
  }

  useEffect(() => {
    getUser();
    getData();
  }, []);

  const getData = () => {
    Taro.showLoading();
    getSections({ form_name: module_name }).then(async(res) => {
      if (res.code === 200 && res.data) {
        const currentSections = res.data.sections;
        if (process_node_id) {
          await getProcessNode({process_node_id}).then(res2 => {
            if (res2.data && res2.data.field_ids && res2.data.field_ids.length > 0) {
              const fieldIds = res2.data.field_ids;
              currentSections.forEach(section => {
                section.fields.forEach(field => {
                  if (fieldIds.indexOf(field.id) === -1) {
                    field.accessibility = 'hidden';
                    field.hidden = true;
                  }
                  if (field.fields.length > 0) {
                    field.fields.forEach(sub_field => {
                      if (fieldIds.indexOf(sub_field.id) === -1) {
                        sub_field.accessibility = 'hidden';
                        sub_field.hidden = true;
                      }
                    })
                  }
                })
              })
            }
          })
        }
        const fields = currentSections.map((section) => section.fields).flat();
        setForm(res.data.form);
        getLayoutRules({form_id: res.data.form.id}).then(res0 => {
          if (res0.data) {
            setLayoutRules(res0.data.datas);
            res0.data.datas.forEach(layoutRule => {
              layoutRule.actions.forEach(action => {
                if (action.show_type === 'field') {
                  currentSections.forEach((section, i) => {
                    section.fields.forEach((field, j) => {
                      if (action.values.indexOf(field.id) !== -1) {
                        currentSections[i].fields[j].hidden = true
                      }
                    })
                  })
                } else if (action.show_type === 'section') {
                  currentSections.forEach((section, i) => {
                    if (action.values.indexOf(section.id) !== -1) {
                      currentSections[i].hidden = true;
                    }
                  })
                }
              })
            })
          }
          getFieldMapDependencies({form_id: res.data.form.id}).then(res1 => {
            if (res1.data) {
              setFieldMapDependencies(res1.data.datas);
            }
            const items = ((res1.data && res1.data.datas) || []);
            if (items.length > 0) {
              setSections(
                currentSections.map(item => {
                  return item.category === 'sub_form' ? {
                    ...item,
                    fields: item.fields.map((item2, index) => {
                      if (index > 0) {
                        return item2;
                      }
    
                      return {
                        ...item2, 
                        fields: item2.fields.map(item3 => {
                          const fmd = items.filter(i => i.sub_field_id === item3.id)[0];
                          if (fmd) {
                            const condition = {};
                            condition[`${fmd.related_field_name}_eq`] = 0;
                            return {...item3, map_choices: [], related_field_search_condition: condition}
                          }
    
                          return item3;
                        })
                      }
                    })
                  } : {
                    ...item,
                    fields: item.fields.map(item2 => {
                      const fmd = items.filter(i => i.sub_field_id === item2.id)[0];
                      if (fmd) {
                        const condition = {};
                        condition[`${fmd.related_field_name}_eq`] = 0;
                        return {...item2, map_choices: [], related_field_search_condition: condition}
                      }
    
                      return item2;
                    })
                  }
                })
              )
            } else {
              setSections(currentSections);
            }
          })
        })
        if (id) {
          getDataById(module_name, id).then((res2) => {
            if (res2.code === 200 && res2.data) {
              if (process_node_id || (res2.data.can_updated && !res2.data.lock_edit)) {
                setData(initFormData(res2.data, fields));
              }
            }

            // if (res2.code === 404) {
            //   Taro.reLaunch({url: 'pages/404/index'});
            // }
          });
        } else {
          // getFormProfile(module_name).then((res3) => {
          //   if (!res3.data.can_create) {
          //     // history.push('/403');
          //   } else if (props.location.query.copy_data) {
          //     getDataById(module_name, props.location.query.copy_data).then((res2) => {
          //       console.log('getDataById2', res2);
          //       if (res.data.form.onload_function_id) {
          //         invokeOnloadFunction({
          //           custom_function_id: res.data.form.onload_function_id, 
          //           form_id: res.data.form.id,
          //           params: {query: props.location.query, data: res2.data}
          //         }).then(res4 => {
          //           console.log(res4, "invokeOnloadFunction");
          //           if (res4.data && res4.data.result) {
          //             setData(initFormData({...res2.data, ...res4.data.result}, fields, true));
          //           } else if (res2.data) {
          //             setData(initFormData(res2.data, fields, true));
          //           }
          //         })
          //       } else if (res2.data) {
          //         setData(initFormData(res2.data, fields, true));
          //       }
          //     });
          //   } else if (props.location.query.conversion_id && props.location.query.source_id ) {
          //     getConversionData(module_name, props.location.query).then((res2) => {
          //       console.log('getConversionData', res2);
          //       if (res.data.form.onload_function_id) {
          //         invokeOnloadFunction({
          //           custom_function_id: res.data.form.onload_function_id, 
          //           form_id: res.data.form.id,
          //           params: {query: props.location.query, data: res2.data}
          //         }).then(res4 => {
          //           console.log(res4, "invokeOnloadFunction");
          //           if (res4.data && res4.data.result) {
          //             setData(initFormData({...res2.data, ...res4.data.result}, fields, true));
          //           } else if (res2.data) {
          //             setData(initFormData(res2.data, fields, true));
          //           }
          //         })
          //       } else if (res2.data) {
          //         setData(initFormData(res2.data, fields, true));
          //       }
          //     });
          //   } else if (props.location.query.association_module && props.location.query.association_id) {
          //     const associationField = fields.filter(item => item.type === "Fields::ResourceField" && item.options.data_source_type === props.location.query.association_module)[0];
          //     const initData = {};
          //     if (associationField) {
          //       initData[associationField.name] = props.location.query.association_id
          //     }
          //     if (res.data.form.onload_function_id) {
          //       invokeOnloadFunction({
          //         custom_function_id: res.data.form.onload_function_id, 
          //         form_id: res.data.form.id,
          //         params: {query: props.location.query}
          //       }).then(res2 => {
          //         console.log(res2, "invokeOnloadFunction");
          //         if (res2.data && res2.data.result) {
          //           const formatData = initFormData(res2.data.result, fields, true);
          //           setData({...initData, ...formatData});
          //         } else {
          //           setData(initData);
          //         }
          //       })
          //     } else {
          //       setData(initData);
          //     }
          //   } else if (res.data.form.onload_function_id) {
          //     invokeOnloadFunction({
          //       custom_function_id: res.data.form.onload_function_id, 
          //       form_id: res.data.form.id,
          //       params: {query: props.location.query}
          //     }).then(res2 => {
          //       console.log(res2, "invokeOnloadFunction");
          //       if (res2.data && res2.data.result) {
          //         setData(initFormData(res2.data.result, fields, true));
          //       }
          //     })
          //   }
          // });
        }
      }
    });
  }

  return (
    <View className='form-container'>
      <FormContainer 
        sections={sections}
        setSections={setSections}
        fieldMapDependencies={fieldMapDependencies}
        layoutRules={layoutRules}
        form={form}
        data={data}
        params={{...{module: module_name, id, query: {
          process_node_id,
        }}}}
        currentUser={currentUser}
        title={title}
      />
    </View>
  );
};
export default TabForm;
