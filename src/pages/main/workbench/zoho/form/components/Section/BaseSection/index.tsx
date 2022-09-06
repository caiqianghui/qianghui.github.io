import {useState} from 'react';
import { Divider} from 'antd';
import FormItem from './FormItem';
import {View} from '@tarojs/components';
import {
  UpOutline,
} from 'antd-mobile-icons';
import { AutoCenter, Collapse, Skeleton } from 'antd-mobile';

export default (props) => {
  const { section, form, data } = props;
  const fields = !data.id ? section.fields.filter((field) => field.api_name !== 'Owner') : section.fields ;

  const [activeKey, setActiveKey] = useState('1');

  return (
    <View className="baseSectiosContent">
      {fields.length ? (
        <Collapse className="collapse-content" activeKey={[activeKey]}>
          <Collapse.Panel className="title-content" key='1' onClick={() => {
            setActiveKey(activeKey ? '' : '1');
            console.log('section', section);
          }} title={section.display_label}>
            <View className="collapse-panel-content">
              {fields.map((field) => {
                return (
                  <FormItem key={field.id} field={field} section={section} />
                )
              })}
              <View className='buttomBtn' onClick={() => setActiveKey('')}>
                <AutoCenter className="buttomBtnText">收起{section.display_label}<UpOutline /></AutoCenter>
              </View>
            </View>
          </Collapse.Panel>
        </Collapse>
      ) : null}
    </View>
  );
};
