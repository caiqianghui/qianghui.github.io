import { View, Text } from "@tarojs/components";
import { Form } from "antd";
import { Collapse, Dialog } from "antd-mobile";
import {
  AddOutline,
  DownOutline,
  RightOutline,
  DeleteOutline,
} from 'antd-mobile-icons';
import { useContext, useState } from "react";
import { FormContainerContext } from "../../FormContainer";
import ListFiled from "./components/ListFiled";
import SumField from "./components/SumField";

export default (props) => {
  const { section, data, form } = props;
  const [visible, setVisible] = useState(false);
  const field = section.fields.filter(
    (field) =>
      field.mobile_view.indexOf(data.id ? 'edit' : 'new') !== -1 &&
      field.accessibility !== 'hidden',
  );
  const fieldNmae = field ? field.key : '';
  const [fieldData, setFieldData] = useState(data && data[fieldNmae] || []);
  const [activeKey, setActiveKey] = useState<any>('');
  const [isDlete, setIsDelete] = useState(false);
  const {
    subFormOptions
  } = useContext<any>(FormContainerContext);
  const subFormName = section.fields[0].name;

  return (
    <View className="form-container-container-sub">
        <Collapse>
          <Collapse.Panel key="" title={section.title}>
            <Form.List name={section['fields'][0]['name']} >
              {(fields, {add, remove}, {errors}) => {
                return (
                  <>
                    <Collapse className="form-container-collapse" accordion activeKey={activeKey + ''}>
                      {fields.map((record, index) => {
                         const isHiddenDelete = subFormOptions.hasOwnProperty(`${subFormName}_hidden_delete`) && 
                          (!subFormOptions[`${subFormName}_hidden_delete`] ||
                          (Array.isArray(subFormOptions[`${subFormName}_hidden_delete`]) && subFormOptions[`${subFormName}_hidden_delete`].indexOf(index) !== -1));
                        return (
                          <Collapse.Panel
                            className="form-container-collapse-content" 
                            title={section.title + (record.name + 1)}
                            key={record.name + ''}
                            onClick={() => setActiveKey(!isDlete ? activeKey === record.name ? '' : record.name : '')}
                            arrow={(active) => {
                            return (
                              <View className="form-container-collapse-content-arrow">
                                {!active ? <RightOutline /> : <DownOutline />}
                                {!isHiddenDelete && 
                                <View
                                  className="delete"
                                  onClick={() => {
                                    setIsDelete(true);
                                    Dialog.show({
                                      content: '确认删除',
                                      closeOnAction: true,
                                      actions: [
                                        [
                                          {
                                            key: 'cancel',
                                            text: '取消',
                                            onClick: () => {
                                              setIsDelete(false);
                                            }
                                          },
                                          {
                                            key: 'delete',
                                            text: '删除',
                                            bold: true,
                                            danger: true,
                                            onClick: () => {
                                              setIsDelete(false);
                                              remove(record.name); setFieldData(fieldData.filter(item => fieldData[record.name] !== item));
                                            }
                                          },
                                        ],
                                      ],
                                    });
                                  }}>
                                  <DeleteOutline color='var(--adm-color-danger)' />
                                </View>
                                }
                              </View>
                            )
                          }}>
                            <ListFiled setActiveKey={setActiveKey} {...{fieldData, section, record, index, remove, setFieldData}}  key={index} showVisible={visible} field={field[0]} />
                          </Collapse.Panel>
                        )
                      })}
                    </Collapse>
                  {!subFormOptions.hasOwnProperty(`${subFormName}_hidden_add`) ? (
                    <View onClick={() => {add(), setVisible(true)}} className="form-container-container-sub-add">
                      <Text className='form-container-container-sub-add-title'>
                        {section.title}
                        <AddOutline/>
                      </Text>
                    </View>
                  ): null}
                    <Form.ErrorList errors={errors} />
                  </>
                )
              }} 
            </Form.List>
            {field.filter((item) => item.type === 'Fields::SumField').map((item, index) => {
              return <SumField {...{fieldData, index, data, section}} key={item.id} type={data.id ? 'edit' : 'new'} field={item}  />
            })}
          </Collapse.Panel>
        </Collapse>
    </View>
  )
}