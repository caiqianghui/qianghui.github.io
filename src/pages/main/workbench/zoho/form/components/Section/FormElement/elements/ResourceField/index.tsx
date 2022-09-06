/**
 * 查找列表
 */

import { CheckList, Divider, Input, Popup, SearchBar } from 'antd-mobile';
import {useState, useEffect} from 'react';
import '../style.scss'
import { View, Text, ScrollView } from '@tarojs/components';
import { SearchOutline, RightOutline } from 'antd-mobile-icons'
import NetCloudFun from 'src/pages/services/functions';

export default (props: any) => {
  const {onSelect, field, isDisable, onBlur, placeholder, onChange} = props;
  const [fields, setFields] = useState<Array<any>>([]);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<string>('');
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({
    more_records: true,
  });

  const per_page = 20;

  const getFields = (page: number, wordKey?: string) => {
    const params: any = {
      page,
      per_page,
    }
    
    if (wordKey) {
      NetCloudFun.post('/crm/v2/coql', {
        select_query: `select Name from ${field.lookup.module} where Name like "%${wordKey}%" LIMIT ${((page - 1) * per_page)} , ${per_page}`,
      }).then((res: any) => {
        console.log('getUsers', res);
        if (res && res.data) {
          setPage(page);
          if (page === 1) {
            setFields(res.data);
          } else {
            setFields(fields.concat(res.data));
          }
          setInfo(res.info);
        } else {
          setFields([]);
          setInfo({more_records: false});
        }
      });
    } else {
      NetCloudFun.get(`/crm/v2/${field.lookup.module}`, params).then((res: any) => {
        if (res && res.data) {
          setPage(page);
          if (page === 1) {
            setFields(res.data);
          } else {
            setFields(fields.concat(res.data));
          }
          setInfo(res.info);
        } else {
          setFields([]);
          setInfo({more_records: false});
        }
      })
    }
   
  }

  return (
    <View className='field' onClick={() => {
      console.log('查询列表', props.value);
      if (!isDisable) {
        setVisible(true);
      }
      if (field.lookup && !fields.length) {
        getFields(1);
      }
    }}>
      <View className="field-content">
        {value ? (
          <Text className="field-text">{value}</Text>
        ) : (
          <Text className="field-placeholder">{placeholder || ''}</Text>
        )}
        <RightOutline />
      </View>
      <Popup
        className="picklist-popup"
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{ minHeight: '90vh' }}>
        <View className='picklist-popup-content'>
          <View className="picklist-view-input">
            <SearchBar
              placeholder={'搜索' + field.display_label}
              value={searchKey}
              onClear={() => {
                getFields(1);
              }}
              onChange={val => {
                setSearchKey(val);
              }}
              onSearch={() => {
                getFields(1, searchKey);
              }}/>
          </View>
          <ScrollView
            scrollY={true}
            enhanced={true}
            lowerThreshold={200}
            className='picklist'
            onScrollToLower={() => {
              if (info.more_records) {
                getFields(page + 1, searchKey);
              }
            }}
          >
            <CheckList
              defaultValue={props.value ? [props.value] : []}
              onChange={(val: any) => {
                const _value = {
                  name: val[0][`${field.lookup.module.slice(0, -1)}_Name`],
                  id: val[0].id,
                }
                const values = fields.find(field => field.id === val[0].id);
                // console.log('values', values);
                setValue(values ? values[`${field.lookup.module.slice(0, -1)}_Name`] || values.Name : '');
                onSelect && onSelect(values || {});
                onBlur && onBlur(values || {});
                onChange && onChange(_value.id);
                setVisible(false);
              }}
            >
              {fields.map((item, index) => {
                return (
                  <CheckList.Item className='checklist-item' key={index} value={item}>{item[`${field.lookup.module.slice(0, -1)}_Name`] || item.Name}</CheckList.Item>
                )
              })}
            </CheckList>
            {!fields.length && searchKey && <Divider>未找到 "{searchKey}"</Divider>}
          </ScrollView>
        </View>
      </Popup>
    </View>
  );
};
