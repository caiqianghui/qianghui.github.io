/**
 * 关联任务
 */
import { View, Text, Image } from "@tarojs/components";
import { DotLoading, NavBar, Popup } from "antd-mobile";
import { AddOutline, EnvironmentOutline, DownOutline, UpOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";

import FormContainer from 'src/pages/main/workbench/zoho/form';
import dayjs from "dayjs";
import NoteCreate from "./NoteCreate";
import SigninListItem from "src/components/ListItem";
import { message } from "antd";
import NoteSignIn from "./NoteSignIn";
import iBodor from 'src/pages/main/workbench/ibodor';
import PhoneCall from 'src/assets/icons/phone-call.png';
import HttpClient from "src/utils/http/cloud/HttpClient";

const {ltcMenu} = iBodor;
const {children} = ltcMenu;

interface ItemProps {
  list: any;
  datas: Array<any>;
  info?: any;
  active: boolean;
  zoho_id?: string;
  module?: string;
  loading?: boolean;
  onMore?: () => void;
  onFields?: () => void;
  page?: number;
  fields?: any;
}

interface NoteProps {
  module: string;
  zoho_id: string;
  list: any;
  refreshKey?: {
    time?: Date,
    api_name?: string,
  };
}
 
// 信息
export default (props: NoteProps) => {
 
  const { module, zoho_id, list, refreshKey} = props;

  const [showForm, setShowForm] = useState(false);

  const [showAddNote, setShowAddNote] = useState(false);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [datas, setDatas] = useState<Array<any>>([]);
  const [info, setInfo] = useState({
    more_records: false,
  });

  // 是否展开
  const [active, setActive] = useState(false);

  const [fields, setFields] = useState();

  const getLayout = () => {
    if (list.api_name !== 'Signin') {
    }
    NetCloudFun.get('/crm/v2/settings/layouts', {
      module: list.api_name
    }).then((res: any) => {
      if (res.layouts) {
        setFields(res.layouts[0]);
      }
    }).catch((err) => {
      console.log('error', list.api_name, err);
    })
  }

  const refresh = (page: number) => {
    setLoading(true);
    NetCloudFun.get(`/crm/v2/${module}/${zoho_id}/${list.api_name}`, {
      page,
      per_page: 5,
    }).then((res: any) => {
      setLoading(false);
      console.log('list-key', list.api_name, res);
      if (res.data) {
        setActive(true);
        setPage(page);
        if (page === 1) {
          setDatas(res.data);
        } else {
          setDatas(datas && datas.concat(res.data));
        }
        setInfo(res.info);
      }
    }).catch((err) => {
      setLoading(false);
      console.log('error', list.api_name, err);
    })
  }

  useEffect(() => {
    if (list.api_name !== 'Signin') {
      refresh(1);
    }
  }, []);

  useEffect(() => {
    if (refreshKey && refreshKey.api_name === list.api_name) {
      refresh(1);
    }
  }, [refreshKey]);

  return (
    <View className="association-content">
      <View className='association-item' onClick={() => setActive(!active)}>
        <Text>{list.title}</Text>
        {list.api_name !== 'Signin' && list.api_name !== 'Calls' ?
          <AddOutline onClick={() => {
            if (list.api_name === 'Notes') {
              setShowAddNote(true);
            } else {
              setShowForm(true)
            }
           }}
        /> : (
          active ? <UpOutline /> :
          <DownOutline />
        )}
        
      </View>
      {datas ? (
        <ListItem list={list} active={active} datas={datas} info={info} fields={fields} onFields={() => getLayout()}/>
      ) : null}

      {/* 除了签到的加载更多 */}
      {active && list.api_name !== 'Signin' &&
        <ListItemTip loading={loading} datas={datas} isMore={info && info.more_records} onLookMore={() => refresh(page + 1)} list={list}/>
      }
      {/* 签到 */}
      {list.api_name === 'Signin' && <Signin list={list} active={active} datas={[]} info={info} module={module} zoho_id={zoho_id} />}
      
      <Popup visible={showForm} onMaskClick={() => setShowForm(false)} bodyStyle={{height: '90vh'}}>
        <View style={{height: '100%'}}>
          <FormContainer onBack={() => setShowForm(false)} open_type={'show'} module_name={list.api_name}/>
        </View>
      </Popup>
      {/* 备注创建 */}
      <Popup visible={showAddNote} onMaskClick={() => setShowAddNote(false)} bodyStyle={{height: '90vh'}}>
      <NoteCreate onBack={(e) => {
        setShowAddNote(false)
        if (e && e === 'success') {
          refresh(1);
        }
      }} module={module} zoho_id={zoho_id}/>
    </Popup>
    </View>
  )
}


const ListItem = (props: ItemProps) => {
  const {list} = props;
  return (
    <>
    {list.api_name === 'Notes' && <Notes {...props} />}
    {list.api_name === 'Contacts' && <Contacts {...props} />}
    {list.api_name === 'Calls' && <Calls {...props} />}
  </>
  )
}


//  备注
const Notes = (props: ItemProps) => {
  const {active, datas} = props;

  const [signinData, setSigninData] = useState();
  const [noteDetail, setNoteDetail] = useState();

  return (
    <>
      <View className='note-content'>
        {active &&
          <>
            {datas.map((item) => {
              return (
                <View key={item.id} className='note-item' onClick={() => {
                  console.log('item', item);
                  if (item.Parent_Id.Check_In_Address) {
                    setSigninData(item);
                  } else {
                    setNoteDetail(item);
                  }
                }}>
                  <View className='note-item-avatar'>
                    <Text>{item.Created_By.name[0]}</Text>
                  </View>
                  <View className='note-item-text-content'>
                    {item.Note_Title || item.Note_Content ? (
                      <Text className='note-item-title'>{item.Note_Title} - {item.Note_Content}</Text>
                    ) : (
                      <Text className='note-item-title1'>签到:{item.Parent_Id.Check_In_Address}</Text>
                    )}
                    <Text className='note-item-name'>通过  {item.Modified_By.name} {dayjs(item.Created_Time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </View>
                  <View className='note-item-right'>
                    {item.Parent_Id.Check_In_Address ? <EnvironmentOutline fontSize={24} color="#666"/> : null}
                  </View>
                </View>
              )
            })}
          </>
        }
        <Popup
          visible={signinData}
          onMaskClick={() => {
            setSigninData(undefined);
          }}
          bodyStyle={{ height: '100vh' }}
        >
          <NoteSignIn onBack={() => setSigninData(undefined)} data={signinData} />
        </Popup>
        <Popup visible={noteDetail} onMaskClick={() => setNoteDetail(undefined)} bodyStyle={{height: '90vh'}}>
          <NoteCreate data={noteDetail} onBack={(e) => {
            setNoteDetail(undefined);
          }} />
        </Popup>
      </View>
    </>
  )
}

// 联系人
const Contacts = (props: ItemProps) => {
  const {active, datas, fields, onFields, list} = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>();

  return (
    <View className="contacts-content">
      {active && 
        <>
          {datas.map((item) => {
            return (
              <View key={item.id} className='contacts-item' onClick={() => {
                if (!fields) { 
                  onFields && onFields()
                };
                setData(item);
                setVisible(true);
              }}>
                <View className="contacts-item-avatar">
                  <Text>{item.Last_Name[0]}</Text>
                </View>
                <View className="contacts-item-text">
                  <Text className="contacts-item-subject">{item.Last_Name}</Text>
                  <Text className="contacts-item-subject">{item.Email}</Text>
                  <Text className="contacts-item-subject">{item.Phone}</Text>
                </View>
              </View>
            )
          })}
        </>
      }
      <ItemPopup
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        fields={fields}
        data={data}
        title={list.title}
      />
    </View>
  )
}

interface ItemPopupProps {
  fields: any;
  visible: boolean;
  data: any;
  title: string;
  onClose: () => void;
}

const ItemPopup = (props: ItemPopupProps) => {
  const {fields, visible, data, title, onClose} = props;

  const renderField = (field) => {
    let name = '';
    switch (field.json_type) {
      case 'jsonobject':
        name = data[field.api_name]?.name || '';
        break;
      case 'jsonarray':
        name = data[field.api_name] && data[field.api_name].length ? data[field.api_name].join(',') : '';
        break;
      default:
        name = data[field.api_name] || '';
        break;
    }
    if (name) {
      switch (field.data_type) {
        case 'datetime':
          return dayjs(name).format('YYYY-MM-MM HH:mm:ss');
        default: 
          return name;
      }
    }
  }

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{height: '60vh'}}>
    <View className="calls-popup">
      <NavBar onBack={onClose}>{title}信息</NavBar>
      <View className="calls-popup-content">
        {fields && fields.sections.map((section) => section.fields).flat().map((field, index) => {
          const name = renderField(field);
          return name && (
            <View key={index} className="calls-popup-item">
              <Text className="calls-popup-item-label">{field.field_label}:</Text>
              <Text className="calls-popup-item-content">{name}</Text>
            </View>
          )
        })}
      </View>
    </View>
  </Popup>
  )
}

//  通话
const Calls = (props: ItemProps) => {
  const {active, datas, fields, onFields, list} = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>();

  return (
    <View className="calls-content">
      {active && 
        <>
          {datas.map((item) => {
            return (
              <View key={item.id} className='calls-content-item' onClick={() => {
                if (!fields) { 
                  onFields && onFields()
                };
                setData(item);
                setVisible(true);
              }}>
                <Image src={PhoneCall} className='calls-content-item-icon'/>
                <View className="calls-content-item-content">
                  {/* 备注 */}
                  <Text className="left-time">{item.Subject}</Text>
                  {/* 拨打时间 */}
                  <Text className="events-item-time">{dayjs(item.Call_Start_Time).format('YYYY年MM月DD日 HH:mm')}</Text>
                </View>
                {/* 时长 */}
                <Text>{item.Call_Duration}</Text>
              </View>
            )
          })}
        </>
      }
      <ItemPopup
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        fields={fields}
        data={data}
        title={list.title}
      />
    </View>
  )
}

//  签到
const Signin = (props: ItemProps) => {

  const {module, zoho_id, active} = props;

  const [datas, setDatas] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (active) {
      if (!datas.length) {
        refresh(1);
      }
    }
  }, [active]);

  const refresh = (page: number) => {
    setLoading(true);
    HttpClient.get('/api/v1/SalesSignIn', {
      params: {
        page,
        per_page: 2,
        q: {module_type_eq: children.find((item) => item.moduleName === module)?.name, module_id_eq:  zoho_id},
        attachment_fields: {
          '6947625331062734848': 'sign_images'
        }
      }
    }).then((res) => {
      if (res.code === 200 && res.data) {
        if (page === 1) {
          setDatas(res.data.datas);
        } else {
          setDatas(datas && datas.concat(res.data.datas));
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

  return (
    <View className="signin-list-content">
      {active &&
        <>
          {datas.map((data) => 
            <View key={data.id} className="signin-list-content-item">
              <SigninListItem data={data}/>
            </View>
          )}
          <ListItemTip loading={loading} datas={datas} isMore={info && datas.length !== info.total_count} onLookMore={() => refresh(page + 1)} list={{title: '签到'}}/>
        </>
      }
    </View>
  )
}

interface ListItemTipProps {
  loading: boolean;
  datas: Array<any>;
  isMore: boolean;
  onLookMore: () => void;
  list: any;
}

const ListItemTip = (props: ListItemTipProps) => {
  const {loading, datas, isMore, onLookMore, list} = props;
  return (
    <>
      {loading ? 
        <Text className="association-content-center-text">加载中<DotLoading /></Text> :
        datas && isMore && 
        <Text className="association-content-center-text" onClick={onLookMore}>查看更多</Text>
      }
      {!datas.length && !loading && <Text className="association-content-center-text">暂无{list.title}</Text>}
    </>
  )
}
