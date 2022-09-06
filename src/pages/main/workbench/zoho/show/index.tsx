import { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'

import Taro, { getCurrentInstance, Events } from '@tarojs/taro'
import {
  MoreOutline,
  EditSOutline,
  RedoOutline,
} from 'antd-mobile-icons'
import { Button, DotLoading, Empty, Mask, NavBar, Popover, Popup, Skeleton, Tabs, Tag } from 'antd-mobile'
import dayjs from 'dayjs'
import {RightOutline, FingerdownOutline, DownOutline, UpOutline} from 'antd-mobile-icons';
import { getModuleText, thousandAbdDecimal } from 'src/utils/utils'
import _ from 'lodash'
import NetCloudFun from 'src/pages/services/functions'
import { Action } from 'antd-mobile/es/components/popover'
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';
import { message, notification } from 'antd'
import CallPhone from 'src/components/CallPhone'
import Blueprint from './Blueprint'
import LeadsBlueprint from './LeadsBlueprint'
import AccountsBluePrint from './AccountsBluePrint'
import Association from './Association'
import { deleteId, executeFunction } from 'src/pages/services/zoho/http'

const {ltcMenu, dealsBlueprint} = iBodor;
const {children} = ltcMenu;

export const ShowContainerContext = createContext({});

const Content = () => {
  const module_name = getCurrentInstance().router?.params.module_name || '';
  const zoho_id = getCurrentInstance().router?.params.zoho_id || '';

  const [module, setModule] = useState<Module>();

  const [actions, setActions] = useState<Array<Action>>([]);

  const [data, setData] = useState<any>();
  
  const [sections, setSections] = useState<Array<any>>([]);

  const [showAll, setShowAll] = useState(false);

  const [refreshKey, setRefreshKey] = useState<{
    time: Date,
    api_name: string
  }>();

  const [navbars, setNavbars] = useState([
    {
      key: 'edit',
      title: '编辑',
      icon: <EditSOutline fontSize={18} onClick={() => {
        Taro.navigateTo({url: `pages/main/workbench/zoho/form/index?type=edit&id=${zoho_id}&module_name=${module_name}`})
      }}/>,
    },
  ]);

  const [loading, setLoading] = useState(false);

  // 获取数据
  const getData = () => {
    if (module_name && zoho_id) {
      NetCloudFun.get(`/crm/v2/${module_name}/${zoho_id}`).then((res) => {
        // console.log(res);
        if (res.data) {
          setLoading(true);
          setData(res.data[0]);
          if (res.data[0]?.phone || res.data[0]?.Phone) {
            if (!navbars.find((tab) => tab.key === 'phone')) {
              setNavbars((tab) => {
                return tab.concat([{
                  key: 'phone',
                  title: '电话',
                  icon: <FingerdownOutline className='show-tabbar-btn-icon' onClick={() => {}}/>,
                }])
              });
            }
          }
        }
      }).catch((_err) => {
        setLoading(true);
      });
    }
  }

  const getFields = () => {
    if (module_name && zoho_id) {
      NetCloudFun.get(`/crm/v2/settings/layouts`, {
        module: module_name,
      }).then((res: any) => {
        if (res.layouts) {
          setSections(res.layouts[0].sections.filter((item) => item.name !== 'Record Image'));
          getData();
        }
      }).catch((_err) => {
        setLoading(true);
      })
    }
  }

  useEffect(() => {
    if (!sections.length) {
      getFields();
    }

    setModule(children.find((item) => item.moduleName === module_name));
    if (module?.btns) {
      setActions(module?.btns);
    }
  }, []);

  useEffect(() => {
    if (module?.btns) {
      setActions(module?.btns);
    }
  }, [module]);

  // 信息列表
  const Info = () => {
    return (
      <View>
        {
          sections.map((section, index) => {
            return (
              <View key={index}>
                {section.isSubformSection ? <SubformSection section={section} data={data} module_name={module_name} showAll={showAll} /> : <SectionItem section={section} data={data} showAll={showAll} module_name={module_name} />}
              </View>
            )
          })
        }
        <View className='showall'>
          <Text onClick={() => {setShowAll(!showAll);}}>{!showAll ? '显示全部字段' : '切换智能是视图'}</Text>
        </View>
      </View>
    )
  }

  const [moveVisible, setMoveVisible] = useState(false);

  const [activeKey, setActiveKey] = useState('association');

  return (
    <ShowContainerContext.Provider value={{setRefreshKey}}>
      <View className='show'>
        <NavBar
          right={<RedoOutline fontSize={18} onClick={() => getData()}/>}
          style={{background: '#FFF'}} 
          onBack={() => {
            Taro.navigateBack();
          }}
        >{module && module?.name || ''}</NavBar>
        {loading ? (
          <>
            {data ? (
              <>
                <ScrollView className='show-content' onClick={() => setMoveVisible(false)}>
                  <View className="content">
                    <Header data={data} module_name={module_name} />
                    {module_name === 'Deals' ? (
                      <Blueprint data={data} active={getModuleText(data, module_name).description || ''} refresh={() => getData()}/>
                    ) : (
                      module_name === 'Leads' ? (
                        <View className='content-owner-name'>
                          <Text className='current-lead-status'>当前状态：{data.Lead_Status}</Text>
                          <LeadsBlueprint data={data} refresh={() => getData()} />
                        </View>
                      ) : (
                        module_name === 'Accounts' ? (
                        <AccountsBluePrint data={data} refresh={() => getData()} />
                        ) : (
                          <View className='content-owner-name'>
                            <Text className='content-owner-name-name'>{data.Owner.name}</Text>
                            <Text>{'所有者'}</Text>
                          </View>
                        )
                      )
                    )}
                  </View>
                  <View  style={{position: 'sticky', top: '-0.5px', zIndex: 100, background: '#FFF'}}>
                    <Tabs activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
                      <Tabs.Tab title='关联的' key='association' />
                      <Tabs.Tab title='信息' key='info' />
                    </Tabs>
                  </View>
                  <Tabs className='tabs-hiddern' activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
                    <Tabs.Tab title='关联的' key='association'>
                      <View className='content-detail'>
                        <Association refreshKey={refreshKey} module_name={module_name} zoho_id={zoho_id}/>
                      </View>
                    </Tabs.Tab>
                    <Tabs.Tab title='信息' key='info'>
                      <View className='content-detail'>
                        <Info />
                      </View>
                    </Tabs.Tab>
                  </Tabs>
                </ScrollView>
                <View className='show-tabbar row'>
                  {navbars.map((item) => (
                    <View key={item.key} className='col center show-tabbar-btn'>
                      {item.key === 'phone' ? <CallPhone onChange={(e) => {
                        if (e === 'refresh') {
                          setRefreshKey({
                            time: new Date(),
                            api_name: 'Calls',
                          });
                        }
                      }} phone={data?.phone || data?.Phone || ''} data={data} module_name={module_name} name={getModuleText(data, module_name).name} /> : item.icon}
                      <Text>{item.title}</Text>
                    </View>
                  ))}
                  {actions.length ? (
                    <Popover
                      visible={moveVisible}
                      placement='top'
                      trigger='click'
                      content={
                      <View style={{display: 'flex', flexDirection: 'column'}}>
                        {actions.map((item, index) => {
                          return (
                            <MoveActions key={index} item={item} module_name={module_name} id={zoho_id} onChange={(e) => {
                              if (e === '线索不存在') {
                                getData();
                              }
                              setMoveVisible(false);
                            }}/>
                          )
                        })}
                      </View>
                      }
                    >
                      <View className='col center show-tabbar-btn' onClick={() => setMoveVisible(!moveVisible)}>
                        <MoreOutline fontSize={24} className='show-tabbar-btn-icon' />
                        <Text>{'更多'}</Text>
                      </View>
                    </Popover>
                  ) : null}
                </View>
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
        ) : (
          <View style={{padding: '20px'}}>
            <Skeleton.Title animated />
            <Skeleton animated className='customSkeleton' />
            <Skeleton.Paragraph lineCount={5} animated />
          </View>
        )}
      </View>
    </ShowContainerContext.Provider>
  )
}

export default Content

const SubformSection = ({section, data, module_name, showAll}) => {
  let fields: any = [];
  const [active, setActive] = useState(true);

  // 筛选不为空的数据
  section.fields.forEach((field) => {
    if (data[field.api_name]) {
      fields.push(field)
    }
  });

  fields = !showAll ? fields : section.fields

  if (fields.length) {
    return (
      <View className='content-detail-content'>
        <View className='content-detail-content-top' onClick={() => setActive(!active)}>
          <Text className='content-detail-content-name'>{section.api_name}</Text>
          {active ? <UpOutline /> :
          <DownOutline />}
        </View>
        <View style={active ? {display: 'flex'} : {display: 'none'}}>
          {fields.map((field) => {
            return (
              <View key={field.id} className='detail-item-row'>
                {field.json_type == 'jsonarray' ? (
                  <View>
                    {module_name === 'Deals' ? potentialsTable(data[field.api_name]) : null}
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>
      </View>
    );
  }

  return null;
}

const Header = ({data, module_name}) => {
  
  const [dealsSatuts, setDealsSatuts] = useState<any>();

  const [avatalColor, setAvatalColor] = useState(1);

  const [content, setContent] = useState<any>();

  useEffect(() => {
    const _data = getModuleText(data, module_name);
    setAvatalColor((Math.floor(Math.random() * 10) + 1));

    if (module_name === 'Deals') {
      setDealsSatuts(dealsBlueprint.find((deal) => deal.label === _data.description));
    }
    setContent(_data);
  }, [data]);

  return content ? (
    <View className='head row'>
      <View className={'left ' + `left${avatalColor }`}>
        <Text>{content.name[0] || '-'}</Text>
      </View>
      <View className='right col'>
        <Text className='name'>{content.name || '-'}</Text>
        {dealsSatuts ? (
          <Text className='deals-name' style={{background: dealsSatuts.color}}>{content.description}</Text>
        ) :<Text>{content.description}</Text>}
        {content.phone === 'null' ? null : (
          <Text style={{color: '#00a3f3'}}>{content.phone}</Text>
        )}
        {content.amount ? <Text>{thousandAbdDecimal(content.amount)}</Text> : null}
      </View>
    </View>
  ) : <></>
}

const SectionItem = ({section, data, showAll, module_name}) => {

  const {setRefreshKey} = useContext<any>(ShowContainerContext);

  let fields: any = [];
  const [textarea, setTextarea] = useState('');
  const [active, setActive] = useState(true);

  // 筛选不为空的数据
  section.fields.forEach((field) => {
    if (field.json_type === 'jsonarray') {
      if (data[field.api_name] && data[field.api_name].length) {
        fields.push(field)
      }
    } else {
      if (data[field.api_name] || field.api_name === 'BPM_Surplus_Days') {
        fields.push(field)
      }
    }
  });

  fields = !showAll ? fields : section.fields

  const renderField = (field) => {
    let name = '';
    switch (field.json_type) {
      case 'jsonobject':
        name = data[field.api_name]?.name || '';
        break;
      case 'jsonarray':
        // name = data[field.api_name] && data[field.api_name].length ? data[field.api_name].join(',') : '';
        name = (data[field.api_name] || []).map((item, index) => {
          return (
            <Text className='detail-text-multiple' key={index}>{item}</Text>
          )
        })
        break;
      default:
        name = data[field.api_name] || '';
        
        break;
    }
    if (name) {
      if (module_name === 'Deals') {
        return (
          <Text className={dealsBlueprint.find((deal) => deal.label === name) ? 'deals-name' : ''}
            style={dealsBlueprint.find((deal) => deal.label === name) ? {background: dealsBlueprint.find((deal) => deal.label === name)?.color} : {}}
          >{name}</Text>
        );
      }
      switch (field.data_type) {
        case 'datetime':
          return <Text>{dayjs(name).format('YYYY-MM-MM HH:mm:ss')}</Text>;
        case 'phone':
        return (
          <View className='detail-row webkit-hidden1'>
            <Text className='detail-item-row-phone webkit-hidden1'>{name}</Text>
            <CallPhone onChange={(e) => {
              if (e === 'refresh') {
                setRefreshKey({
                  time: new Date(),
                  api_name: 'Calls'
                })
              }
            }} color='#00a3f3' phone={name || ''} data={data} module_name={module_name} name={getModuleText(data, module_name).name} />
          </View>
        )
        case 'textarea':
          return (
            <View className='detail-row' onClick={() => setTextarea(name)}>
              <Text className='textarea'>{name}</Text>
              <RightOutline />
            </View>
          );
        default: 
          return <Text className='detail-text'>{name}</Text>;
      }
    } else {
      return null;
    }
  }

  if (fields.length) {
    return (
      <>
      <View className='content-detail-content'>
        <View className='content-detail-content-top' onClick={() => setActive(!active)}>
          <Text className='content-detail-content-name'>{section.api_name}</Text>
          {active ? <UpOutline /> :
          <DownOutline />}
        </View>
        <View style={active ? {display: 'block'} : {display: 'none'}}>
          {fields.map((field) => {
            const renderText = renderField(field);
            return (
              <View key={field.id} className='detail-item-row' onClick={() => console.log(field)}>
                <Text className='detail-item-row-label'>{field.field_label}:</Text>
                {field.api_name === 'BPM_Surplus_Days' ? (
                  <ReleaseTime date={data['Release_Time']}/>
                ) : renderText}
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
    );
  }

  return null;
}

// 商机等级历史表格
const potentialsTable = (datas) => {
  // 固定数据
  const fields = [
    {
      field_label: '等级名称',
      api_name: 'Rating_Name',
      type: 'string',
    },
    {
      field_label: '修改日期',
      api_name: 'Rating_Time',
      type: 'time',
    },
    {
      field_label: '修改人',
      api_name: 'Rating_Modifier',
      type: 'string',
    },
  ]
  return (
    <View className='potentials-table'>
      {fields.map((field, index) => {
        return (
          <View key={index} className="potentials-table-content">
            <View className='potentials-table-content-box'>
              <Text className='potentials-table-label'>{field.field_label}</Text>
              {datas.map((item) => {
                const name = field.api_name.toLowerCase().indexOf('time') !== -1 ? dayjs(item[field.api_name]).format('YYYY年MM月DD日 HH:mm:ss') : item[field.api_name];
                return (
                  <View key={item.id} className='potentials-table-name'>
                    <Text>{name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        )
      })}
    </View>
  )
}

// 剩余时间渲染
function ReleaseTime({date}) {
  let time;
  let day;
  const endTime = new Date(date).getTime() / 1000;
  const startTime = parseInt(new Date().getTime() / 1000 + '');
  if (date) {
    day = (endTime - startTime) / 3600;
    time = (day / 24).toFixed(2);
    day = parseInt(day / 24 + '');
  }

  if (endTime > startTime) {
    return <Text className='release-time'>{time > 1 ? `剩余 ${day} 天` : `剩余 ${time} 天`}</Text>
  } else {
    return null
  }

}

interface MoveActionsProps {
  onChange: (e: string) => void;
  id: string;
  module_name: string;
  item: Action;
}

const MoveActions = (props: MoveActionsProps) => {
  const {onChange, id, module_name, item} = props;
  const [loading, setLoading] = useState(false);

  // 列表删除
  const onDeleteId = (id) => {
    deleteId(id, module_name).then((res) => {
      console.log('onDeleteId', res);
      if (res.data && res.data[0].code === 'SUCCESS') {
        notification.success({
          message: '已删除',
          duration: 2
        })
        Taro.eventCenter.trigger('deleteId', id);
        Taro.navigateBack();
      } else {
        notification.error({
          message: '删除失败',
          duration: 2
        })
      }
    }).catch((err) => {
      notification.error({
        message: '删除失败',
        duration: 2
      })
    })
  }

  return (
    <>
      <Text style={{padding: '6px 0'}} onClick={() => {
        const currentUser = Taro.getStorageSync('currentUser');
        if (loading) return;
        setLoading(true);
        Taro.showLoading();
        if (item.key !== 'delete') {
          executeFunction(item.key, {
            auth_type: 'oauth',
            id,
            claim_User: currentUser && currentUser.id || '',
          }).then((res: any) => {
            if (res && res.code === 'success') {
              notification.success({
                message: res.details.output,
                duration: 2
              })
              if (res.details.output.indexOf('已达上限') !== -1) {
              } else {
                // 进入相反的页面查看列表
                if (item.text === '丢入公海') {
                  Taro.redirectTo({
                    url: 'pages/main/workbench/zoho/list/index?module_name=Public_Leads'
                  });
                } else {
                  Taro.redirectTo({
                    url: 'pages/main/workbench/zoho/list/index?module_name=Leads'
                  });
                }
              }
            } else {
              notification.error({
                message: '没有权限, 请联系管理员',
                duration: 2
              })
            }
            setLoading(false);
            Taro.hideLoading();
          }).catch((_err) => {
            if (module_name === 'Public_Leads') {
              notification.error({
                message: '该线索不存在，已被他人申领或删除',
                duration: 2
              });
              onChange('线索不存在');
            }
            setLoading(false);
            Taro.hideLoading();
          });
        } else {
          onDeleteId(id);
        }
      }}>{item.text}{loading && <DotLoading />}</Text>
      <Mask visible={loading}/>
    </>
  )
}
