/**
 * 用户
 */
 import { View, Text, ScrollView } from "@tarojs/components";
 import { Button, CheckList, Divider, DotLoading, Image, Popup, SearchBar } from "antd-mobile"
 import {useEffect, useState} from 'react'
 import './style.scss'
 import { RightOutline } from 'antd-mobile-icons'
import { getUserSelections } from "src/pages/services/selection";
import { message, Row } from "antd";
import _ from "lodash";
 
 interface Props {
   onChange?: (e: any) => void;
   onBlur?: (e: any) => void;
   isDisable?: boolean;
   value?: string;
   placeholder?: string;
   multiple?: boolean;
 }
 
 export default (props: Props) => {
   const {onChange, isDisable, onBlur, placeholder, multiple} = props;
 
   const [page, setPage] = useState(1);
   const [info, setInfo] = useState<any>()
 
   const [loading, setLoading] = useState(false);

   const [users, setUsers] = useState<Array<any>>([]);
 
   const [visible, setVisible] = useState(false);
   const [value, setValue] = useState<Array<string>>([]);
   const [multipleValue, setmultipleValue] = useState<Array<string>>([]);
   const [search, setSearch] = useState<string>('');

  const [destroyOnClose, setDestroyOnClose] = useState(false);

   useEffect(() => {
    if (!props.value) {
      setDestroyOnClose(true);
      setValue([]);
      setmultipleValue([]);
    } else {
      setDestroyOnClose(false);
    }
   }, [props]);

   const getUser = (page: number, word?: string) => {
    setLoading(true);
    getUserSelections({
      page,
      q: {"approved_eq":true,"name_cont": word === '' ? word : search},
    }).then((res) => {
      if (res.code === 200  && res.data) {
        const data = res.data.datas;
        if (page === 1) {
          setUsers(data);
        } else {
          setUsers(users.concat(data));
        }
        setPage(page);
        setInfo(res.data.info);
        setLoading(false);
        if (props.value) {
          onChange && onChange(props.value);
          // onBlur && onBlur(props.value);
          // setValue(data.find(user => user.id === props.value));
        };
      }
    }).catch((err) => {
      setLoading(false);
      // console.log(err);
      message.error(err.tips);
    })
   }

   return (
     <View className="field" onClick={() => {
        setVisible(!isDisable ? true : false);
        if (!users.length) {
          getUser(1);
        }
     }}>
        <View className="field-content">
         {value && value.length ? (
           <View className="field-text">
              {value.map((val, index) => 
                <Text className={multiple ? 'field-text-multiple' : ''} key={index}>{val}</Text>
              )}
            </View>
         ) : (
           <Text className="field-placeholder">{placeholder || ' '}</Text>
         )}
         <RightOutline />
       </View>
       <Popup
         visible={visible}
         destroyOnClose={destroyOnClose}
         onMaskClick={() => {
           setVisible(false)
         }}
         bodyStyle={{height: window.innerHeight * 0.9 + 'px'}}>
         <View className='resource-popup'>
            <Row align='middle'>
              <SearchBar style={{flex: 1}} onClear={() => getUser(1, '')} value={search} onChange={setSearch} onSearch={() => getUser(1)}/>
              {search && <Button color="primary" size='small' style={{marginLeft: '10px'}} onClick={() => getUser(1)}>搜索</Button>}
            </Row>
           <View className='main'>
            <ScrollView
              style={{height: '100%'}}
              scrollY={true}
              lowerThreshold={200}
              onScrollToLower={_.throttle(() => {
                if (info && users.length !== info.total_count && !loading) {
                  getUser(page + 1);
                }
              }, 1000, {leading: true, trailing: false})}
            >
              <CheckList
                multiple={multiple}
                value={value}
                // defaultValue={props.value ? [props.value] : []}
              >
                {users.map((user, index) => {
                  return (
                    <CheckList.Item key={index} value={user.name} onClick={() => {
                      if (multiple) {
                        const isDelete = value.find((item) => item === user.name);
                        if (isDelete) {
                          setValue(value.filter((val) => val !== user.name));
                          setmultipleValue(multipleValue.filter((item) => item !== user.id));
                          onChange && onChange(multipleValue.filter((item) => item !== user.id));
                        } else {
                          setValue(value.concat(user.name));
                          setmultipleValue(multipleValue.concat(user.id));
                          onChange && onChange(multipleValue.concat(user.id));
                        }
                      } else {
                        console.log('value', value);
                        setValue([value && user.name === value[0] ? '' : user.name]);
                        onChange && onChange(value && user.name === value[0] ? null : user.id);
                        setVisible(false);
                      }
                    }}>
                      <View className="user-item">
                        <View className="user-acatar">
                          {user.avatar ? (
                            <Image src={user.avatar} />
                          ) : (user.name[0])}
                        </View>
                        <View>
                          <View>{user.name}</View>
                          <View className="user-email">{user.email}</View>
                        </View>
                      </View>
                    </CheckList.Item>
                  )
                })}
              </CheckList>
              {loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>加载中<DotLoading /></Text> }
              {!users.length && !loading && <Divider style={{marginTop: '20px'}}>{search ? `未找到${search}` : '暂无数据'}</Divider>}
             </ScrollView>
           </View>
           <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px'}}>
              <Button block style={{marginRight: '5px'}} color='warning' shape='rounded' onClick={() => {
                setValue([]);
                setmultipleValue([]);
                onChange && onChange([]);
              }}>重置</Button>
              <Button block style={{marginLeft: '5px'}} color='primary' shape='rounded' onClick={() => {
                setVisible(false)
              }}>确定</Button>
           </View>
         </View> 
       </Popup>
     </View>
   );
 }