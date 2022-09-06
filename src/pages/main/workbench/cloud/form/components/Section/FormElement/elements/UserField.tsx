/**
 * 用户
 */
import { View, Text, ScrollView } from "@tarojs/components";
import { Button, CheckList, DotLoading, Image, Popup, SearchBar } from "antd-mobile"
import {useEffect, useState} from 'react'
import './style.scss'
import { RightOutline } from 'antd-mobile-icons'
import { getUserSelections } from "src/pages/services/selection";
import { message } from "antd";
import _, { debounce } from "lodash";

interface Props {
  onSelect?: (e: any) => void;
  onChange?: (e: any) => void,
  onBlur?: (e: any) => void,
  isDisable?: boolean,
  value?: string,
  placeholder?: string,
  multiple?: boolean,
  right?: boolean,
}

export default (props: Props) => {
  const {onChange, isDisable, placeholder, multiple, right, onSelect} = props;

  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>()

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<Array<any>>([]);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<Array<string>>([]);
  const [multipleValue, setmultipleValue] = useState<Array<string>>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (props.value && users.filter((user) => user.id === props.value).length === 0) {
      onChange && onChange(props.value);
      getUser({ id_eq: props.value });
    }
  }, [props.value])

  const getUser = (condition: any = {}, page: number = 1) => {
    setLoading(true);
    getUserSelections({
      page,
      q: condition,
    }).then((res) => {
      if (res.code === 200  && res.data) {
        const data = res.data.datas;
        if (page === 1) {
          if (condition?.id_eq) {
            setValue([data[0].name]);
            setSearch(data[0].name);
          }
          setUsers(data);
        } else {
          setUsers(users.concat(data));
        }
        setPage(page);
        setInfo(res.data.info);
        setLoading(false);
      }
    }).catch((err) => {
      setLoading(false);
      // console.log(err);
      message.error(err.tips);
    })
  }

  const fetchSelectionDatas = debounce((key_word = null, current_page = 1) => {
    setSearch(key_word);
    getUser({name_cont: key_word }, current_page);
  }, 500);

  return (
    <View className="form-field" onClick={() => {
      setVisible(!isDisable ? true : false);
      if (!users.length) {
        getUser();
      }
    }}>
      <View className="form-field-content" style={{justifyContent: right ? 'flex-end' : 'space-between'}}>
        {value.length ? (
          <View className="form-field-content-text">
            {value.map((val, index) => 
              <Text className={multiple ? 'form-field-content-text-multiple' : ''} key={index}>{val}</Text>
            )}
          </View>
        ) : (
          <Text className="form-field-content-placeholder">{placeholder || ' '}</Text>
        )}
        <RightOutline style={{marginLeft: '5px'}}/>
      </View>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        bodyStyle={{height: window.innerHeight * 0.9 + 'px'}}>
        <View className='form-field-popup'>
        <SearchBar value={search} onClear={() => fetchSelectionDatas()} onChange={setSearch} onSearch={() => fetchSelectionDatas(search)}/>
          <View className='form-field-popup-main'>
          <ScrollView
            style={{height: '100%'}}
            scrollY={true}
            lowerThreshold={200}
            onScrollToLower={_.throttle(() => {
              if (info && users.length !== info.total_count && !loading) {
                fetchSelectionDatas(search, page + 1);
              }
            }, 1000, {leading: true, trailing: false})}
          >
            <CheckList
              multiple={multiple}
              defaultValue={props.value ? [props.value] : []}
            >
              {users.map((user, index) => {
                return (
                  <CheckList.Item key={index} value={user.id} onClick={() => {
                    if (multiple) {
                      const isDelete = value.find((item) => item === user.name);
                      if (isDelete) {
                        setValue(value.filter((val) => val !== user.name));
                        setmultipleValue(multipleValue.filter((item) => item !== user.id));
                        onSelect && onSelect(multipleValue.filter((item) => item !== user.id));
                      } else {
                        setValue(value.concat(user.name));
                        setmultipleValue(multipleValue.concat(user.id));
                        onChange && onChange(multipleValue.concat(user.id));
                      }
                    } else {
                      setValue([user.name === value[0] ? '' : user.name]);
                      onChange && onChange(user.name === value[0] ? null : user.id);
                      onSelect && onSelect(user.name === value[0] ? null : user);
                      setVisible(false);
                    }
                  }}>
                    <View className="form-field-popup-main-item">
                      <View className="form-field-popup-main-item-acatar">
                        {user.avatar ? (
                          <Image src={user.avatar} />
                        ) : (user.name[0])}
                      </View>
                      <View>
                        <View>{user.name}</View>
                        <View className="orm-field-popup-main-item-email">{user.email}</View>
                      </View>
                    </View>
                  </CheckList.Item>
                )
              })}
            </CheckList>
            {!users.length && !loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>暂无数据</Text>}
            </ScrollView>
            {loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>加载中<DotLoading /></Text> }
          </View>
          <Button onClick={() => setVisible(false)} block >{'关闭'}</Button>
        </View> 
      </Popup>
    </View>
  );
}