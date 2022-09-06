import { ScrollView, View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { NavBar, Popup, Selector, DatePicker, PullToRefresh, Popover, DotLoading } from "antd-mobile"
import {FilterOutline, UpOutline, DownOutline} from 'antd-mobile-icons'
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react"
import './index.scss';
import HttpLoading from "src/utils/http/cloud/HttpLoading";
import _ from "lodash";
import { message } from "antd";
import UserField from "../SignForm/components/Section/FormElement/elements/UserField";
import ibodor from 'src/pages/main/workbench/ibodor';
import ListItem from "src/components/ListItem";

const {signInMoudles, signInTypes} = ibodor;

export default () => {
  const [signinList, setSigninList] = useState<Array<any>>([]);

  const [screenVisible, setScreenVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>()

  const [loading, setLoading] = useState(false);

  const [isScreen, setIsScreen] = useState(false);

  useEffect(() => {
    if (!signinList.length) {
      refresh({page: 1});
    }
  }, []);

  const [condition, setCondition] = useState<any>();

  const refresh = async ({page, cond, type}: {page: number, cond?: boolean, type?: string}) => {
    const date: any = {};
    if (startTimeValue && endTimeValue) {
      date.created_at_gteq = startTimeValue
      date.created_at_lteq = endTimeValue
    } else {
      if (endTimeValue) {
        date.created_at_lt = endTimeValue
      }
      if (startTimeValue) {
        date.created_at_gt = startTimeValue
      }
    }

    const user: any = {};
    if (signinUser) {
      user.creator_id_in = signinUser;
    }

    const _cond = cond ? {} : {...condition, ...date};

    setLoading(true);
    HttpLoading.get('/api/v1/SalesSignIn', {
      params: {
        page,
        per_page: 10,
        q: {
          sign_type_in: type === 'false' ? '' : type || siginType,
          ..._cond,
        },
        attachment_fields: {
          '6947625331062734848': 'sign_images'
        }
      }
    }).then((res) => {
      if (res.code === 200 && res.data) {
        if (page === 1) {
          setSigninList(res.data.datas);
        } else {
          setSigninList(signinList.concat(res.data.datas));
        }
        setPage(page);
        setInfo(res.data.info);
        setLoading(false);
      }
    }).catch((err) => {
      setLoading(false);
      // console.log(err);
      message.error(err.tips);
    })
  }

  const [showModuleType, setShowModuleType] = useState(false);
  const [showVisitType, setShowVisitType] = useState(false);

  const [startVisible, setStartVisible] = useState(false);
  const [startTimeValue, setStartTimeValue] = useState<string>('');
  const [endVisible, setEndVisible] = useState(false);
  const [endTimeValue, setEndTimeValue] = useState<string>('');

  const [signinUser, setSigninUser] = useState('');

  const [scrollTopValue, setscrollTopValue] = useState(0);

  const [siginType, setSiginType] = useState('');

  const sigLists = [
    {label: '所有列表', value: ''},
    {label: '签到列表', value: '签到'},
    {label: '签离列表', value: '签离'},
  ];

  const navBarRef = useRef<any>();

  return (
    <View className="signin-content">
      <NavBar
        className="signin-content-navbar"
        onBack={() => Taro.navigateBack()}
        right={<FilterOutline fontSize={18} onClick={() => setScreenVisible(true)}/>}
      >
        <Popover ref={navBarRef} trigger="click" placement="bottom" content={
          <View style={{display: 'flex', flexDirection: 'column'}}>
            {sigLists.map((item, index) => {
              return (
                <Text style={{padding: '4px 10px', background: siginType === item.value ? '#ccc' : '#fff'}} onClick={() => {
                  setSiginType(item.value);
                  refresh({
                    page: 1,
                    type: item.value || 'false'
                  })
                  navBarRef && navBarRef.current.hide();
                }} key={index}>{item.label}</Text>
              )
            })}
          </View>
        }>
          <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Text onClick={() => setscrollTopValue(0)}>{siginType || '所有'}列表<Text className="signin-content-navbar-subtitle">{info ? `(${info.total_count})` : ''}</Text></Text>
            <DownOutline fontSize={12}/>
          </View>
        </Popover>
      </NavBar>
      <View className="signin-content-main">
        <ScrollView
          scrollTop={scrollTopValue}
          style={{height: '100%'}}
          scrollY={true}
          lowerThreshold={200}
          onScroll={(event) => setscrollTopValue(event.detail.deltaY)}
          onScrollToLower={_.throttle(() => {
            if (info && signinList.length !== info.total_count && !loading) {
              refresh({page: page + 1});
            }
          }, 1000, {leading: true, trailing: false})}
        >
          <PullToRefresh
            onRefresh={async () => {
              refresh({page: 1});
            }}
          >
            <View className="list-content">
              {signinList.length ? (
                <>
                  {signinList.map((item) => {
                    return (
                      <View key={item.id} style={{marginBottom: '10px', background: item?.active ? 'rgba(247, 247, 248)' : '#FFF'}}>
                        <ListItem onClick={() => {
                          setSigninList((lists) => lists.map((list) => list.id === item.id ? {...list, active: true} : {...list}));
                        }} data={item}/>
                      </View>
                    )
                  })}
                </>
              ) : null}
              {loading ? <Text style={{display: 'block', textAlign: 'center', marginTop: '50px', color: '#666'}}>加载中<DotLoading /></Text> : (
                <>
                  {!info?.total_count ? <Text style={{display: 'block', textAlign: 'center', marginTop: '50px', color: '#666'}}>暂无签到数据</Text> : null}
                </>
              )}
              {(info && signinList.length && signinList.length === info.total_count) ? <Text style={{display: 'block', textAlign: 'center', margin: '50px 0', color: '#666'}}>到底了</Text> : null}
            </View>
          </PullToRefresh>
        </ScrollView>
      </View>
      <Popup visible={screenVisible} onMaskClick={() => setScreenVisible(false)} bodyStyle={{height: window.innerHeight * 0.8 + 'px'}}>
        <View className="signin-list-popup-content">
          <Text className="title">全部筛选</Text>
          <View className="scroll">
            <View className={'item ' + (!showVisitType && 'active') } onClick={() => setShowVisitType(!showVisitType)}>
              <Text className="title2">签到类型</Text>
              {!showVisitType ? <DownOutline /> : <UpOutline />}
            </View>
            {showVisitType && (
              <Selector
                style={{
                  '--border-radius': '100px',
                  '--border': 'solid transparent 1px',
                  '--checked-border': 'solid var(--adm-color-primary) 1px',
                  '--padding': '6px 20px',
                  'fontSize': '14px',
                }}
                showCheckMark={false}
                options={signInTypes}
                multiple={true}
                value={condition?.visit_type_in || []}
                onChange={(arr) => {
                  setCondition({
                    ...condition,
                    'visit_type_in': arr,
                  });
                }}
              />
            )}
            <View className={'item ' + (!showModuleType && 'active')} onClick={() => setShowModuleType(!showModuleType)}>
              <Text className="title2">签到模块</Text>
              {!showModuleType ? <DownOutline /> : <UpOutline />}
            </View>
            {showModuleType && (
              <Selector
                style={{
                  '--border-radius': '100px',
                  '--border': 'solid transparent 1px',
                  '--checked-border': 'solid var(--adm-color-primary) 1px',
                  '--padding': '6px 20px',
                  'fontSize': '14px',
                }}
                showCheckMark={false}
                options={signInMoudles}
                multiple={true}
                value={condition?.module_type_in || []}
                onChange={(arr) => {
                  setCondition({
                    ...condition,
                    'module_type_in': arr,
                  });
                }}
              />
            )}
            <View className="item">
              <Text className="title2">签到日期</Text>
            </View>
            <View className="time-content">
              <Text className="time-left time" onClick={() => setStartVisible(true)}>{startTimeValue}</Text>
              <Text>一</Text>
              <Text className="time-right time" onClick={() => setEndVisible(true)}>{endTimeValue}</Text>
            </View>
            <View className="item">
              <Text className="title2">签到者</Text>
              <View className="item-right">
                <UserField value={condition?.creator_id_in} multiple={true} onChange={(e) => {
                  setSigninUser(e);
                  setCondition({
                    ...condition,
                    'creator_id_in': e,
                  });
                }}/>
              </View>
            </View>
          </View>
          <View className="bottom-content">
            <View className="bottom-btns">
              <Text className="btn1 btn" onClick={() => {
                setCondition(undefined);
                setStartTimeValue('');
                setEndTimeValue('');
                if (isScreen) {
                  setIsScreen(false);
                  refresh({page: 1, cond: true});
                }
              }}>重置</Text>
              <Text className="btn2 btn" onClick={() => {
                setIsScreen(true);
                setscrollTopValue(0);
                if (condition || startTimeValue || endTimeValue) {
                  refresh({page: 1})
                }
                setScreenVisible(false);
              }}>筛选</Text>
            </View>
          </View>
        </View>
      </Popup>
      <DatePicker
        visible={startVisible}
        onClose={() => {
          setStartVisible(false)
        }}
        precision='minute'
        onConfirm={val => {
          setStartTimeValue(dayjs(val).format('YYYY-MM-DD HH:mm'));
        }}
      />
      <DatePicker
        visible={endVisible}
        onClose={() => {
          setEndVisible(false)
        }}
        precision='minute'
        onConfirm={val => {
          setEndTimeValue(dayjs(val).format('YYYY-MM-DD HH:mm'));
        }}
      />
    </View>
  )
}
