import { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Button, Empty, NavBar, Popover, Skeleton, Tabs } from 'antd-mobile'
import { getSections } from 'src/pages/services/form'
import { getDataById, getLayoutRules } from '../form/service'
import { message, Modal, notification } from 'antd'
import { getApprovedLogs, getModelProcesses } from 'src/pages/services/model_process'
import { getLayoutRuleResult, isMeetConditions } from 'src/utils/utils'
import ApprovalLogs from './ApprovalLogs'
import Tabbar from './Tabbar'
import Overview from './Overview/index';
import SubFormSection from './SubFormSection'
import SectionItem from './SectionItem'
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';
import { executeFunction, getCustomWidgets } from 'src/pages/services/extension'
import { saveAs } from 'file-saver';
import FieldAttachments from './FieldAttachments'
import FieldImages from './FieldImages'
import {UnorderedListOutline, UndoOutline} from 'antd-mobile-icons'
import _ from 'lodash'

const {ctoMenu} = iBodor;
const {children} = ctoMenu;

export interface ApprovalBottonSettingMoudle {
  can_batch: boolean,
  enabled?: boolean,
  name: string,
  update_fields: Array<any>,
}

export interface ProcessNodeMoudle {
  approval_node: {
    approval_button_setting: {
      // 同意
      agree: ApprovalBottonSettingMoudle,
      // 编辑
      modify: ApprovalBottonSettingMoudle,
      // 拒绝
      reject: ApprovalBottonSettingMoudle,
      // 退回
      return: ApprovalBottonSettingMoudle,
      // 转交
      transfer: ApprovalBottonSettingMoudle,
      // 提交
      submit: ApprovalBottonSettingMoudle,
      // 加签
      append: ApprovalBottonSettingMoudle,
    },
    approver_ids: Array<string>,
    category: string,
    id: string,
    label: string,
    multiapprover_type: string,
    other_setting: {
      approval_pause_tip: string,
      approver_blank: string,
      siblings_auto_pass: boolean,
    },
    user_type: string,
  },
  current_approver_ids: Array<string>,
  approver_ids: Array<string>,
  approvers: Array<{
    email: string,
    id: string,
    name: string,
    role: string,
  }>,
  category: string,
  created_at: string,
  id: string,
  model_process_id: string,
  multiapprover_type: string,
  next_process_node_id: string,
  remark: null,
  sort_num: number,
  status: string,
  updated_at: string,
  user_type: string,
}

export interface ProcessMoudle {
  approval_process_id: string,
  approval_process_name: string,
  form_id: string,
  id: string,
  process_nodes: Array<ProcessNodeMoudle>,
  record_id: string,
  status: string,
}

const Content = () => {
  const module_name = getCurrentInstance().router?.params.module_name || '';
  const title = getCurrentInstance().router?.params.title || '';
  const id = getCurrentInstance().router?.params.id || '';
  const [currentUser, setcurrentUser] = useState<any>();

  const [data, setData] = useState<any>();
  
  const [sections, setSections] = useState<Array<any>>([]);
  const [fields, setFields] = useState<Array<any>>([]);

  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState<Module>();

  const [activeKey, setActiveKey] = useState('info');
  const moreRef = useRef<any>();

  const [processes, setProcesses] = useState<ProcessMoudle>();

  const [processLoading, setProcessLoading] = useState(false);

  const executeLayoutRule = (layoutRules, currentData, currentSections) => {
    if (layoutRules.length > 0) {
      layoutRules.forEach(layoutRule => {
        const newSections: any = getLayoutRuleResult(layoutRule, currentData, currentSections)[0];
        setSections(newSections);
        setFields(newSections.map((section) => section.fields).flat());
      })
    } else {
      setSections(currentSections);
      setFields(currentSections.map((section) => section.fields).flat());
    }
  }

  // 获取数据
  const getData = () => {
    setLoading(false);
    if (module_name && id && !loading) {
      getDataById(module_name, id).then((res) => {
        if (res.data) {
          setData({...res.data});
          setProcessLoading(false);
          refReshCustomWidgets(form, res.data, fields);
        }
        setLoading(true);
      })
    }
  }

  const [form, setForm] = useState<any>();
  const [customWidgets, setCustomWidgets] = useState<Array<any>>([]);

  useEffect(() => {
    setModule(children.find((item) => item.moduleName === module_name));

    getDataById(module_name, id).then((result) => {
      if (result.code === 200 && result.data) {
        const _data = result.data;
        setData(_data);
        setProcessLoading(false);
        getSections({form_name: module_name, translate: true}).then((res) => {
          if (res.code === 200 && res.data) {
            const _form = res.data.form;
            setForm(_form);
            getLayoutRules({form_id: _form.id}).then((res0) => {
              if (res0.code === 200 && res0.data) {
                const layoutRules = (res0.data && res0.data.datas) || [];
                executeLayoutRule(layoutRules, _data, res.data.sections);
                const _fields = res.data.sections.map((section) => section.fields).flat();
                refReshCustomWidgets(_form, _data, _fields);
              }
            });

          } else {
            message.error(res.tips);
            setLoading(true);
          }
        });
      } else {
        setData(undefined);
      }
      setLoading(true);
    })


    const cloudCurrentUser = Taro.getStorageSync('cloudCurrentUser');
    if (cloudCurrentUser) {
      setcurrentUser(cloudCurrentUser);
    }
  }, []);

  const refReshCustomWidgets = (form, data, fields) => {
    getCustomWidgets({ form_id: form.id, range: 'show' }).then((res) => {
      if (res.code === 200 && res.data) {
  
        const _customWidgets = res.data.datas.filter((item) => item.execute_type === 'invoke_custom_api').filter(item => {
          if (Object.keys(item.conditions).length > 0) {
            return isMeetConditions(item, item.conditions, data, fields);
          }
          return true;
        })
  
        setCustomWidgets(_customWidgets);
      }
    })
  };

  // 函数按钮方法
  const excueCustomWidget = (customWidget) => {
    moreRef.current && moreRef.current.hide();
    if (customWidget) {
      if (customWidget.execute_type === 'invoke_custom_api') {
        executeFunction({
          function_return_type: customWidget.custom_function_return_type,
          custom_function_key: customWidget.custom_function_key,
          params: { id: data.id },
        }).then((res) => {
          console.log(res, customWidget);
          if (customWidget.custom_function_return_type === 'file_stream') {
            // TODO 提示跳转外部链接下载
            saveAs(res, customWidget.custom_function_file_name);
          } else {
            getData();
            if (res.data.alert) {
              if (res.data.alert.type === 'modal') {
                Modal.info({
                  content: <div dangerouslySetInnerHTML={{__html: res.data.alert.message}} />,
                  icon: null,
                  okText: "确定"
                });
              } else {
                message[res.data.alert.type](res.data.alert.message);
              }
            } else {
              let type = 'success';
              let content = '执行成功';
              if (typeof res.data.result === 'string') {
                content = res.data.result;
                if (res.data.result.indexOf('Error：') !== -1) {
                  type = 'error';
                }
              }
              notification[type]({
                message: '执行结果',
                description: content,
              });
            }
          }
        });
      }
    }
  };

   // 刷新审批方法
  const freshProcess = (not_fresh_data = false) => {
    getModelProcesses({
      record_id: data.id,
      record_model: module_name,
    }).then((res) => {
      if (res.code === 200 && res.data) {
        const newProcess = res.data;
        console.log('newProcess', newProcess);
        if (newProcess) {
          newProcess.process_nodes.forEach(node => {
            if (node.status === "pause" || (node.status === "wait_audit" && node?.approval_node?.other_setting?.approval_pause)) {
              const condition = node?.approval_node?.other_setting?.approval_pause_conditions;
              const isMeet = isMeetConditions(condition, condition.search_condition_items, data, fields);
              if (isMeet) {
                node.status = 'pause';
              } else {
                node.status = 'wait_audit';
              }
            }
          })
          
          setProcesses(newProcess);
          if (not_fresh_data) {
            setProcessLoading(true);
            getData();
            // console.log('监听删除', id);
            Taro.eventCenter.trigger('deleteId', id);
          }
          freshApprovedLog({form_id: newProcess?.form_id, data_id: data.id});
        } else {
          setProcesses(undefined);
        }
      }
    });
  };

  useEffect(() => {
    if (data?.id) {
      freshProcess();
    }
  }, [data?.id, data?.updated_at]);

  // 日志数据
  const [approvalLogs, setApprovalLogs] = useState([]);
  
  // 日志数据分页
  const [approvalLogPagination, setApprovalLogPagination] = useState<any>({});
  const [page, setPage] = useState(1);

  // 刷新请求日志方法
  const freshApprovedLog = (params: any) => {
    getApprovedLogs(params).then((res) => {
      setPage(params.page || 1);
      if (res.code === 200 && res.data) {
        if (params.page) {
          setApprovalLogs(approvalLogs.concat(res.data.datas));
        } else {
          setApprovalLogs(res.data.datas);
        }
        setApprovalLogPagination(res.data.info);
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  const sectionRender = (section) => {
    if (section.category === 'address') {
      return <p>{section.fields[0] && data[section.fields[0].name]}</p>;
    }

    if (section.category === 'attachment' && data.id) {
      return <FieldAttachments section={section} moduleName={module_name} data={data} field={section.fields[0]} canUpdated={data.can_updated} />
    }

    if (section.category === 'image' && data.id) {
      return <FieldImages section={section} moduleName={module_name} data={data} field={section.fields[0]} canUpdated={data.can_updated} />
    }

    if (section.category === 'sub_form' && data.id) {
      return <SubFormSection section={section} data={data} showAll={showAll} module_name={module_name}/>
    }

    return (
      <SectionItem section={section} data={data} showAll={showAll} module_name={module_name} /> 
    )
  }
  
  // 信息列表
  const Info = () => {
    return (
      <>
        {
          sections.filter(section => !section.hidden && (section.category === 'sub_form' ? section.fields[0].accessibility !== 'hidden' : true) && section.fields.filter(item => item.accessibility !== 'hidden' && item.view.indexOf('show') !== -1).length > 0).map((section, index) => {
            return (
              <View key={index}>
                {sectionRender(section)}
              </View>
            )
          })
        }
        <View className='showall'>
          <Text onClick={() => {setShowAll(!showAll);}}>{!showAll ? '显示全部字段' : '切换智能是视图'}</Text>
        </View>
      </>
    )
  }

  return (
    <View className='show-index '>
      <NavBar right={<View>
        <UndoOutline style={{marginRight: '10px'}} fontSize={22} onClick={_.throttle(() => {
          freshProcess(true);
        }, 5000)}/>
        {customWidgets.length ? (
          <Popover
            ref={moreRef}
            placement='top'
            trigger='click'  
            content={
              <View style={{display: 'flex', flexDirection: 'column'}}>
                {customWidgets.map((item) => {
                return (
                  <Text key={item.id} onClick={() => excueCustomWidget(item)} style={{padding: '4px'}} className='widgetsBtn-content-list-item'>{item.name}</Text>
                )
              })}
              </View>
            }>
            <UnorderedListOutline fontSize={22}/>
          </Popover>
        ) : null}
      </View>} style={{background: '#FFF'}} onBack={() => Taro.navigateBack()}>{title}</NavBar>
      {loading || data ? (
        <>
          {data ? (
            <>
              <ScrollView className='content-list' scrollY={true}>
                <View className="content">
                  <Header data={data} />
                </View>
                <View style={{position: 'sticky', top: 0, zIndex: 100, background: '#F6F6F6'}}>
                  <Tabs activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
                    <Tabs.Tab title='信息' key='info' />
                    {processes && <Tabs.Tab title='流程' key='over' />}
                  </Tabs>
                </View>
                <Tabs className='tabs-hiddern' activeKey={activeKey}>
                  <Tabs.Tab title='信息' key='info'>
                    <View className='content-detail'>
                      {sections.length ? <Info /> :  <SkeletonLoad />}
                    </View>
                  </Tabs.Tab>
                  {processes && <Tabs.Tab title='流程' key='over'>
                    <View className='content-detail'>
                      <Overview
                        freshProcess={freshProcess}
                        currentUser={currentUser}
                        fields={fields.filter(
                          (field: any) =>
                            field.mobile_view.indexOf('show') !== -1 &&
                            field.accessibility !== 'hidden',
                        )}
                        data={data}
                        moduleName={module_name} 
                        setProcesses={setProcesses}
                        processes={processes}
                      />
                      <ApprovalLogs info={approvalLogPagination} onMove={() => {
                        freshApprovedLog({
                          page: page + 1,
                          form_id: processes?.form_id,
                          data_id: data.id
                        });
                      }} datas={approvalLogs}/>
                    </View>
                  </Tabs.Tab>}
                </Tabs>
              </ScrollView>
              <Tabbar module={module} loading={processLoading} module_name={module_name} currentUser={currentUser} freshProcess={() => freshProcess(true)} data={data} processes={processes} />
            </>
          ) : (
            <View>
              <Empty
                style={{ padding: '64px 0' }}
                imageStyle={{ width: 128 }}
                description='数据已丢失'
              />
              <View style={{padding: '40px'}}>
                <Button block onClick={() => Taro.navigateBack()}>返回</Button>
              </View>
            </View>
          )}
        </>
      ) : <SkeletonLoad />}
    </View>
  )
}

export default Content
 
const Header = ({data}) => {
    
  const [avatalColor] = useState((Math.floor(Math.random() * 10) + 1));
  const [content, setContent] = useState<any>();
  const [name, setName] = useState<string>('');

  useEffect(() => {
    setContent(data);
    setName(data.name || data.number || data.code || '--')
  }, [data]);

  return content ? (
    <View className='head row'>
      <View className={'left ' + `left${avatalColor }`}>
        <Text>{name[0]}</Text>
      </View>
      <View className='right col'>
        <Text className='name'>{name}</Text>
        {data && (
          <>
            <Text>{data.creator_id.name}</Text>
            <Text>{data.updated_at}</Text>
          </>
        )}
      </View>
    </View>
  ) : <></>
}


const SkeletonLoad = () => 
  <View style={{padding: '20px'}}>
    <Skeleton.Title animated />
    <Skeleton animated className='customSkeleton' />
    <Skeleton.Paragraph lineCount={5} animated />
  </View>