import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'
import { getCurrentInstance} from '@tarojs/taro';
import { Button, Popup, Popover, SwipeAction, PullToRefresh, DotLoading, Tag, Dropdown, Ellipsis, AutoCenter, Empty } from 'antd-mobile';
import { CloseOutline, DownFill, FilterOutline, CheckOutline, LeftOutline, RightOutline } from 'antd-mobile-icons'
import _ from 'lodash';
import Taro from '@tarojs/taro';
import { getModuleText, getSelectQuery, thousandAbdDecimal } from 'src/utils/utils';
import CallPhone from 'src/components/CallPhone';
import NetCloudFun from 'src/pages/services/functions';
import { message, notification } from 'antd';
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';
import Search from './Search';
import ScreenItem from './ScreenItem';
import Loading from 'src/components/Loading';
import dayjs from 'dayjs';
import { deleteId, executeFunction } from 'src/pages/services/zoho/http';

const {ltcMenu, dealsBlueprint} = iBodor;
const {children} = ltcMenu;

const Index = () => {
  // 地址栏ID
  const module_name = getCurrentInstance().router?.params.module_name || '';
  const [module, setModule] = useState<Module>();

  // 搜索的key
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectQuery, setSelectQuery] = useState('');

  const [fields, setFields] = useState<Array<any>>([]);
  const [listDatas, setListDatas] = useState<Array<any>>();

  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(50);
  const [info, setInfo] = useState<any>();

  const [scrollTopValue, setScrollTopValue] = useState(0);

  const [showSortFields, setShowSortFields] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setsortOrder] = useState<any>({
    key: 'default',
    text: '默认'
  });

  const [showScreen, setShowScreen] = useState(false);

  const [screenLayout, setScreenLayout] = useState<Array<any>>();
  const [sortFields, setSortFields] = useState<Array<any>>();

  const [count, setCount] = useState(0);

  const [saveSorts, setSaveSorts] = useState<Array<any>>();
    
  useEffect(() => {
    setSaveSorts(Taro.getStorageSync('saveSorts') || []);
    if (module_name === 'TelephoneDevelopment') {
      setPerPage(20);
    }
  }, []);

  useEffect(() => {
    // TODO 获取数据自动跳转列表
    setModule(children.find((item) => item.moduleName === module_name));
    if (!fields.length && saveSorts) {
      getFields();
    }
    // getCount();
  }, [saveSorts]);

  useEffect(() => {
    if (!screenLayout) {
      setScreenLayout(module?.screenLayout);
    }
    if (!sortFields) {
      setSortFields(module?.sortFields);
    }
  }, [module]);

  useEffect(() => {
    // 监听删除
    Taro.eventCenter.on('deleteId',(id)=>{
      if (id && listDatas) {
        setListDatas(listDatas.filter((list) => list.id !== id));
      }
    });

    // 监听添加
    Taro.eventCenter.on('addItem',(data)=>{
      if (data && listDatas) {
        setListDatas([data, ...listDatas]);
      }
    });

    return () => {
      Taro.eventCenter.off('deleteId');
      Taro.eventCenter.off('addItem');
    }
  }, [listDatas]);

  // 总长度
  const getCount = () => {
    NetCloudFun.get(`/crm/v3/${module_name}/actions/count`).then((res: any) => {
      if (res.count) {
        setCount(res.count);
      }
    })
  }

  const getFields = () => {
    setLoading(true);
    NetCloudFun.get(`/crm/v2/settings/layouts`, {
      module: module_name
    }).then((res: any) => {
      const _fields: Array<any> = [];
      res.layouts[0].sections.forEach((item) => {
        item.fields = item.fields.filter((field) => field.view_type.create);
        _fields.push(...item.fields);
      });
      setFields(_fields);

      if (module_name !== 'TelephoneDevelopment') {
        if (saveSorts?.length) {
          const currSort = saveSorts.find((sort) => sort.name === module_name);
          console.log('currSort', currSort);
          if (currSort && currSort.sort_order) {
            setsortOrder({
              key: currSort.sort_order,
              text: currSort.sort_order === 'desc' ? '倒序' : '升序',
            });
            setSortBy(currSort.sort_by);
            refresh({page, sort_order: currSort.sort_order, sort_by: currSort.sort_by});
          } else {
            onDefaultRefresh();
          }
        } else {
          onDefaultRefresh();
        }
      } else {
        setSortBy('Created_Time');
        setsortOrder({
          key: 'desc',
          text: '倒序'
        });
        setSelectQuery(`select company_name,Name,phone,Owner from ${module_name} where (status != '已拨打')`);
        refresh({page, sort_order: 'desc', sort_by: 'Created_Time', select_query: `select company_name,Name,phone,Owner from ${module_name} where (status != '已拨打')`});
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  // 列表删除
  const onDeleteId = (id) => {
    deleteId(id, module_name).then((res) => {
      console.log('onDeleteId', res);
      if (listDatas && res.data && res.data[0].code === 'SUCCESS') {
        notification.success({
          message: '已删除',
          duration: 2
        })
        setListDatas(listDatas.filter((list) => list.id !== id));
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

  const onDefaultRefresh = () => {
    // 第一次保存
    setsortOrder({
      key: 'default',
      text: '默认'
    });
    refresh({page, sort_order: 'default'});
  }

  // 刷新方法
  const refresh = ({page, sort_order, select_query, wordKey, sort_by}: {page: number, sort_order?: string, select_query?: string, wordKey?: string, sort_by?: string}) => {
    setLoading(true);

    const params: any = {
      page,
      per_page,
    }

    let _params = '';

    if (sort_order && sort_order !== 'default') {
      params.sort_order = sort_order || sortOrder.key;
      params.sort_by= sort_by || sortBy;
      _params += ' ORDER BY ' + (sort_by || sortBy) + ' ' + (sort_order || sortOrder.key)
    } else {
      delete params.sort_order
      delete params.sort_by
    }
    
    if (saveSorts?.length) {
      const currSort = saveSorts.find((sort) => sort.name === module_name);
      if (currSort) {
        const saveSortDatas = saveSorts?.map((sort) => sort.name === module_name ? {...sort, sort_order: params.sort_order,
          sort_by: params.sort_by,} : {...sort});
    
        Taro.setStorage({
          key: 'saveSorts',
          data: saveSortDatas
        });
        setSaveSorts(saveSortDatas);
      } else {
        const _saveSort = {
          name: module_name,
        }
        Taro.setStorage({
          key: 'saveSorts',
          data: saveSorts.concat(_saveSort),
        });
        setSaveSorts(saveSorts.concat(_saveSort));
      }
    } else {
      const _saveSort = {
        name: module_name,
      }
      Taro.setStorage({
        key: 'saveSorts',
        data: [_saveSort],
      });
      setSaveSorts([_saveSort]);
    }

    _params += ` LIMIT ${((page - 1) * per_page)} , ${per_page}`;

    const setDatas = (data) => {
      if (module_name === 'TelephoneDevelopment') {
        setListDatas(data);
        setScrollTopValue(0);
      } else {
        if (page === 1) {
          setListDatas(_.uniqBy(data, 'id'));
        } else {
          setListDatas(_.uniqBy((listDatas || []).concat(data), 'id'));
        }
      }
    }

    if (module_name) {
      if (select_query) {
        NetCloudFun.post(`/crm/v2/coql`, {
          select_query: select_query + _params,
        }).then((res: any) => {
          console.log('select_query', res);
          setLoading(false);
          if (res.data) {
            setPage(page);
            setDatas(res.data);
            setInfo(res.info);
          } else {
            setListDatas([]);
          }
          setShowScreen(false)
        }).catch((_err) => {
          setListDatas([]);
          Taro.hideLoading();
          setShowScreen(false);
          setLoading(false);
        })
      } else if (wordKey) {
        NetCloudFun.get(`/crm/v2/${module_name}/search`, {
          ...params,
          word: wordKey,
        }).then((res: any) => {
          setLoading(false);
          console.log('functions', res);
          if (res.data) {
            setPage(page);
            setDatas(res.data);
            setInfo(res.info);
          } else {
            setListDatas([]);
          }
        }).catch((_err) => {
          setListDatas([]);
          setLoading(false);
          Taro.hideLoading();
        })
      } else {
        NetCloudFun.get(`/crm/v2/${module_name}`, params).then((res: any) => {
          setShowScreen(false);
          console.log('functions', res);
          setLoading(false);
          if (res.data) {
            setPage(page);
            setDatas(res.data);
            setInfo(res.info);
          } else {
            setListDatas([]);
          }
        }).catch((err) => {
          console.log(err);
          setLoading(false);
          Taro.hideLoading();
        })
      }
    }
  };

  const HeadMenu = () => {
    const sortActions = [
      {key: 'default', text: <Text style={sortOrder && sortOrder.key === 'default' ? {color: '#4a93ed'} : {}}>默认</Text>},
      {key: 'asc', text: <Text style={sortOrder && sortOrder.key === 'asc' ? {color: '#4a93ed'} : {}}>升序</Text>},
      {key: 'desc', text: <Text style={sortOrder && sortOrder.key === 'desc' ? {color: '#4a93ed'} : {}}>降序</Text>}
    ];
  
    return (
      <View className='set-filter-border'>
        <View className={sortBy && !showSortFields ? 'set-filter-border-btn active' : 'set-filter-border-btn'} onClick={() => {
          setShowSortFields(!showSortFields);
        }}>
          <Text className='webkit-hidden1'>{!showSortFields && sortBy && sortFields && sortFields.find((field) => field.api_name === sortBy) ? sortFields.find((field) => field.api_name === sortBy).field_label : '排序字段'}</Text>
          <DownFill fontSize={10} className={showSortFields ? 'active-icon' : ''} />
        </View>
        <Popover.Menu
          mode='light'
          actions={sortActions}
          placement='bottom'
          onAction={node => {
            if (node.key !== 'default') {
              setScrollTopValue(0);
              if (sortBy) {
                setListDatas(undefined);
                setsortOrder(node);
                refresh({page: 1, sort_order: node.key + '', select_query: selectQuery, wordKey: searchKey});
              } else {
                message.warn('请选择排序字段')
              }
            } else {
              setListDatas(undefined);
              setsortOrder(node);
              setSortBy('');
              refresh({page: 1, sort_order: node.key, select_query: selectQuery, wordKey: searchKey});
            }
          }}
          trigger='click'
        >
          <View style={{color: '#4a93ed'}} className={sortOrder === 'asc' ? 'set-filter-border-btn sort-by-active' : 'set-filter-border-btn'}>
            <Text>{sortOrder && sortOrder.text}</Text>
            <DownFill fontSize={10} className={''} />
          </View>
        </Popover.Menu>
        <View className={selectQuery ? 'set-filter-border-btn active' : 'set-filter-border-btn'} onClick={() => {
          setShowScreen(true);
        }}>
          <Text>{'筛选'}</Text>
          <FilterOutline className={selectQuery ? 'active' : ''}/>
        </View>
      </View>
    )
  }

  const streetActions = [
    { key: '=', text: '是' },
    { key: '!=', text: '不是' },
  ];

  const picklistActions = [
    { key: '=', text: '是' },
    { key: '!=', text: '不是' },
    { key: 'is null', text: '为空'},
    { key: 'is not null', text: '不为空'},
  ];

  const textActions = [
    { key: '=', text: '是' },
    { key: '!=', text: '不是' },
    { key: 'like', text: '包含' },
    { key: 'not like', text: '不包含' },
    { key: 'starts_with', text: '从什么开始' },
    { key: 'ends_with', text: '从什么结束'},
    { key: 'is null', text: '为空'},
    { key: 'is not null', text: '不为空'},
  ];

  return (
    <View className='list-content-content'>
      <Search
        module_name={module_name}
        title={module && module.name || ''}
        onChange={(e) => setSearchKey(e)}
        onSearch={() => {
          setListDatas(undefined);
          setScrollTopValue(0);
          setSelectQuery('');
          refresh({page: 1, wordKey: searchKey});
          setScreenLayout(screenLayout?.map((item) => ({...item, active: false, type: '', value: '', visible: false})));
        }}
        onAddModule={() => {
          Taro.navigateTo({url: `pages/main/workbench/zoho/form/index?module_name=${module_name}`})
        }}
        onCancel={() => {
          setListDatas(undefined);
          setScrollTopValue(0);
          refresh({page: 1, sort_order: 'default'})
        }}
      />
      <HeadMenu />
      <View className='content-list'>
        {!loading || listDatas ? (
          listDatas && listDatas.length ? (
            <ScrollView
              style={{height: '100%'}}
              scrollTop={scrollTopValue}
              scrollY={true}
              enhanced={true}
              lowerThreshold={200}
              onScroll={(e) => {
                setScrollTopValue(e.detail.scrollTop);
              }}
              onScrollToLower={_.throttle(() => {
                if (info?.more_records && !loading && module_name !== 'TelephoneDevelopment') {
                  refresh({page: page + 1, sort_order: sortOrder?.key || '', wordKey: searchKey, select_query: selectQuery});
                }
              }, 1000, {leading: true, trailing: false})}>
              <PullToRefresh
                disabled={module_name === 'TelephoneDevelopment'}
                onRefresh={async () => {
                  refresh({page: 1, sort_order: sortOrder?.key || '', wordKey: searchKey, select_query: selectQuery});
                }}
              >
                {listDatas && listDatas.map((item, index) => 
                  <ListItem
                    item={item}
                    key={index}
                    module={module}
                    module_name={module_name}
                    onChange={(id: string, type?: string) => {
                      if (type === 'delete') {
                        onDeleteId(id);
                      } else if (type === 'status') {
                        setListDatas(listDatas.map((list) => list.id === id ? {...list, status: '已拨打'} : {...list}));
                      } else {
                        setListDatas(listDatas.filter((list) => list.id !== id));
                      }

                      if (type === 'error') {
                        refresh({page: 1, sort_order: sortOrder?.key || '', wordKey: searchKey, select_query: selectQuery});
                      }
                    }}
                    onClick={() => {
                      setListDatas(listDatas.map((list) => list.id === item.id ? {...list, active: true} : {...list}))
                    }}
                  />
                )}
              </PullToRefresh>
            </ScrollView>
          ) : (
            <AutoCenter>
              <Empty
                style={{ padding: '64px 0' }}
                imageStyle={{ width: 128 }}
                description={searchKey ? `未找到"${searchKey}"` : '暂无数据'}
              />
              <Button
                block
                size='middle'
                color='primary'
                onClick={() => {
                  Taro.navigateTo({url: `pages/main/workbench/zoho/form/index?module_name=${module_name}`})
                }}>
                创建
              </Button>
            </AutoCenter>
          )
        ) : <Loading />}
        {showSortFields && fields.length ? (
          <View className='show-sort-fields'>
            <View className='show-sort-fields-content'>
              <View className='show-sort-fields-content-box'>
                {sortFields && sortFields.map((item, index) => {
                  return (
                    <View key={index} className="show-sort-fields-item" onClick={() => {
                      setSortBy(item.api_name);
                    }}>
                      <Text className={item.api_name === sortBy ? 'show-sort-fields-item-text active' : 'show-sort-fields-item-text'}>{item.field_label}</Text>
                      {item.api_name === sortBy ? (
                        <CheckOutline color='#4a93ed'/>
                      ) : null}
                    </View>
                  )
                })}
              </View>
              <View className='show-sort-fields-btns'>
                <Text className='show-sort-fields-reset' onClick={() => {
                  setListDatas(undefined);
                  setSortBy('');
                  setsortOrder({
                    key: 'default',
                    text: '默认',
                  });
                  Taro.setStorage({
                    key: 'saveSorts',
                    data: (saveSorts || []).filter((sort) => sort.name !== module_name),
                  });
                  setSaveSorts((saveSorts || []).filter((sort) => sort.name !== module_name));
                  refresh({page: 1});
                  setShowSortFields(false);
                }}>重置</Text>
                <Text className='show-sort-fields-ok' onClick={() => {
                  if (sortOrder.key !== 'default') {
                    setListDatas(undefined);
                    refresh({page: 1, sort_order: sortOrder.key, select_query: selectQuery, wordKey: searchKey});
                  }
                  setShowSortFields(false);
                }}>确定</Text>
              </View>
            </View>
            <View style={{flex: 1}} onClick={() => setShowSortFields(false)}/>
          </View>
        ) : null}
      </View>
      {module_name === 'TelephoneDevelopment' && info && (
        <View className='page-indicator-content'>
          <Button disabled={page === 1} className='page-indicator-content-btn' onClick={() => {
            if (page > 1 && !loading) {
              refresh({page: page - 1, sort_order: sortOrder?.key || '', wordKey: searchKey, select_query: selectQuery});
            }
          }}><LeftOutline /></Button>
          <Text className='page-indicator-content-page'>{page}</Text>
          <Button disabled={!info.more_records} className='page-indicator-content-btn' onClick={() => {
            if (info.more_records && !loading) {
              refresh({page: page + 1, sort_order: sortOrder?.key || '', wordKey: searchKey, select_query: selectQuery});
            }
          }}><RightOutline /></Button>
        </View>
      )}
      <Popup visible={showScreen} onMaskClick={() => setShowScreen(false)} bodyStyle={{height: '90vh'}}>
        <View className='screen-content'>
          <Text className='screen-content-title'>筛选</Text>
          <CloseOutline fontSize={16} className='popup-close' onClick={() => setShowScreen(false)}/>
          <View className='screen-scroll'>
            <ScrollView scrollY={true} style={{height: '100%'}}>
              {screenLayout && screenLayout.map((item, index) => {
                const field = fields.find((field) => field.api_name === item.api_name);
                return field && (
                  <ScreenItem key={index} data={item} field={field} content={field.api_name !== 'Street' ? field.data_type === 'text' ? textActions : picklistActions : streetActions} onChanges={(e) => {
                    setScreenLayout(screenLayout.map((layout) => layout.api_name === item.api_name ? {...layout, ...e} : {...layout}));
                  }}/>
                )
              })}
            </ScrollView>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', margin: '10px 0 20px 0', padding: '0 20px'}}>
            <Button color="warning" style={{marginRight: 10}} block onClick={() => {
              setListDatas(undefined);
              setScreenLayout(screenLayout?.map((item) => ({...item, active: false, type: '', value: ''})));
              setSelectQuery('');
              refresh({page: 1, sort_order: sortOrder.key});
            }}>重置</Button>
            <Button color="primary"style={{marginLeft: 10}} block onClick={() => {
              const select_query = getSelectQuery(module_name, screenLayout, children);
              setSearchKey('');
              setListDatas(undefined);
              setSelectQuery(select_query);
              refresh({page: 1, select_query, sort_order: sortOrder.key})
            }}>确定</Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default Index;

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

const ListItem = ({item, module_name, module, onChange, onClick}) => {
  const data = getModuleText(item, module_name);
  const currentUser = Taro.getStorageSync('currentUser');
  const [loading, setLoading] = useState(false);
  return (
    <SwipeAction key={item.id} rightActions={module?.btns && [
      {
        key: module?.btns[0].key,
        text: loading ? <DotLoading color='white' /> : module?.btns[0].text,
        color: module?.btns[0].key === 'delete' ? 'danger': 'warning',
        onClick: () => {
          if (loading) return;
          if (module?.btns[0].key !== 'delete') {
            setLoading(true);
            Taro.showLoading();
            executeFunction(module?.btns[0].key, {
              auth_type: 'oauth',
              id: item.id,
              claim_User: currentUser && currentUser.id || '',
            }).then((res: any) => {
              if (res && res.code === 'success') {
                Taro.hideLoading();
                notification.success({
                  message: res.details.output,
                  duration: 2,
                })
                onChange(item.id);
              } else {
                notification.error({
                  message: '没有权限, 请联系管理员',
                  duration: 2
                })
              }
              setLoading(false);
              Taro.hideLoading();
            }).catch((err) => {
              if (module_name === 'Public_Leads') {
                notification.error({
                  message: '该线索不存在，已被他人申领或删除',
                  duration: 2,
                });
                onChange(item.id, 'error');
              }
              setLoading(false);
              Taro.hideLoading();
            })
          } else {
            onChange(item.id, module?.btns[0].key);
          }
        }
      },
    ]}>
      <View className="content-list-item-row">
        <View className='content-list-item' onClick={() => {
          Taro.navigateTo({
            url: `pages/main/workbench/zoho/show/index?module_name=${module_name}&zoho_id=${item.id}`,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function(data) {
                console.log('data', data)
              },
              someEvent: function(data) {
                console.log('data', data)
              }
            }
          });
          onClick(item);
        }}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text className="content-list-item-name"  style={{color: item?.active ? '#666' : '#333'}}>
              {data.name || '-'}
            </Text>
            {module_name === 'TelephoneDevelopment' && <Tag fill='outline' color={(item.status === '未拨打' || !item.status) ? 'warning' : 'primary'}>{item.status || '未拨打'}</Tag>}
          </View>
          <Text className="content-list-item-name2">
            {module_name === 'Deals' ? (
              <Text className='content-list-item-name-deals' style={dealsBlueprint.find((deal) => deal.label === data.description) ? {background: dealsBlueprint.find((deal) => deal.label === data.description)?.color} : {}}>
                {data.description}
              </Text>
            ) : data.description}
          </Text>
          <Text className="content-list-item-name2">
            {data.rating}
          </Text>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {data.phone &&
              <Text style={{color: '#65a1ea', whiteSpace: 'pre-wrap'}}>
                {data.phone && data.phone.split(',').map((item) => {
                  return <Tag style={{marginRight: '10px'}}>{item}</Tag>
                })}
              </Text>
            }
            {/* 线索固有 */}
            <ReleaseTime date={item['Release_Time']}/>
            {module_name === 'TelephoneDevelopment' && item.Last_dialed_time && <Text>{dayjs(item.Last_dialed_time).format('YYYY-MM-DD HH:mm:ss')}</Text>}
            {data.amount ? <Text className='content-list-item-amount' onClick={() => console.log(data, item)}>{thousandAbdDecimal(data.amount)}</Text> : null} 
          </View>
        </View>
        <View className='content-list-right'>
          {data.phone ? <CallPhone phone={data.phone} data={item} module_name={module_name} name={data.name} onChange={(id) => onChange(id, 'status')}/> : null}
        </View>
      </View>
    </SwipeAction>
  )
}
