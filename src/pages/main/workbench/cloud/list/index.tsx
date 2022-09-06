import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'
import { getCurrentInstance } from '@tarojs/taro';
import { Popover, ErrorBlock, SwipeAction, PullToRefresh, Button, AutoCenter, Empty, Tag } from 'antd-mobile';
import { DownFill, FilterOutline, CheckOutline } from 'antd-mobile-icons'
import _ from 'lodash';
import Taro from '@tarojs/taro';
import { message } from 'antd';
import Search from './Search';
import Loading from 'src/components/Loading';
import HttpLoading from 'src/utils/http/cloud/HttpLoading';
import { getFields } from 'src/pages/services/form';
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';

const {ctoMenu} = iBodor;
const {children} = ctoMenu;

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

  const searchField = fields.filter(
    (field) => field.name === 'name' || field.name === 'number',
  )[0];

  const searchColumn = searchField ? `${searchField.name}_cont` : 'name_cont';
  const [condition, setCondition] = useState<any>({
    q: {},
  });

  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>();

  const [scrollTopValue, setScrollTopValue] = useState(0);

  const [showSortFields, setShowSortFields] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setsortOrder] = useState<any>();

  const [showScreen, setShowScreen] = useState(false);

  const [sortFields, setSortFields] = useState<Array<any>>();

  const [form, setForm] = useState();

  const [isNewAdd, setIsNerAdd] = useState(false);

  useEffect(() => {
    // TODO 获取数据自动跳转列表
    setModule(children.find((item) => item.moduleName === module_name));
    if (!fields.length) {
      setLoading(true);
      getFields({form_name: module_name, translate: true}).then((res) => {
        if (res.code === 200 && res.data) {
          const _fileds = res.data.fields.filter(
            (item: any) => item.accessibility !== 'hidden' && item.mobile_view.indexOf('index') !== -1,
          );
          // console.log('_fileds', _fileds);
          setFields(_fileds);
          setForm(res.data.form);
          refresh({page: 1});
        }
      });
    }
    setsortOrder({
      key: 'default',
      text: '默认'
    });
    getUserRights();
  }, []);

  // 权限
  const getUserRights = () => {
    const cloudCurrentUser = Taro.getStorageSync('cloudCurrentUser');
    let isAdmin = false;
    if (cloudCurrentUser && cloudCurrentUser.is_admin || cloudCurrentUser.profile_id && cloudCurrentUser.profile_id.name === '管理员') {
      isAdmin = true;
    }
    setIsNerAdd(isAdmin);
  }

  useEffect(() => {
    if (!sortFields) {
      setSortFields(module?.sortFields);
    }
  }, [module]);

  // 刷新方法
  const refresh = ({page, condition}: {page: number, condition?: any}) => {
    setLoading(true);
    HttpLoading.get(`/api/v1/${module_name}`, {
      params: {
        ...condition,
        page,
        per_page: 10,
      }
    }).then((res) => {
      setCondition(condition);
      if (res.code === 200 && res.data) {
        if (page === 1) {
          setListDatas(res.data.datas);
        } else {
          setListDatas(listDatas && listDatas.concat(res.data.datas));
        }
        setPage(page);
        setInfo(res.data.info);
      } else {
        message.error(res.tips);
      }
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      message.error(err.tips);
    })
 
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
          <Text className='webkit-hidden1'>{!showSortFields && sortBy && fields.find((field) => field.api_name === sortBy) ? fields.find((field) => field.api_name === sortBy).field_label : '排序字段'}</Text>
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
                // refresh(1);
              } else {
                message.warn('请选择排序字段')
              }
            } else {
              setListDatas(undefined);
              setsortOrder(node);
              setSortBy('');
              // refresh(1);
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

  return (
    <View className='list-content-content'>
      <Search
        isNewAdd={isNewAdd}
        module={module}
        title={module && module.name || ''}
        onChange={(e) => {
          setSearchKey(e);
        }}
        onSearch={() => {
          setListDatas(undefined);
          const searchParams: any = {};
          searchParams[searchColumn] = searchKey;
          setScrollTopValue(0);
          refresh({page: 1, condition: {
            q: searchParams,
          }});
        }}
        onAddModule={() => {
          Taro.navigateTo({url: `pages/main/workbench/cloud/form/index?module_name=${module_name}`})
        }}
        onCancel={() => {
          setListDatas(undefined);
          setScrollTopValue(0);
          refresh({page: 1, condition: {q: {}}})
        }}
      />
      {/* <HeadMenu /> */}
      {!loading || listDatas ? (
        <View className='content-list'>
          {listDatas && listDatas.length ? (
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
                if (info && info.total_count !== listDatas.length && !loading) {
                  refresh({page: page + 1, condition});
                }
              }, 1000, {leading: true, trailing: false})}>
              <PullToRefresh
                onRefresh={async () => {
                  if (!loading) {
                    refresh({page: 1});
                  }
                }}
              >
                <View className="content">
                  {listDatas && listDatas.map((item, key) => 
                    <ListItem
                      item={item}
                      key={key}
                      module={module}
                      module_name={module_name}
                      fields={fields}
                      onChange={(id: string, type?: string) => {
                        setListDatas(listDatas.filter((list) => list.id !== id));
                        if (type === 'error') {
                          refresh({page: 1});
                        }
                      }}
                      onClick={() => {
                        setListDatas((lists) => lists?.map((list) => list.id === item.id ? {...list, active: true} : {...list}));
                      }}
                    />
                  )}
                </View>
              </PullToRefresh>
              {showSortFields && fields.length ? (
                <View className='show-sort-fields'>
                  <View className='show-sort-fields-content'>
                    <View className='show-sort-fields-content-box'>
                      {sortFields && sortFields.map((item, index) => {
                        const field = fields.find((field) => field.api_name === item.api_name);
                        return field && (
                          <View key={index} className="show-sort-fields-item" onClick={() => {
                            setSortBy(field.api_name);
                            // setShowSortFields(false);
                          }}>
                            <Text className={field.api_name === sortBy ? 'show-sort-fields-item-text active' : 'show-sort-fields-item-text'}>{field.field_label}</Text>
                            {field.api_name === sortBy ? (
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
                        refresh({page: 1});
                        setShowSortFields(false);
                      }}>重置</Text>
                      <Text className='show-sort-fields-ok' onClick={() => {
                        if (sortOrder.key !== 'default') {
                          setListDatas(undefined);
                          refresh({page: 1});
                        }
                        setShowSortFields(false);
                      }}>确定</Text>
                    </View>
                  </View>
                  <View style={{flex: 1}} onClick={() => setShowSortFields(false)}/>
                </View>
              ) : null}
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
                  if (isNewAdd || module?.isNew) {
                    Taro.navigateTo({url: `pages/main/workbench/cloud/form/index?module_name=${module_name}`})
                    return;
                  }
                  Taro.navigateBack();
                }}>
                {isNewAdd || module?.isNew ? '创建' : '返回'}
              </Button>
            </AutoCenter>
          )}
        </View>
      ) : (
        <Loading />
        )}
    </View>
  )
}

export default Index;

const renderField = (field: any, data: any, module_name: string) => {
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
  } else if (module_name === 'Contracts' && field.name === 'signing_date') {
    const contract_type = new RegExp("合同","g");
    const type = module_name === 'Contracts' && data.contract_type.replace(contract_type, '');
    showText = <Text>{text} -- <Text style={{color: '#1661ab'}}>{type}</Text></Text>;
  }
  return (
    <View className='content-list-item-row2'>
      <Text className='content-list-item-label'>
        {field.label}:
      </Text>
      <Text className='content-list-item-text'>
        {showText}
      </Text>
    </View>
  );
};

const ListItem = ({item, module_name, module, onChange, fields, onClick}) => {
  const name = item.name || item.number || item.code || '';

  const [statusColor, setStatusColor] = useState('#666');

  useEffect(() => {
    if (module_name === 'Contracts') {
      switch (item.status) {
        case '审批拒绝':
          setStatusColor('#ec2c64');
          break;
        case '审批中':
          setStatusColor('#1661ab');
          break;
        case '审批完成':
          setStatusColor('#2c9678');
          break;
        case '终止关闭':
          setStatusColor('#ec2c64');
          break;
        default:
          setStatusColor('#b2bbbe');
          break;
      }
    }

    if (module_name === 'ReceptionProofing') {
      switch (item.status) {
        case '经理审批中':
          setStatusColor('#1661ab');
          break;
        case '总监审批中':
          setStatusColor('#1661ab');
          break;
        case '商务接待组审批中':
          setStatusColor('#2c9678');
          break;
        case '打分':
          setStatusColor('#2c9678');
          break;
        case '审批完成':
          setStatusColor('#2c9678');
          break;
        default:
          setStatusColor('#b2bbbe');
          break;
      }
    }

  }, []);

  return (
    <SwipeAction key={item.id} rightActions={module?.btns && [
      {
        key: module?.btns[0].key,
        text: module?.btns[0].text,
        color: 'warning',
        onClick: () => {
          Taro.showLoading();
        }
      },
    ]}>
      <View className="content-list-item-row" onClick={() => {
        Taro.navigateTo({url: `pages/main/workbench/cloud/show/index?module_name=${module_name}&id=${item.id}&title=${module.name}`});
        onClick();
      }}>
        <View className='content-list-item'>
          <View className='content-list-item-top'>
            <Text className="content-list-item-name" style={{color:  item?.active ? '#999' : '#333'}}>
              {name}
            </Text>
            {module_name === 'Contracts' && <Tag color={statusColor} className='content-list-item-status'>{item.status || '草稿'}</Tag>}
            {module_name === 'ReceptionProofing' && <Tag color={statusColor} className='content-list-item-status'>{item.status || '草稿'}</Tag>}
          </View>
          {fields.map((fildesItem, fildesIndex) => {
            return item[fildesItem.name] === undefined ? null : (
              <View key={fildesIndex}>
                {renderField(fildesItem, item, module_name)}
              </View>
            );
          })}
        </View>
      </View>
    </SwipeAction>
  )
}
