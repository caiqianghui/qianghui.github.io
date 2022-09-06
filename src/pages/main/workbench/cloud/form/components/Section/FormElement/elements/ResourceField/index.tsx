/**
 * 查找列表
 */

 import { Button, CheckList, InfiniteScroll, Input, List, Popup, Dialog, SearchBar, DotLoading } from 'antd-mobile';
 import {useState, useEffect, useContext} from 'react';
 import '../style.scss'
 import { View, Text, ScrollView } from '@tarojs/components';
 import { SearchOutline, RightOutline } from 'antd-mobile-icons'
 import _ from 'lodash';
import { FormContainerContext } from '../../../../FormContainer';
import { getFields } from 'src/pages/services/form';
import { getSelections, getWarehouseBatchStock, getWarehouseStock } from 'src/pages/services/selection';
import { message } from 'antd';

 interface TypeSelection {value: string, label: string}
 
 export default (props: any) => {
   const {onSelect, field, isDisable, onBlur, subFormName, index, initSelectionDatas, placeholder, subFormSelectSetting, overloadData, onChange} = props;
   const { form, refForm, fields, sections, setSections, orderPromotionRef} = useContext<any>(FormContainerContext);
   const [selectionDatas, setSelectionDatas] = useState<any>([]);
   const [selections, setSelections] = useState<Array<TypeSelection>>([]);
 
   const [visible, setVisible] = useState(false);
   const [value, setValue] = useState<string>('');
   const [search, setSearch] = useState<string>('');
 
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const overloadrRelatedFieldSearchCondition = subFormName ? ((overloadData[subFormName] || [])[index] && overloadData[subFormName][index][field.name] && overloadData[subFormName][index][field.name].related_field_search_condition) : (overloadData[field.name] && overloadData[field.name].related_field_search_condition);
   const [info, setInfo] = useState<any>();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     if (subFormSelectSetting) {
      getFields({form_name: field.options.data_source_type}).then(res => {
        if (res.data) {
          const columns = {};
          subFormSelectSetting.show_columns.forEach(field_id => {
            const item = res.data.fields.filter(f => f.id === field_id)[0];
            if (item) {
              columns[item.id] = {name: item.name, label: item.label};
            }
          })
          console.log(columns, 'sssssss')
        }
      })
     }
   }, []);
 
   const searchSelectionDatas = async (condition = {}, current_page: number) => {
    setLoading(true);
     if (field.options.data_source_type) {
       let relatedFields: any = null;
       if (subFormName) {
         const subFormField = fields.filter(
           (item) => item.type === 'Fields::NestedFormField' && item.name === subFormName,
         )[0];
         relatedFields =
           subFormField &&
           subFormField.fields.filter(
             (item) =>
               item.is_default_relation_field && 
               item.default_relation_field.length === 2 &&
               item.default_relation_field[0] === field.key,
           );
       } else {
         relatedFields = (fields || []).filter(
           (item: any) =>
             item.is_default_relation_field && 
             item.default_relation_field.length === 2 &&
             item.default_relation_field[0] === field.key,
         );
       }
       if (field.options.show_warehouse_stock && subFormName) {
          const subFormField = fields.filter(
            (item) => item.type === 'Fields::NestedFormField' && item.name === subFormName,
          )[0];
          const productField = subFormField && subFormField.fields.filter(item => item.type === 'Fields::ResourceField' && item.options.data_source_type === 'products')[0];
          if (productField) {
            getWarehouseStock({product_id: refForm.getFieldValue([subFormName, index, productField.name])}).then(res => {
              const currentChoices = (res.data || []).map(item => {
                return {id: item.id, name: `${item.name}（${item.stock}）`}
              })
              setSelectionDatas(currentChoices);
            })
          }
       } else {
        const params = {
          q: { ...(condition || {}), ...(overloadrRelatedFieldSearchCondition || field.related_field_search_condition || {}) },
          page: current_page,
          sub_form_select_setting_id: subFormSelectSetting && subFormSelectSetting.id,
          search_field_id: field.id,
          form_name: form && form.name,
          is_auth: field.options.data_range_by_auth,
          show_column_options: JSON.stringify(field.options.show_column_options || []),
          related_fields: relatedFields && relatedFields.map((item) => item.default_relation_field[1]).join(','),
        }
         let _page = current_page;
         getSelections(field.options.data_source_type, params).then((res) => {
           if (res.data) {
             let data: any = [];
             data = res.data.datas.map((item: any) => ({...item, label: item.show_name || item.name || item.number || item.title, value: item.id}));
             console.log('data', data);
             if (current_page > 1) {
               setSelections(selectionDatas.concat(data));
               setSelectionDatas(selectionDatas.concat(data));
             } else {
               setSelections(() => {
                 if (!value && props.value) {
                   const _value = data.find((selection: any) => selection.value === props.value)?.label;
                   setValue(_value || props.value);
                   setSearch(_value);
                 }
                 return data;
               });
               setSelectionDatas(data);
             }
            _page++;
            setPage(_page);
            setHasMore(data.length > 0);
            setInfo(res.data.info);
          } else {
            setVisible(false);
          }
          setLoading(false);
         }).catch((err) => {
          setLoading(false);
          // console.log(err);
          message.error(err.tips);
         });
       }
     }
   }

   const setBatchNumberChoices = (val) => {
    if (subFormName) {
      const subFormField = fields.filter(
        (item) => item.type === 'Fields::NestedFormField' && item.name === subFormName,
      )[0];
      const productField = subFormField && subFormField.fields.filter(item => item.type === 'Fields::ResourceField' && item.options.data_source_type === 'products')[0];
      const batchField = subFormField && subFormField.fields.filter(item => item.type === 'Fields::SelectField' && item.options.source_type === "product_warehouse_batch")[0];
      if (productField && batchField) {
        getWarehouseBatchStock({product_id: refForm.getFieldValue([subFormName, index, productField.name]), warehouse_id: val}).then(res => {
          console.log("getWarehouseBatchStock", res)
          const newChoices = (res.data || []).map(item => {
            return {id: item.id, label: `${item.name}（${item.stock}）`, batch_id: item.id}
          })
          console.log(newChoices, "newChoices", sections)
          refForm.setFields([
            {
              name: [subFormName, index, batchField.name],
              value: null,
            }
          ])
          setSections(
            sections.map((item) => {
              return item.category !== 'sub_form'
                ? item
                : {
                    ...item,
                    fields: item.fields.map((item2, i) => {
                      return i > 0 ? item2 : {...item2, fields: item2.fields.map(item3 => {
                        return item3.id === batchField.id ? {...item3, choices: newChoices} : item3
                      })}
                    }),
                  };
            }),
          );
        })
      }
    }
  }
 
  useEffect(() => {
    if (props.value && selectionDatas.filter((item: any) => item.id === props.value).length === 0) {
      onChange && onChange(props.value);
      if (initSelectionDatas && initSelectionDatas[field.id]) {
        setSelectionDatas(initSelectionDatas[field.id]);
      } else {
        searchSelectionDatas({ id_eq: props.value }, page);
      }
    }
  }, [props.value]);

  const fetchSelectionDatas = _.debounce((key_word: string, current_page = 1) => {
    const searchCondition = {};
    if (key_word) {
      if (field.search_columns) {
        searchCondition[`${field.search_columns.join('_or_')}_cont`] = key_word;
      } else {
        searchCondition['name_cont'] = key_word;
      }
    }

    setSearch(key_word);
    searchSelectionDatas(searchCondition, current_page);
  }, 500);
 
  return (
    <View className='form-field' onClick={() => {
      if (!isDisable) {
        setVisible(true);
        if (!selections.length) {
          searchSelectionDatas({}, 1);
        }
      }
    }}>
      <View className="form-field-content">
        {value ? (
          <Text className="form-field-content-text">{value}</Text>
        ) : (
          <Text className="form-field-content-placeholder">{placeholder || ''}</Text>
        )}
        <RightOutline />
      </View>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{height: window.innerHeight * 0.9 + 'px'}}>
        <View className='form-field-popup'>
          <SearchBar value={search} placeholder="请输入关键字" onChange={setSearch} onSearch={() => fetchSelectionDatas(search)}/>
          <View className='form-field-popup-main'>
            <ScrollView
            style={{height: '100%'}}
            scrollY={true}
            lowerThreshold={200}
            onScrollToLower={_.throttle(() => {
              if (info && selections.length !== info.total_count && !loading) {
                searchSelectionDatas({ id_eq: props.value }, page + 1);
              }
            }, 1000, {leading: true, trailing: false})}
            >
            {(['categories', 'brands'].indexOf(field.options.data_source_type) !== -1) ? (
              <CheckList
                defaultValue={props.value ? [props.value] : []}
                onChange={val => {
                  if (val.length === 0) {
                    setValue('');
                    onSelect && onSelect(null);
                    onBlur && onBlur(null);
                    onChange && onChange('');
                  } else {
                    const selection = selections.find(selection => selection.value === val[0]);
                    setValue(selection ? selection.label : '');
                    onSelect && onSelect(selection || {});
                    onBlur && onBlur(selection || {});
                    onChange && onChange(val[0]);
                  }
                  setVisible(false);
                }}
              >
                {selections.map((selection, index) => {
                  return (
                    <CheckList.Item key={index} value={selection.value}>{selection.label}</CheckList.Item>
                  )
                })}
              </CheckList>
            ) : (
              <CheckList
                defaultValue={props.value ? [props.value] : []}
                onChange={val => {
                  const selection = selections.find(selection => selection.value === val[0]);
                  setValue(selection ? selection.label : '');
                  if (form.name === 'sales_orders' && field.name === 'client_id' && refForm.getFieldValue('client_id') && (refForm.getFieldValue('sales_order_items') || []).length > 0) {
                    Dialog.confirm({
                      title: '切换客户将清空已选择产品，确定要切换吗？',
                      content: '因为产品价格和客户有关，所以会清空已选择产品',
                      onConfirm: () => {
                        const selectedData = selectionDatas.filter((item) => item.id === val[0])[0];
                        if (selectedData) {
                          orderPromotionRef.current = selectedData.current_promotion;
                        }
                        onChange(val[0] === undefined ? '' : val[0]);
                        if (onSelect && val[0] === undefined) {
                          onSelect(null);
                        }
                        refForm.setFieldsValue({ sales_order_items: [], sales_order_giveaways: [] });
                      },
                      onCancel: () => {}
                    })
                  } else if (form.name === 'sales_orders' && field.name === 'client_id' && val[0] === undefined && refForm.getFieldValue('client_id') && (refForm.getFieldValue('sales_order_items') || []).length > 0) {
                    Dialog.confirm({
                      title: '切换客户将清空已选择产品，确定要切换吗？',
                      content: '因为产品价格和客户有关，所以会清空已选择产品',
                      onConfirm: () => {
                        const selectedData = selectionDatas.filter((item) => item.id === val[0])[0];
                        if (selectedData) {
                          orderPromotionRef.current = selectedData.current_promotion;
                        }
                        onChange(val[0] === undefined ? '' : val[0]);
                        if (onSelect && val[0] === undefined) {
                          onSelect(null);
                        }
                        refForm.setFieldsValue({ sales_order_items: [], sales_order_giveaways: [] });
                      },
                      onCancel: () => {}
                    })
                  } else {
                    if (form.name === 'sales_orders' && field.name === 'client_id') {
                      const selectedData = selectionDatas.filter((item) => item.id === val[0])[0];
                      if (selectedData) {
                        orderPromotionRef.current = selectedData.current_promotion;
                      }
                    }
                    onChange(val[0] === undefined ? '' : val[0]);
                    if (onSelect && !val[0]) {
                      onSelect(null);
                    } else {
                      onSelect && onSelect(selection || {});
                    }
                    if (field.options.data_source_type === 'warehouses') {
                      setBatchNumberChoices(val[0]);
                    }
                  }
                  setVisible(false);
                }}
              >
                {selections.map((selection, index) => {
                  return (
                    <CheckList.Item key={index} value={selection.value}>{selection.label}</CheckList.Item>
                  )
                })}
              </CheckList>
            )}
            {!selections.length && !loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>暂无数据</Text>}
            </ScrollView>
            {loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>加载中<DotLoading /></Text> }
          </View>
          <Button onClick={() => setVisible(false)} block >{'关闭'}</Button>
        </View>
      </Popup>
    </View>
  )
};
 