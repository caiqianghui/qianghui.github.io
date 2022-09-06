// 客户查重
import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components'
import './index.scss'
import { Button, Form, Input, NavBar, Space } from 'antd-mobile';
import _ from 'lodash';
import Taro from '@tarojs/taro';
import HttpLoading from "src/utils/http/HttpLoading";
import { AddOutline, LeftOutline, SearchOutline } from 'antd-mobile-icons'

const token = 'Bearer NYbImmWjVdyN8Dh8PPq4XqVuKNCNWcp5dCDa8o2Xtyg';

const Index = () => {
  // 地址栏ID
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');  
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>();

  const onSearch = () => {
    const formData: any = {};
    if (phone) {
      formData.phone = phone;
    } else {
      delete formData.phone;
    }

    if (name) {
      formData.name = name;
    } else {
      delete formData.name;
    }

    setLoading(true);
    HttpLoading.post('/api/v1/functions/account_duplicate_check/execute', {
      params: {
        form_data: formData
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then((res: any) => {
      // 查询后填入的值
      console.log('ref', res);
      if (res.code === 200) {
        setData(res.data);
        setLoading(false);
      }
    }).catch((err) => console.log(err));
  };

  useEffect(() => {
  }, []);

  return (
    <View className='list-content-content'>
      <NavBar
        backArrow={<LeftOutline color="#FFF"/>}
        style={{background: '#4a93ed'}}
        onBack={() => {
          Taro.navigateBack();  
        }}
        >
        <Text style={{color: '#FFF'}} className='webkit-hidden1'>查重</Text>
      </NavBar>
      <View className='main'>
        <Form
          layout='horizontal'
          footer={
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Button
                loading={loading}
                shape='default'
                block
                style={{background: '#4a93ed', color: '#FFF'}}
                onClick={() => onSearch()}
                size='middle'
              >
                <Space>
                  <SearchOutline />
                  <span>搜索</span>
                </Space>
              </Button>
            </View>
          }>
          <Form.Item label='客户名称' name='name'>
            <Input placeholder='请输入客户名称' onChange={(e) => setName(e)} clearable />
          </Form.Item>
          <Form.Item label='手机号' name='phone'>
            <Input placeholder='请输入手机号' type="number" onChange={(e) => setPhone(e)} clearable/>
          </Form.Item>
        </Form>
        {data ? (
          <>
            {data.result === '无重复' ? (
              <View>
                <Text style={{color: 'red', fontSize: '14px', margin: '0px 20px', textAlign: 'center'}}>{data.result || ''}</Text>
                <Button color='primary' className='content-list-add' onClick={() => Taro.navigateTo({url: `pages/main/workbench/zoho/form/index?module_name=Leads&name=${name}&phone=${phone}`})}>
                  <Space>
                    <AddOutline fontSize={18} />
                    <span>新增线索</span>
                  </Space>
                </Button>
              </View>
            ) : <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>{data.result.map((item, index) => <Text style={{color: 'red', fontSize: '14px', margin: '0px 20px'}} key={index}>{item}</Text>)}</View>}
          </>
        ) : null}
      </View>
    </View>
  )
}

export default Index;
