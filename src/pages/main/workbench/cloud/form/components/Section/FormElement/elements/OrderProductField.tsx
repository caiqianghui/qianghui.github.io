import { useState, useEffect, useContext } from 'react';
import {
  message,
} from 'antd';
import debounce from 'lodash/debounce';
import { getMeetStr, getMeetValueTip, getExecutionValueTip } from 'src/utils/utils'
import {View, Text} from '@tarojs/components';
import { SearchOutline, RightOutline } from 'antd-mobile-icons'
import { Button, CheckList, InfiniteScroll, Input, List, Popover, Popup } from 'antd-mobile';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import { FormContainerContext } from '../../../FormContainer';
import { getFields } from 'src/pages/services/form';
import { getSelections, getWarehouseStock } from 'src/pages/services/selection';

export default (props) => {
  const { form, fields, refForm, productsRef, promotionsRef} = useContext<any>(FormContainerContext);
  const { field, value, isDisable, placeholder, onChange, onSelect, subFormName, index, initSelectionDatas, subFormSelectSetting, overloadData } = props;
  const [selectionDatas, setSelectionDatas] = useState<any>([]);
  const [keyword, setKeyword] = useState('');
  const [promotion, setPromotion] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectValue, setSelectValue] = useState<any>();
  // 是否提示前提必选项
  const isTip = form.name === 'sales_orders' && !refForm.getFieldValue('client_id');
  const overloadrRelatedFieldSearchCondition = subFormName ? ((overloadData[subFormName] || [])[index] && overloadData[subFormName][index][field.name] && overloadData[subFormName][index][field.name].related_field_search_condition) : (overloadData[field.name] && overloadData[field.name].related_field_search_condition);
  const [page, setPage] = useState(1);
  
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
        }
      })
    }
  }, [])

  const searchSelectionDatas = (condition, current_page = 1) => {
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
          (item) =>
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
          client_id: form && form.name === 'sales_orders' ? refForm.getFieldValue('client_id') : null,
          search_field_id: field.id,
          form_name: form && form.name,
          is_auth: field.options.data_range_by_auth,
          show_column_options: JSON.stringify(field.options.show_column_options || []),
          related_fields: relatedFields && relatedFields.map((item) => item.default_relation_field[1]).join(','),
        }
        if (field.options.data_source_type === "products") {
          params.related_fields = `${params['related_fields']},saleable_stock,lock_stock`;
        }
        console.log(params, "paramsparams")
        let _page = current_page;
        getSelections(field.options.data_source_type, params).then((res) => {
          console.log(res);
          if (res.data) {
            const items = res.data.datas;
       
            if (current_page > 1) {
              setSelectionDatas(selectionDatas.concat(items));
            } else {
              setSelectionDatas(items);
            }
            setHasMore(res.data.info.total_count !== items.length);
            _page++;
            setPage(_page);
            if (value) {
              setSelectValue(items.find((item) => item.id === value));
              resourceSelectChange(value);
            }
          } else {
            setVisible(false);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (value && selectionDatas.filter((item) => item.id === value).length === 0) {
      if (initSelectionDatas && initSelectionDatas[field.id]) {
        setSelectionDatas(initSelectionDatas[field.id]);
      } else {
        searchSelectionDatas({ id_eq: value });
      }
    }
  }, [value]);

  const fetchSelectionDatas = debounce((key_word = null, current_page = 1) => {
    const searchCondition = {};
    if (key_word) {
      if (field.search_columns) {
        searchCondition[`${field.search_columns.join('_or_')}_cont`] = key_word;
      } else {
        searchCondition['name_cont'] = key_word;
      }
    }

    setKeyword(key_word);
    searchSelectionDatas(searchCondition, current_page);
  }, 500);

  const resourceSelectChange = (val) => {
    if (form.name === 'sales_orders' && !refForm.getFieldValue('client_id')) {
      onChange(null);
      setSelectionDatas([]);
      message.warning('请选择客户！', 5);
    } else {
      const selectedData = selectionDatas.filter((item) => item.id === val)[0];
      if (selectedData) {
        productsRef.current[val] = selectedData;
        promotionsRef.current[val] = selectedData.current_promotion;
        setPromotion(selectedData.current_promotion);
      }
      onChange(val);
      setSelectValue(selectedData);
    }
  };

  const loadMore = async () => {
    if (hasMore && visible) {
      fetchSelectionDatas(keyword, page);
    }
  }

  const element = (
    <View className='form-field' onClick={() => {
      if (!isDisable) {
        setVisible(true);
      }
    }}>
      <View className="form-field-content">
        {selectValue ? (
          <Text className='form-field-content-text' style={{ margin: 0 }}>
            {selectValue.current_promotion && (
              <View
                style={{
                  color: '#8c7ee4',
                  border: '1px solid rgba(140,123,231,.4)',
                  marginRight: 5,
                  padding: '0 2px',
                  fontSize: '10px',
                }}
              >
                <Text>{selectValue.current_promotion.promotion_rule_str}</Text>
              </View>
            )}
            {selectValue.show_name || selectValue.name}
          </Text>
        ) : (
          <Text className="form-field-content-placeholder">{placeholder || ''}</Text>
        )}
        <RightOutline />
      </View>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
          // setValue(selections.find(selection => selection.value === value)?.label || '');
        }}
        bodyStyle={{ minHeight: '90vh' }}
      >
        <View className='resource-popup'>
          <List.Item prefix={<SearchOutline />} extra={<a onClick={() => fetchSelectionDatas(keyword)}>搜索</a>} className='search-content'>
            <Input placeholder={'请输入内容'} clearable value={keyword} onChange={(v) => setKeyword(v)}/>
          </List.Item>
          {isTip ? (
            <Text style={{color: 'red'}}>{'请先选择客户'}</Text>
          ) : null}
          <View className='main'>
            {/* 下拉刷新 */}
            {/* <PullToRefresh onRefresh={async () => {
              setPage(1);
              fetchSelectionDatas(keyword, 1);
            }}> */}
            <CheckList
              defaultValue={props.value ? [props.value] : []}
              onChange={val => {
                resourceSelectChange(val[0] === undefined ? null : val[0]);
                if (onSelect && val[0] === undefined) {
                  onSelect(null);
                } else {
                  onSelect(selectionDatas.filter((item) => item.id === val[0])[0]);
                }
                setVisible(false);
              }}
            >
              {selectionDatas.map((item) => {
                return (
                  <CheckList.Item key={item.id} value={item.id.toString()} disabled={isTip} >
                    <p>
                      <p style={{ margin: 0 }}>
                        {item.current_promotion && (
                          <span
                            style={{
                              color: '#8c7ee4',
                              border: '1px solid rgba(140,123,231,.4)',
                              marginRight: 5,
                              padding: '0 2px',
                              fontSize: '10px',
                            }}
                          >
                            {item.current_promotion.promotion_rule_str}
                          </span>
                        )}
                        {item.show_name || item.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '10px', color: 'gray' }}>
                        <span>可销售库存：{item.saleable_stock || 0}</span>
                        <span style={{ float: 'right' }}>锁定库存：{item.lock_stock || 0}</span>
                      </p>
                    </p>
                  </CheckList.Item>
                )
              })}
              <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={100} />
            </CheckList>
            {/* </PullToRefresh> */}
          </View>
          <Button onClick={() => setVisible(false)} block >{'关闭'}</Button>
        </View>
      </Popup>
    </View>
  )

  return promotion ? (
    <View className='field'>
      {element}
      <Popover
        placement="topLeft"
        // overlayClassName="promotionTip"
        content={
          <View className='popover-content'>
            <Text className='category'>
              {promotion.category_str}-{promotion.promotion_rule_str}
            </Text>
            <Text className="popover-title">{promotion.title}</Text>
            <View className="popover-category">
              <Text className="popover-text">{promotion.category === 'combined' ? '活动商品合计订购' : '订购'}</Text>
              <Text className="popover-text">{promotion.promotion_type === 'quantity' ? '数量' : '金额'}</Text>
            </View>
            <View className="popover-list">
              {promotion.promotion_conditions.map((promotion_condition, index1) => {
                return (
                  <View className="popover-item" key={index1}>
                    <span>
                      {getMeetStr(promotion)}
                      <span style={{ color: 'red', margin: '0  2px' }}>
                        {parseFloat(promotion_condition.meet_value || 0)}
                      </span>
                      {getMeetValueTip(promotion)}
                      {promotion.promotion_rule === 'buy_and_give' &&
                        promotion_condition.give_products.map((give_product, index2) => {
                          return (
                            <span key={give_product.id} style={{ textDecoration: 'underline' }}>
                              <a>
                                “[{give_product.code}]{give_product.name}”
                              </a>
                              {promotion_condition.give_products.length > 1 &&
                                index2 + 1 !== promotion_condition.give_products.length && (
                                  <span>，</span>
                                )}
                            </span>
                          );
                        })}
                      <span style={{ color: 'red', margin: '0  2px' }}>
                        {parseFloat(promotion_condition.execution_value || 0)}
                      </span>
                      {getExecutionValueTip(promotion)}
                    </span>
                  </View>
                );
              })}
            </View>
            <Text className="popover-desc">说明：多单位商品按最小单位计件数</Text>
          </View>
        }
      >
        <ExclamationCircleOutlined style={{marginLeft: '4px'}}/>
      </Popover>
    </View>
  ) : element
}
