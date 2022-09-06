import { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components'
import './index.scss'
import { NavBar, SearchBar } from 'antd-mobile';
import { SearchOutline, LeftOutline, AddOutline } from 'antd-mobile-icons';
import _ from 'lodash';
import Taro from '@tarojs/taro';
import { SearchBarRef } from 'antd-mobile/es/components/search-bar'

interface Props {
  onSearch: (e: string) => void;
  onChange: (e: string) => void;
  onCancel: () => void;
  onAddModule: () => void;
  module_name: string
  title: string;
}

export default (props: Props) => {
  const {onChange, onSearch, title, onCancel, onAddModule, module_name} = props;

  const [searchKey, setSearchKey] = useState('');

  const [active, setActive] = useState(false);
  const searchRef = useRef<SearchBarRef>(null);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    searchRef.current?.focus();
  }, [active]);

  return !active ? (
    <NavBar
      backArrow={<LeftOutline color="#FFF"/>}
      style={{background: '#4a93ed'}}
      onBack={() => {
        Taro.navigateBack();  
      }}
      right={
        <View>
          <SearchOutline fontSize={20} onClick={() => setActive(true)} color="#FFF"/>
          {module_name !== 'Public_Leads' && <AddOutline style={{marginLeft: '16px'}} fontSize={20} onClick={() => onAddModule()} color="#FFF"/>}
        </View>
      }>
      <Text style={{color: '#FFF'}} className='webkit-hidden1'>{title}</Text>
    </NavBar>
  ) : (
    <View className='header'>
      <SearchBar
        ref={searchRef}
        placeholder='请输入搜索内容'
        showCancelButton={() => true}
        style={{
          'flex': 1,
          '--border-radius': '100px',
          '--background': '#ffffff',
          '--height': '32px',
          '--padding-left': '12px',
        }}
        clearable={false}
        onChange={(e) => {
          setSearchKey(e);
          onChange(e);
        }}
        onSearch={_.throttle(() => {
          onSearch(searchKey);
          setIsSearch(true);
        }, 2000, {leading: true, trailing: false})}
        onCancel={() => {
          setActive(false);
          if (isSearch && searchKey) {
            onCancel();
            setIsSearch(false);
          }
        }}
      />
    </View>
  )
}