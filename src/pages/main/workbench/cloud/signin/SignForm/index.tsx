import React, { useState, useEffect } from 'react';
import FormContainer from './components/FormContainer';
import { getFieldMapDependencies, getLayoutRules } from './service';
import './index.scss';
import './style.scss';
import { View, Text } from '@tarojs/components';
import { getSections } from 'src/pages/services/form';
import { message } from 'antd';
import { Button, Skeleton } from 'antd-mobile';

export const TabFormContext = React.createContext({});

const TabForm = (props: any) => {
  const {module, signValues, address} = props;
  const [sections, setSections] = useState<Array<any>>([]);
  const [form, setForm] = useState({});
  const [fieldMapDependencies, setFieldMapDependencies] = useState([]);
  const [layoutRules, setLayoutRules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    // Taro.showLoading();
    setLoading(true);
    getSections({ form_name: module }).then((res) => {
      if (res.code === 200 && res.data) {
        let currentSections = res.data.sections;
        setForm(res.data.form);
        getLayoutRules({form_id: res.data.form.id}).then(res0 => {
          if (res0.code === 200 && res0.data) {
            setLayoutRules(res0.data.datas);
            res0.data.datas.forEach(layoutRule => {
              // console.log('layoutRule', layoutRule);
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
            if (res1.code === 200 && res1.data) {
              setLoading(false);
              setFieldMapDependencies(res1.data.datas);
              const items = ((res1.data && res1.data.datas) || []);
              if (items.length > 0) {
                setSections(currentSections.map(item => {
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
                }));
              } else {
                setSections(currentSections);
              }
            }
          }).catch((err) => {
            setLoading(false);
            message.error('网络错误');
            // console.log(err);
          });
        }).catch((err) => {
          setLoading(false);
          message.error('网络错误');
          // console.log(err);
        });
        //  Taro.hideLoading();
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      setLoading(false);
      message.error('网络错误，请退出重新访问');
      // console.log(err);
    })
  }

  return (
    <View className='sign-form'>
      {loading ? (
        <View style={{padding: '0 20px'}}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={5} animated />
        </View>
      ) : (
        sections.length ? (
          <FormContainer 
            sections={sections}
            setSections={setSections}
            fieldMapDependencies={fieldMapDependencies}
            layoutRules={layoutRules}
            form={form}
            data={{}}
            signValues={signValues}
            onSubmit={(e) => props.onSubmit && props.onSubmit(e)}
            module={module}
            address={address}
            loading={loading}
          />
        ) : (
          <View className='section-error'>
            <Text className='section-error-text' style={{color: 'red', marginBottom: '20px'}}>获取失败</Text>
            <Button
              onClick={getData}
            >
              点我刷新
            </Button>
          </View>
        )
      )}
    </View>

  );
};
export default TabForm;
