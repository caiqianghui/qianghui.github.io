/**
 * 审批列表
 * approval
 */

import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Loading, NavBar, PullToRefresh, Skeleton, Tabs, Tag } from "antd-mobile";
import { useEffect, useState } from "react";
import NotData from "src/components/NotData";
import HttpClient from "src/utils/http/cloud/HttpClient";
import './index.scss';

export default () => {
 
  return (
    <View className="cloud-approval">
      <NavBar
        backArrow={null}
        style={{background: '#4a93ed'}}>
        <Text style={{color: '#FFF'}}>审批</Text>
      </NavBar>
      <View className="cloud-approval-tabs">
        <Tabs>
          <Tabs.Tab className="cloud-approval-tabs" title="待我审批" key='agency'>
            <List type="my_data"/>
          </Tabs.Tab>
          <Tabs.Tab className="cloud-approval-tabs" title="其他人审批" key='other_data'>
            <List type="other_data"/>
          </Tabs.Tab>
          <Tabs.Tab className="cloud-approval-tabs" title="审批历史" key='my_approved_logs'>
            {/* <List type="approved_list"/> */}
            <ApprovedLogs />
          </Tabs.Tab>
        </Tabs>
      </View>
    </View>
   )
 }
 
interface ListProps {
  type: string;
}
 
const List = (props: ListProps) => {
 
  const {type} = props;
 
  const [datas, setDatas] = useState<Array<{
    name: string;
    owner_name: string;
    module_title: string;
    status_str: string;
    module_name: string;
    process_node_name: string;
    data_id: string;
    id: string;
    wait_deal_time: string;
    usernames: Array<string>;
  }>>();
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getDatas = (_page = 1) => {
    setLoading(true);
    HttpClient.get(`/api/v1/system_process/model_processes/approval_list/?type=${type}`, {
      params: {
        q: {'model_process_form_name_eq': 'Contracts'},
        page: _page,
        per_page: 20,
      }
    }).then((res) => {
      if (res.code === 200 && res.data) {
        console.log('getDatas', type, res);
        setPage(_page);
        const _datas = res.data.datas;
        if (_page === 1) {
          // setDatas(res.data.datas);
          setDatas(_datas);
        } else {
          // setDatas(datas.concat(res.data.datas));
          setDatas(datas && datas.concat(_datas));
        }
        setInfo(res.data.info);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    // 监听删除
    Taro.eventCenter.on('deleteId',(id)=>{
      // console.log('监听删除', id);
      if (id && datas) {
        getDatas();
        // setDatas(datas.filter((list) => list.data_id !== id));
      }
    });

    return () => {
      Taro.eventCenter.off('deleteId');
    }
  }, [datas]);

  return (
    <View className="cloud-approval-tabs-tab-content">
      <PullToRefresh
        onRefresh={async () => {
          if(!loading) {
            getDatas();
          }
        }}
      >
      {datas ? (
        <>
          {datas.length ? (
            <View className="cloud-approval-tabs-tab-content-list">
            {datas.map((data, key) => {
              return (
                <View key={key} className="cloud-approval-tabs-tab-content-list-item" onClick={() => {
                  Taro.navigateTo({url: `pages/main/workbench/cloud/show/index?module_name=${data.module_name}&id=${data.data_id}&title=${data.module_title}`});
                }}>
                  <Text className="cloud-approval-tabs-tab-content-list-item-text webkit-hidden1">
                    <Text className="cloud-approval-tabs-tab-content-list-item-module">{data.module_title}-</Text>
                    <Text className="cloud-approval-tabs-tab-content-list-item-name">{data.name || '<无>'}</Text>
                  </Text>
                  <View>
                    <Tag className="cloud-approval-tabs-tab-content-list-item-tag">{data.process_node_name}-{data.status_str}</Tag>
                    <Tag className="cloud-approval-tabs-tab-content-list-item-tag" color={'red'}>{getShowTime(data.wait_deal_time)}</Tag>
                    <Tag className="cloud-approval-tabs-tab-content-list-item-tag" color={'green'}>{data.owner_name}</Tag>
                  </View>
                  {type === 'other_data' && (
                    <Text>
                      审批人：
                      {data.usernames && data.usernames.map((name, index) => {
                        return (
                          <Text className="cloud-approval-tabs-tab-content-list-item-names" key={index}>{name}</Text>
                        )
                      })}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
          ) : (
            <NotData name="暂无数据"/>
          )}
        </>
      ) : (
        <View style={{padding: '0 20px'}}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={5} animated />
        </View>
      )}
      {info && datas && info.total_count !== datas.length && !loading ? (
        <View className="cloud-approval-tabs-tab-content-foot" onClick={() => {
          getDatas(page + 1);
        }}>
          <Text>加载更多</Text>
        </View>
      ) :  null}
      {loading && <View className="cloud-approval-tabs-tab-content-foot"><Text>加载中<Loading /></Text></View>}
      </PullToRefresh>
    </View>
  )
}
 
const ApprovedLogs = () => {
 
  const [datas, setDatas] = useState<any>([]);
  const [approvalLogs, setApprovalLogs] = useState<any>();
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(false);

  const groupBy = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };


  const getDatas = (_page = 1) => {
    setLoading(true);
    HttpClient.get('/api/v1/system_process/model_processes/my_approved_logs', {
      params: {
        q: {'form_name_eq': 'Contracts'},
        page: _page,
        per_page: 20,
      }
    }).then((res) => {
      if (res.code === 200 && res.data) {
        const _datas = res.data.datas;
        if (_page === 1) {
          // setDatas(res.data.datas);
          setDatas(_datas);
          setApprovalLogs(groupBy(_datas, 'approval_date'));
        } else {
          setDatas(datas.concat(_datas));
          setApprovalLogs(groupBy(datas.concat(_datas), 'approval_date'));
        }
        setPage(_page);
        setInfo(res.data.info);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    getDatas();

  }, []);

  return (
    <View className="cloud-approval-tabs-tab-content" style={{background: '#F2F2F2'}}>
      <PullToRefresh
        onRefresh={async () => {
          if(!loading) {
            getDatas();
          }
        }}
      >
      {datas.length && approvalLogs ? (
        <>
          {Object.keys(approvalLogs).map((data, key) => {
            return (
              <View key={data} className="cloud-approval-tabs-tab-content-logs">
                <Text className="cloud-approval-tabs-tab-content-logs-time">{data}</Text>
                <View className="cloud-approval-tabs-tab-content-logs-content">
                  {approvalLogs[data].map((item, index) => {
                    let color = 'blue';
                    if (item.status === 'rejected') {
                      color = 'red';
                    } else if (item.status === 'passed' || item.status === 'submit') {
                      color = 'green';
                    }
                    return (
                      <View key={index} className="cloud-approval-tabs-tab-content-logs-item">
                        <Text className="cloud-approval-tabs-tab-content-logs-item-time">{item.approval_time}</Text>
                        <div style={{color: '#696969'}}>
                          <span style={{marginRight: 10}}>{item.username}</span>
                          <Tag color={color}>{item.status_str}</Tag>
                          {item.remark && <span style={{marginLeft: 10}}>({item.remark})</span>} 
                          <span style={{marginLeft: 10}}>了名为</span>
                          <a onClick={() => {
                            Taro.navigateTo({url: `pages/main/workbench/cloud/show/index?module_name=${item.module_name}&id=${item.data_id}&title=${item.data_name}`});
                          }}>{item.data_name}</a> 的 <span style={{fontWeight: 'bold', marginRight: 10}}>{item.module_title}</span>
                        </div>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </>
      ) : (
        <View style={{padding: '0 20px'}}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={5} animated />
        </View>
      )}
      {info && info.total_count !== datas.length && !loading ? (
        <View className="cloud-approval-tabs-tab-content-foot" onClick={() => {
          getDatas(page + 1);
        }}>
          <Text>加载更多</Text>
        </View>
      ) :  null}
      {loading && <View className="cloud-approval-tabs-tab-content-foot"><Text>加载中<Loading /></Text></View>}
      </PullToRefresh>
    </View>
  )
}

const getShowTime = (time) => {
  if (!time) {
    return '';
  }

  let value;
  if (time / 60 < 1) {
    value = `${time}秒`;
  } else if (time / 3600 < 1) {
    value = `${Math.round(time / 60)}分钟`;
  } else if (time / 86400 < 1) {
    value = `${Math.round(time / 3600)}小时`;
  } else {
    value = `${Math.round(time / 86400)}天`;
  }

  if (value) {
    return value
  }
}