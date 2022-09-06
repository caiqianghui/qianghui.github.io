import {useState} from 'react';
import { Divider} from 'antd';
import FormItem from './FormItem';
import {View} from '@tarojs/components';
import {
  UpOutline,
} from 'antd-mobile-icons';
import { AutoCenter, Collapse, Skeleton } from 'antd-mobile';

export default (props) => {
  const { section, data, form } = props;
  const fields = section.fields.filter(
    (field) =>
      field.type !== 'Fields::AutoNumberField' &&
      field.mobile_view.indexOf(data.id ? 'edit' : 'new') !== -1 &&
      field.accessibility !== 'hidden' &&
      field.hidden !== true
  );

  const [activeKey, setActiveKey] = useState('1');

  return (
    <View className="form-container-container-base">
      {form.category !== 'step_form' ? (
        <Collapse className="form-container-collapse" activeKey={[activeKey]}>
          <Collapse.Panel className="form-container-collapse-content" key='1' onClick={() => setActiveKey(activeKey ? '' : '1')} title={section.title}>
            <View className="form-container-collapse-content-select">
              {fields.length ? (
                fields.map((field) => {
                  return (
                    <FormItem key={field.id} field={field}/>
                  )
                })
              ) :null}
              <View className='buttomBtn' onClick={() => setActiveKey('')}>
                <AutoCenter className="buttomBtnText">收起{section.title}<UpOutline /></AutoCenter>
              </View>
            </View>
          </Collapse.Panel>
        </Collapse>
      ) : (
        <View className="collapse-panel-content">
          {fields.length ? (
            fields.map((field) => {
              return (
                <FormItem key={field.id} field={field}/>
              )
            })
          ) : (
            <>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
            </>
          )}
        </View>
      )}
    </View>
  );
};
