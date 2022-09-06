import { View, Text } from "@tarojs/components";
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useEffect, useState } from "react";
import { Table } from "antd";
import { Ellipsis, Modal, Popup } from "antd-mobile";

interface Props {
  section: any,
  data: any,
  showAll: boolean,
  module_name: string,
}

export default (props: Props) => {
  const {section, showAll, data, module_name} = props
  const [active, setActive] = useState(true);
  const [fields, setFields] = useState<Array<any>>([]);

  useEffect(() => {
    // 筛选不为空的数据
    if (section) {
      let _fields: any = [];
      section.fields.forEach((field) => {
        if (data[field.name]) {
          _fields.push(field);
        }
      });
      setFields(!showAll ? _fields : section.fields);
    }
  }, [section, showAll]);

  return fields.length ? (
    <View className='content-detail-content content-detail-sub-form'>
      <View className='content-detail-content-top' onClick={() => setActive(!active)}>
        <Text className='content-detail-content-name'onClick={() => console.log(fields)
        }>{section.title}</Text>
        {active ? <UpOutline /> :
        <DownOutline />}
      </View>
      <View style={active ? {display: 'flex', flexDirection: 'column'} : {display: 'none'}} >
        {fields.map((field, index) => {
          return (
            <View key={index}>
              {field.fields.length && data[field.name].length ? (
                <PotentialsTable datas={data[field.name]} fields={field.fields} module_name={module_name}/>
              ) : null}
            </View>
          )
        })}
      </View>
    </View>
  ) : <></>;
}

const PotentialsTable = ({datas, fields, module_name}) => {

  const getColumns = () => {
    const colums = fields
    .filter((field) => field.view.indexOf('show') !== -1 && field.accessibility !== 'hidden')
    .map((field, index) => {
      return {
        key: index,
        title: field.label,
        dataIndex: field.name,
        width: field.column_width || 150,
        render: (text, record) => {
          if (
            module_name === 'sales_orders' &&
            field.name === 'original_price' &&
            record.price &&
            text !== record.price
          ) {
            return (
              <s style={{ color: '#909FA7' }}>
                {text || 0}
              </s>
            );
          }
          if (field.type === 'Fields::DecimalField' && !field.options.hide_currency) {
            return <span style={{color: '#f54b45'}}>{text ? Number(text).toFixed(2) : 0}</span>;
          }
          if (field.type === 'Fields::ResourceField' || field.type === 'Fields::UserField') {
            let showName = (record[field.name] && record[field.name].name) || '-';
            if (field.options.data_source_type === 'products') {
              showName =
                (record[field.name] && `[${record[field.name].code}]${record[field.name].name}`) ||
                '-';
            }
            if (
              field.type === 'Fields::ResourceField' &&
              ['warehouses', 'categories', 'brands', 'units', 'pricing_systems'].indexOf(
                field.options.data_source_type,
              ) === -1
            ) {
              return record[field.name] ? (
                  {showName}
              ) : showName;
            }

            return showName;
          }
          if (field.type === 'Fields::MultipleResourceField' && ['warehouses', 'categories', 'brands', 'units', 'pricing_systems'].indexOf(field.options.data_source_type) === -1) {
            return text ? text.map((item, index) => {
              return (
                <Text key={index}>{item.name || 'none'}</Text>
              )
            }) : (
              ''
            );
          } 
          if (field.type === 'Fields::ProvinceCityAreaField') {
            return text ? text.join(' ') : '-';
          }
          // if (field.type === 'Fields::BooleanField') {
          //   return text ? <CheckOutlined /> : '';
          // }

          // if (field.type === 'Fields::MultipleAttachmentField') {
          //   return <FieldAttachments moduleName={module_name} data={record} field={field} canUpdated={data.can_updated} />
          // }
      
          // if (field.type === 'Fields::MultipleImageField') {
          //   return <FieldImages moduleName={module_name} data={record} field={field} canUpdated={data.can_updated} />
          // }

          if (field.type === 'Fields::TextAreaField') {
            return <Ellipsis onContentClick={() => {
              Modal.show({
                title: field.label,
                content: text || '-',
                closeOnMaskClick: true,
              })
            }} style={{width: field.column_width || 150, color: '#5966da'}} direction='end' content={text || '-'} />
          }

          return text || '-'
        },
      };
    });
    return  colums
  }
  return (
    <View className='potentials-table' onClick={() => console.log(fields, datas)}>
      <Table size={'small'} columns={getColumns()} dataSource={datas} pagination={false}/>
    </View>
  )
}


const renderField = (field: any, data: any) => {
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
  return (
    <View>
      <Text>
        {field.label}: {showText}
      </Text>
    </View>
  );
};