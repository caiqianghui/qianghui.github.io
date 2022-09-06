/**
 * 电话开发
 */

import { View, Text, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { NavBar, SearchBar } from "antd-mobile"
import { AddOutline } from 'antd-mobile-icons'
import { useState } from "react"
import { List, Image } from 'antd-mobile'

const rowCount = 1000;

const item = {
  avatar:
    'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  name: 'Novalee Spicer',
  description: 'Deserunt dolor ea eaque eos',
};

const data = Array(rowCount).fill(item);

export default () => {

  const [showTitle, setShowTitle] = useState(false);

  return (
    <View className='list-content-content' style={{background: '#FFF'}}>
      <NavBar onBack={() => Taro.navigateBack()} right={<AddOutline fontSize={22} color={'var(--adm-color-primary)'}/>}>{showTitle ? '通讯录' : ''}</NavBar>
      <View style={{flex: 1, overflowY: 'scroll'}}>
        <ScrollView style={{height: '100%'}} scrollY={true}
          onScroll={(e) => {
            setShowTitle(e.detail.scrollTop > 33);
          }}>
          <Text style={{fontSize: '26px', paddingLeft: '20px'}}>通讯录</Text>
          <View style={{padding: '10px 20px'}}>
            <SearchBar placeholder="搜索"/>
          </View>
          <List>
            {data.map((item, index) => {
              return (
                <List.Item
                  key={index}
                  prefix={
                    <Image
                      src={item.avatar}
                      style={{ borderRadius: 20 }}
                      fit='cover'
                      width={40}
                      height={40}
                    />
                  }
                  description={item.description}
                >
                  {item.name} {index}
                </List.Item>
              )
            })}
          </List>
        </ScrollView>
      </View>
    </View>
  )
}