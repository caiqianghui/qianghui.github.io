import { View, Text } from "@tarojs/components";
import { Popup, Tag } from "antd-mobile";
import { useEffect, useState } from "react";
import { DownOutline, UpOutline } from 'antd-mobile-icons';

interface Props {
  section: any;
  data: any;
  showAll: boolean;
  module_name: string;
}

export default (props: Props) => {
  const {section, showAll, data, module_name} = props
  const [textarea, setTextarea] = useState('');
  const [active, setActive] = useState(true);
  const [fields, setFields] = useState<Array<any>>([]);

  useEffect(() => {
    // 筛选不为空的数据
    let _fields: any = [];
    if(section) {
      section.fields.filter((field) => field.mobile_view.indexOf('show') !== -1 && field.accessibility !== 'hidden' && !field.hidden).forEach((field) => {
        if (data[field.name]) {
          _fields.push(field);
        }
      });
      setFields(!showAll ? _fields : section.fields);
    }
  }, [section, showAll]);

  return fields.length ? (
    <>
      <View className='content-detail-content'>
        <View className='content-detail-content-top' onClick={() => {
          setActive(!active);
          console.log(section)
        }}>
          <Text className='content-detail-content-name'>{section.title}</Text>
          {active ? <UpOutline /> :
          <DownOutline />}
        </View>
        <View style={active ? {display: 'block'} : {display: 'none'}}>
          {fields.map((field, index) => {
            return (
              <View key={index} className='detail-item-row' onClick={() => console.log(field)}>
                {renderField(field, data, module_name)}
              </View>
            )
          })}
        </View>
      </View>
      <Popup
        visible={!!textarea}
        bodyStyle={{height: '40vh'}}
        onMaskClick={() => setTextarea('')}
      >
        <View className='popup-textarea'>
          <Text>{textarea}</Text>
        </View>
      </Popup>
    </>
  ) : <></>;

}


const renderField = (field: any, data: any, module_name) => {
  let text =
    (field.type === 'Fields::ResourceField' ||
    field.type === 'Fields::UserField'
      ? data[field.name] && data[field.name].name
      : data[field.name]) || '-';
  if (field.type === 'Fields::SelectField' && field.options.tag_show) {
    const choice = field.choices.filter((c: any) => c.label === text)[0];
    text = (
      <Text style={{color: choice && choice.color}}>
        {text}
      </Text>
    );
  } else if (field.type === 'Fields::ProvinceCityAreaField' && text !== '-') {
    text = <Text>{text.join(' ')}</Text>;
  }

  let showText = text;
  if (field.type === 'Fields::DecimalField' && !field.options.hide_currency) {
    showText = <Text>{text}</Text>;
  } else if (field.type === 'Fields::BooleanField' && text !== '-') {
    showText = <Text>√</Text>;
  } else if (
    field.type === 'Fields::ResourceField' &&
    [
      'warehouses',
      'categories',
      'brands',
      'units',
      'pricing_systems',
    ].indexOf(field.options.data_source_type) === -1 &&
    text !== '-'
  ) {
    showText = (
      <Text>
        {text}
      </Text>
    );
  }

  let color = '#333';

  if (field.type.indexOf('DecimalField') !== -1) {
    color = '#f54b45';
  } else if (field.name === 'status' && module_name === 'Contracts') {
    switch (data.status) {
      case '审批拒绝':
        color = '#ec2c64'
        break;
      case '审批中':
        color = '#1661ab'
        break;
      case '审批完成':
        color = '#2c9678'
        break;
      case '终止关闭':
        color = '#ec2c64'
        break;
      default:
        color = '#b2bbbe'
        break;
    }

    showText = <Tag color={color}>{text}</Tag>
  }


  

  return (
    <View className="content-detail-content-content">
      <Text className="content-detail-content-label">
        {field.label}
      </Text>
      <Text className="content-detail-content-text" style={{color}}>{showText}</Text>
    </View>
  );
};
