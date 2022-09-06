import { View, Text, ScrollView } from "@tarojs/components"
import { Button, DotLoading, Popup, Radio, SearchBar } from "antd-mobile";
import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";
import {RightOutline} from 'antd-mobile-icons'
import { message } from "antd";
import ibodor from 'src/pages/main/workbench/ibodor';

const {signInMoudles} = ibodor;
interface Props {
  moduleName: string;
  onSelect: (e: any) => void;
  value: string;
}

export default (props: Props) => {

  const {moduleName, onSelect} = props;

  const [showModule, setShowModule] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [listDatas, setListDatas] = useState<Array<any>>();
  const [info, setInfo] = useState<any>();
  const [page, setPage] = useState(1);

  const [moduleValue, setModuleValue] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModuleValue(undefined);
  }, [moduleName]);

 // 刷新方法
 const refresh = (page: number, clear?: boolean) => {
  setLoading(true);
  const params: any = {
    page,
    per_page: 20,
  }

  if (moduleName) {
    const _module = signInMoudles.find((type) => type.label === moduleName);
    if (_module) {
      if (!searchKey || clear) {
        console.log('functions');
        NetCloudFun.get(`/crm/v2/${_module.value}`, params).then((res: any) => {
          console.log('functions', res);
          if (res.data) {
            // Taro.hideLoading();
            setPage(page);
            if (page === 1) {
              setListDatas(res.data);
            } else {
              setListDatas((listDatas || []).concat(res.data));
            }
            setInfo(res.info);
            setLoading(false);
          }
        }).catch((_err) => {
          setListDatas([]);
          setLoading(false);
        })
      } else {
        NetCloudFun.get(`/crm/v2/${_module.value}/search`, {
          word: searchKey,
          page,
          per_page: 20
        }).then((res: any) => {
          console.log('functions', res);
          if (res.data) {
            // Taro.hideLoading();
            setPage(page);
            if (page === 1) {
              setListDatas(res.data);
            } else {
              setListDatas((listDatas || []).concat(res.data));
            }
            setInfo(res.info);
            setLoading(false);
          }
        }).catch((_err) => {
          setListDatas([]);
          setLoading(false);
        })
      }
    }
  }
};

  return (
    <View className="field" >
      <View onClick={() => {
        if (!moduleName) {
          message.warn('请先选择签到模块')
        } else {
          setListDatas(undefined);
          refresh(1);
          setShowModule(true);
        }
      }} className="field-content">
        <Text className="field-text">{moduleValue && moduleValue.name || ''}</Text>
        <RightOutline />
      </View>
      <Popup
        visible={showModule}
        onMaskClick={() => {
          setShowModule(false)
        }}
        bodyStyle={{height: '70vh'}}
      >
        <View className="show-menu-content">
          <SearchBar
            placeholder='请输入内容'
            onChange={(e) => setSearchKey(e)}
            onSearch={() => refresh(1)}
            onClear={() => refresh(1, true)}
          />
          {listDatas && 
            <View className="show-menu-content-scroll">
              <ScrollView
                style={{height: '100%'}}
                scrollTop={0}
                enhanced={true}
                scrollY={true}
                lowerThreshold={100}
                onScrollToLower={() => {
                  if (info.more_records) {
                    refresh(page + 1);
                  }
                }}>
                <Radio.Group defaultValue={moduleValue && moduleValue.id}>
                  {listDatas.map(item => {
                    const _module = signInMoudles.find((type) => type.label === moduleName);
                    const data = getModuleText(item, _module?.value || '');
                    return (
                      <View key={item.id}>
                        <Radio className="content-list-item-row" block value={item.id} onChange={() => {
                          setModuleValue({
                            id: item.id,
                            ...data
                          });
                          setShowModule(false);
                          onSelect && onSelect({
                            id: item.id,
                            ...data
                          });
                        }}>
                          <View className='content-list-item'>
                            <Text className="content-list-item-name">
                              {data.name}
                            </Text>
                            <Text className="content-list-item-name2">
                              {data.description}
                            </Text>
                            <Text>
                              {data.phone}
                            </Text>
                          </View>
                          <RightOutline />
                        </Radio>
                      </View>
                    )
                  })}
                </Radio.Group>
              </ScrollView>
              {!listDatas.length && !loading && <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>暂无数据<Button onClick={() => refresh(1)}>刷新</Button></Text>}
            </View>
          }
          {loading && 
          <Text style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>加载中<DotLoading /></Text>}
        </View>
      </Popup>
    </View>
  )
}

function getModuleText(value: any, moduleName: string) {
  const data = {
    name: '',
    description: '',
    phone: '',
    amount: 0,
  }

  switch (moduleName) {
    case 'Leads':
      data.name = value.Company;
      data.description = value.Full_Name;
      data.phone = value.Phone;
      break;
    case 'Deals':
      data.name = value.Deal_Name;
      data.description = value.Stage;
      data.amount = value.Amount;
      break;
    case 'Accounts':
      data.name = value.Account_Name;
      data.description = value.Department;
      data.phone = value.Phone;
      break;
    case 'Public_Leads':
      data.name = value.Name;
      data.description = value.Last_Name;
      data.phone = value.Phone;
      break;
  }
  return data;
}