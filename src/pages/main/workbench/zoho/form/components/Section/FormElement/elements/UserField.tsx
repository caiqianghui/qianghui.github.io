/**
 * 用户
 */
import { View, Text, ScrollView } from "@tarojs/components";
import { Button, CheckList, Divider, Image, Input, Popup, SearchBar } from "antd-mobile"
import {useContext, useEffect, useState} from 'react'
import './style.scss'
import { SearchOutline, RightOutline } from 'antd-mobile-icons'
import NetCloudFun from "src/pages/services/functions";
import { FormContainerContext } from "../../../FormContainer";
import { message, Row } from "antd";

interface Props {
  onChange?: (e: any) => void;
  onSelect?: (e: any) => void;
  isDisable: boolean;
  field: any;
  value?: any;
  placeholder?: string;
}

export default (props: Props) => {
  const {onChange, isDisable, onSelect, field} = props;
  const {zohoUser, data} = useContext<any>(FormContainerContext);

  const getUsers = (page: number, wordKey?: string) => {
    if (wordKey) {
      NetCloudFun.post('/crm/v2/coql', {
        select_query: `select first_name, phone, email, role from users where first_name like "%${wordKey}%" or email like "%${wordKey}%"`,
      }).then((res: any) => {
        console.log('getUsers', res);
        if (res.data) {
          setPage(page);
          if (page === 1) {
            setUsers(res.data);
          } else {
            setUsers(users.concat(res.data));
          }
          setInfo(res.info);
        }
      }).catch(() => {
        setUsers([]);
      });
    } else {
      NetCloudFun.get('/crm/v2/users', {
        // page,
        // per_page: 20,
        type: 'AllUsers'
      }).then((res: any) => {
        if (res.users) {
          setPage(page);
          if (page === 1) {
            setUsers(res.users);
          } else {
            setUsers(users.concat(res.users));
          }
          setInfo(res.info);
        }
      }).catch(() => {
        setUsers([]);
      });
    }
  };

  const [users, setUsers] = useState<Array<any>>([]);

  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({
    more_records: true,
  });
  
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<any>();
  const [searchKey, setSearchKey] = useState('');

  const onSearch = (key) => {
    if (key) {
      getUsers(1, key);
    } else {
      getUsers(1, '');
    }
    setSearchKey(key);
  }

  const profiles = ['销售工程师', '战区经理', '销售经理', 'DCC', '大区总经理', 'Administrator']
  
  return (
    <View className="field" onClick={() => {
      if (data) {
        // 编辑
        if (data.id && zohoUser && !profiles.find((profile) => profile === zohoUser.profile.name)) {
          message.warn('权限不足');
          return;
        }
        setVisible(!isDisable ? true : false);
        if (!users.length) {
          getUsers(1);
        }
      } else {
        // 创建 或者 筛选
        setVisible(!isDisable ? true : false);
        if (!users.length) {
          getUsers(1);
        }
      }

      }}>
      <View className="field-content">
        <Text className="field-text">{value ? value.first_name || value.name : props.value ? props.value.name : ''}</Text>
        <RightOutline />
      </View>
      <Popup
        className="picklist-popup"
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        bodyStyle={{ minHeight: '90vh' }}>
        <View className='picklist-popup-content'>
          <Row align='middle' className="picklist-view-input">
            <SearchBar style={{flex: 1}} value={searchKey} onChange={setSearchKey} onClear={() => {
              onSearch('');
            }} onSearch={() => onSearch(searchKey)}/>
            {searchKey && <Button color="primary" size='small' style={{marginLeft: '10px'}} onClick={() => onSearch(searchKey)}>搜索</Button>}
          </Row>
          <ScrollView
            scrollY={true}
            enhanced={true}
            lowerThreshold={200}
            className='picklist'
            onScrollToLower={() => {
              if (info.more_records) {
                getUsers(page + 1);
              }
            }}>
            <CheckList
              defaultValue={props.value ? [props.value] : []}
              onChange={(val: any) => {
                setValue(users.find(user => user.id === val[0].id));
                const _value = {
                  ...val[0],
                  name: val[0].first_name,
                  id: val[0].id,
                }
                onChange && onChange(_value.id);
                onSelect && onSelect(_value);
                setVisible(false);
              }}
            >
              {users.map((user, index) => {
                return (
                  <CheckList.Item key={index} value={user}>
                    <View className="user-item">
                      <View className="user-acatar">
                        {user.zuid ? (
                          <Image src={`https://contacts.zoho.com.cn/file?ID=${user.zuid}&fs=thumb`} />
                        ) : (user.first_name[0])}
                      </View>
                      <View>
                        <View>{user.first_name}</View>
                        <View className="user-email">{user.email}</View>
                      </View>
                    </View>
                  </CheckList.Item>
                )
              })}
            </CheckList>
            {!users.length && searchKey && <Divider style={{ marginTop: '20px'}}>未找到 "{searchKey}"</Divider>} 
          </ScrollView>
          {/* <Button onClick={() => setVisible(false)} block >{'关闭'}</Button> */}
        </View> 
      </Popup>
    </View>
  );
}