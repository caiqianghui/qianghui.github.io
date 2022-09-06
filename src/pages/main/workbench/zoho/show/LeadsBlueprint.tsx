/**
 * 识别客户蓝图
 */

import { NavBar, Popup, Form, Mask } from "antd-mobile"
import {View, Text} from '@tarojs/components'
import './index.scss';
import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";
import { message } from "antd";
import FormElement from "../form/components/Section/FormElement";
import Taro from "@tarojs/taro";

interface Props {
  refresh: () => void;
  data: any;
}

export default (props: Props) => {
  
  const {data, refresh} = props;

  const [blues, setBlues] = useState<Array<any>>();
  const [blueprintInfo, setBluePrintInfo] = useState();
  const [showBlueprint, setShowBlueprint] = useState(false);
  
  useEffect(() => {
    getBluePrint();
  }, []);

  const getBluePrint = () => {
    NetCloudFun.get(`/crm/v3/Leads/${data.id}/actions/blueprint`).then((res: any) => {
      if (res && res.blueprint) {
        setBlues(res.blueprint.transitions);
      }
    }).catch((err) => {
      console.log(err);
      // Taro.hideLoading();
    })
  }

  return (
    <View>
      {blues ? (
        <>
        <Text>迁移：
          {blues.map((blue, index) => {
            return (
              <Text
                className='lead-status'
                key={index}
                onClick={() => {
                  setBluePrintInfo(blue);
                  setShowBlueprint(true);
                  console.log(blue);
                }}
              >
                {blue.name}
              </Text>
            )})
          }
          </Text>  
        </>
      ) : null}
      <Popup visible={showBlueprint} bodyStyle={{height: '80vh'}}>
        <Blueprint blue={blueprintInfo} data={data} onSave={(e) => {
          setShowBlueprint(false);
          if (e === 'SUCCESS') {
            refresh();
            getBluePrint();
          }
        }}/>
      </Popup>
    </View>
  )
}

interface BlueprintProps {
  data: any;
  blue: any;
  onSave: (e?: string) => void;
}

 const Blueprint = (props: BlueprintProps) => {

  const {onSave, data, blue} = props;
  const [fields, setFields] = useState<Array<any>>();
  const [copyFields, setCopyFields] = useState<Array<any>>();

  const [formRef] = Form.useForm();
  const [tip, setTip] = useState<any>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(blue);
    // 当前状态列
    if (blue && blue.fields) {
      setTip(blue.fields.find((field) => field.data_type === 'message'))
      setFields(blue.fields.filter((field) => field.data_type !== 'message'));
      setCopyFields(blue.fields.filter((field) => field.data_type !== 'message'));
    }
  }, [blue]);

  const onFinish = (values) => {
    setLoading(true);
    Taro.showLoading();
    NetCloudFun.put(`/crm/v3/Leads/${data.id}/actions/blueprint`, {
      blueprint: [{transition_id: blue.id, data: {...values}}],
    }).then((res: any) => {
      console.log('res', res);
      if (res &&  res.code === 'SUCCESS' && res.status === 'success') {
        if (blue.name === '无法满足' || blue.name === '不合格' || blue.name === '转换商机') {
          message.success('操作成功');
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        } else {
          onSave('SUCCESS');
        }
      }
      setLoading(false);
      Taro.showLoading();
    }).catch((err) => {
      console.log(err);
      setLoading(false);
      Taro.showLoading();
      // Taro.hideLoading();
    })
    console.log('values', values);
  }

  // 接触
  const exposureFields = {
    api_name: 'Invalid_Contact',
    field_label: '接触后无效原因',
    data_type: 'picklist',
    pick_list_values: [
      {
        "display_value": "-None-",
        "actual_value": "-None-",
      },
      {
        "display_value": "工艺不符",
        "actual_value": "工艺不符",
      },
      {
        "display_value": "不需要",
        "actual_value": "不需要",
      },
      {
        "display_value": "误点",
        "actual_value": "误点",
      },
      {
        "display_value": "预算不足",
        "actual_value": "预算不足",
      },
      {
        "display_value": "非金属",
        "actual_value": "非金属",
      },
      {
        "display_value": "丢单",
        "actual_value": "丢单",
      },
      {
        "display_value": "重要客户",
        "actual_value": "重要客户",
      },
      {
        "display_value": "海外客户",
        "actual_value": "海外客户",
      },
      {
        "display_value": "购买配件",
        "actual_value": "购买配件",
      },
      {
        "display_value": "便携式",
        "actual_value": "便携式",
      },
    ]
  }

  // 未接触
  const noContentFields = {
    api_name: 'Non_Contact_Reason',
    field_label: '未接触原因',
    type: 'picklist',
    pick_list_values: [
      {
        "display_value": "-None-",
        "actual_value": "-None-",
      },
      {
        "display_value": "持续未接通",
        "actual_value": "持续未接通",
      },
      {
        "display_value": "空错停关",
        "actual_value": "空错停关",
      },
    ]
  }

  const onSelect = (type, e) => {
    if (blue && (blue.name === '不合格' || blue.name === '无法满足') && type === '无效原因') {
      if (e.display_value === '接触') {
        setFields(copyFields?.concat(exposureFields));
      } else if (e.display_value === '未接触'){
        setFields(copyFields?.concat(noContentFields));
      } else {
        setFields(copyFields);
      }
    }
  }

  return (
    <View className="accpunts-blueprint-content">
      <NavBar
        onBack={() => {
          onSave();
          setTip(undefined);
        }}
        right={
          <Text
            onClick={() => {
              formRef.validateFields().then(values => {
                onFinish(values);
                // console.log(data);
              }).catch(errorInfo => {
                // message.error(`表单有${errorInfo.errorFields.length}处填写错误，请根据提示修改后提交`);
              })
            }}
            style={{fontSize: '16px'}}
          >
            保存
          </Text>
        }
      >
        {blue && blue.name}
      </NavBar>
      <View className='form'>
        {tip ? (
          <Text>{tip?.content}</Text>
        ) : null}
        <Form layout='horizontal' mode='card' form={formRef} onFinish={onFinish}>
          {fields && fields.map((field, index) => {
            return (
              <Form.Item
                {...field}
                className="form-item-show"
                key={index}
                rules={[{required: true, message: field.field_label + '为空'}]}
                label={field.field_label}
                initialValue={blue.data[field.api_name]}
                name={field.api_name}>
                <FormElement field={field} onSelect={(value) => onSelect(field.field_label , value)} />
              </Form.Item>
            )
          })}
        </Form>
      </View>
      <Mask visible={loading}/>
    </View>
  )
}