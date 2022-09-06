import { useEffect, createContext, useState } from 'react';
import {
  Form,
  message,
} from 'antd';
import Section from '../Section';
import { ScrollView, View, Text } from "@tarojs/components";
import { Mask, NavBar, Toast } from "antd-mobile";
import "antd/dist/antd.css";
import './index.scss';
import Taro from '@tarojs/taro'
import NetCloudFun from 'src/pages/services/functions';
import HttpLoading from 'src/utils/http/HttpLoading';

export const FormContainerContext = createContext({});

export default (props) => {
  const { form, sections, data, customRefForm, module, title, id } = props;
  const [refForm] = customRefForm || Form.useForm();

  const [loading, setLoading] = useState(false);
  const [zohoUser, setZohoUser] = useState();

  // 获取zoho 用户信息
  const getZOHOuser = () => {
    const zohoUser = Taro.getStorageSync('currentUser');
    if (zohoUser) {
      setZohoUser(zohoUser);
    }
  }

  useEffect(() => {
    getZOHOuser();
  }, []);

  const submitForm = () => {
    const token = 'Bearer NYbImmWjVdyN8Dh8PPq4XqVuKNCNWcp5dCDa8o2Xtyg';
    refForm.validateFields().then(values => {
      if (module === 'Leads') {
        const formData: any = {};
        if (values.Phone) {
          formData.phone = values.Phone;
        } else {
          delete formData.phone;
        }
        if (values.Company) {
          formData.name = values.Company;
        } else {
          delete formData.name;
        }

        // 编辑时候看是否有改动 未改动删除查重的值
        if (id) {
          if (values.Company === data.Company) {
            delete formData.name;
          }
          
          if (values.Phone === data.Phone) {
            delete formData.phone;
          }
        }
        if (formData.phone || formData.name) {
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
            // console.log('ref', res);
            if (res.code === 200) {
              if (res.data.result === '无重复') {
                onFinish(values);
              } else {
                setLoading(false);
                Toast.show({
                  content: <View style={{display: 'flex', flexDirection: 'column'}}>
                    {res.data.result.map((item, index) => {
                      return (
                        <Text key={index}>{item}</Text>
                      )
                    })}
                  </View>,
                  duration: 5000,
                })
              }
            }
          }).catch(() => {
            setLoading(false);
          });
        } else {
          onFinish(values);
        }
      } else {
        onFinish(values);
      }
    }).catch(errorInfo => {
      // 锚点链接自动滚动
      let valueName = document.getElementById(errorInfo.errorFields[0].name[0]);
      if (valueName) {
        valueName.scrollIntoView();
      }
      errorInfo.errorFields.forEach(info => {
        message.error(info.errors);
      })
      // message.error(`表单有${errorInfo.errorFields.length}处填写错误，请根据提示修改后提交`);
    })
  }

  const onFinish = (values: any) => {
    setLoading(true);
    const show = {
      name: '',
      description: '',
      phone: '',
      amount: 0,
    }
    switch (module) {
      case 'Leads':
        show.name = values.Company;
        show.description = values.Full_Name;
        show.phone = values.Phone;
        break;
      case 'Potentials':
        show.name = values.Deal_Name;
        show.description = values.Stage;
        show.amount = values.Amount;
        break;
      case 'Accounts':
        show.name = values.Account_Name;
        show.description = values.Department;
        show.phone = values.Phone;
        break;
      case 'Public_Leads':
        show.name = values.Name;
        show.description = values.Last_Name;
        show.phone = values.Phone;
        break;
    }

    if (id) {
      console.log('编辑');
      NetCloudFun.put(`/crm/v2/${module}/${id}`, {
        data: [{
          ...values
        }]
      }).then((res: any) => {
        // console.log('res', res);
        if (res.data) {
          if (res.data[0].code === 'SUCCESS') {
            // setLoading(false);
            message.success('修改成功');
            Taro.navigateBack();
          } else {
            message.error('修改失败，请重试');
          }
        }
      }).catch((err) => {
        setLoading(false);
        console.log(err);
        message.error('修改失败，请重试');
        // Taro.hideLoading();
      })
    } else {
      NetCloudFun.post(`/crm/v2/${module}`, {
        data: [{
          ...values
        }]
      }).then((res: any) => {
        console.log('res', res);
        if (res.data) {
          if (res.data[0].code === 'SUCCESS') {
          //  setLoading(false);
            message.success('创建成功');
            Taro.redirectTo({
              url: `pages/main/workbench/zoho/show/index?module_name=${module}&zoho_id=${res.data[0].details.id}&title=${title}&name=${show.name}&description=${show.description}&phone=${show.phone}&amount=${show.amount}`
            })
            // 监听列表新增
            Taro.eventCenter.trigger('addItem', {...values, ...res.data[0].details});
          } else {
            message.error('创建失败，请重试');
          }
        }
      }).catch((err) => {
        console.log(err);
        setLoading(false);
        message.error('创建失败，请重试');
        // Taro.hideLoading();
      })
    }
  }

  const providerValue = {
    ...props,
    refForm,
    zohoUser,
  };

  return (
    <FormContainerContext.Provider value={providerValue}>
      <NavBar onBack={() => {
        if (props.open_type === 'show') {
          props.onBack && props.onBack();
        } else {
          Taro.navigateBack();
        }
      }} right={<Text className='form-save' onClick={() => {
        if (!loading) {
          submitForm();
        }
      }}>保存</Text>}>{id ? '编辑': '创建'}</NavBar>
      <ScrollView className="form-container">
        <Form
          form={refForm}
          layout="horizontal"
          labelWrap
          onFinish={onFinish}
        >
          {sections.filter(item => !item.hidden).map((section, index) => {
              return <Section key={index} form={form} data={data} section={section} />
            })
          }
        </Form>
        <View className='submit-btn'>
          {/* <Button block color='primary' onClick={() => submitForm()}>
            {'提交'}
          </Button> */}
        </View>
      </ScrollView>
      <Mask visible={loading} />
    </FormContainerContext.Provider>
  )
}