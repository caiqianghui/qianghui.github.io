import { useEffect, useState, useContext } from 'react';
import { Form, Divider, Radio, Space } from 'antd';
import { getRules } from 'src/utils/utils';
import { FormContainerContext } from '../../FormContainer';
import TextField from "../FormElement/elements/TextField";
import { Collapse } from 'antd-mobile';

const SelectAddress = (props) => {
  const { addresses } = useContext<any>(FormContainerContext);
  const { section, data, form } = props;
  const [isSelect, setIsSelect] = useState(false);

  useEffect(() => {
    setIsSelect(!data.id);
  }, [data]);

  const contentRender = () => {
    return (
      <div className="baseForm">
        <Form.Item name={section.fields[0].name} style={{ marginBottom: 10 }} rules={getRules(section.fields[0])}>
          <TextField field={section.fields[0]} placeholder={isSelect ? '请输入或选择地址' : ''} isDisable={!isSelect} />
        </Form.Item>
        {data.id && (
          <p style={{ marginLeft: 5, marginBottom: 10 }}>
            {isSelect ? (
              <a onClick={() => setIsSelect(false)}>
                {'确定'}
              </a>
            ) : (
              <a onClick={() => setIsSelect(true)}>
                {'修改'}
              </a>
            )}
          </p>
        )}
        {isSelect && Object.keys(addresses).length > 0 && (
          <div style={{ backgroundColor: '#fafafa', padding: 20, maxHeight: 210, overflow: 'scroll' }}>
            <Form.Item name={section.fields[0].name} style={{ marginBottom: 0 }}>
              <Radio.Group>
                {Object.keys(addresses).map((key) => {
                  return (
                    (addresses[key] || []).length > 0 && (
                      <div key={key}>
                        <Divider
                          orientation="left"
                          style={{
                            margin: '10px 0',
                            borderColor: '#fafafa',
                            color: 'gray',
                            fontSize: 13,
                            fontWeight: 'normal',
                          }}
                        >
                          {key} {'地址'}
                        </Divider>
                        <Space direction="vertical">
                          {addresses[key].map((item) => {
                            return (
                              <Radio key={item.id} value={item.address}>
                                {item.address}
                              </Radio>
                            );
                          })}
                        </Space>
                      </div>
                    )
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {form.category === 'step_form' ? (
        contentRender()
      ) : (
        <Collapse>
          <Collapse.Panel key='0' title={section.title}>
            {contentRender()}
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  );
};
export default SelectAddress;
