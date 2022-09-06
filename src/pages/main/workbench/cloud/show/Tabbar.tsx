import { ProcessMoudle, ProcessNodeMoudle } from ".";
import { useEffect, useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Dialog, DotLoading, Popover, Popup } from 'antd-mobile'
import { EditSOutline, MoreOutline, RedoOutline, FileWrongOutline} from 'antd-mobile-icons';
import _ from 'lodash'
import { message } from 'antd'
import { processResubmit, processRevoke } from 'src/pages/services/model_process'
import AgreeModal from './Overview/AgreeModal'
import RejectModal from './Overview/RejectModal'
import AppendModal from './Overview/AppendModal'
import TransferModal from './Overview/TransferModal'
import ReturnMoal from './Overview/ReturnMoal'
import SubmitModal from './Overview/SubmitModal'
import { Module } from "src/pages/main/workbench/ibodor";

interface Props {
  module?: Module,
  data: any,
  processes?: ProcessMoudle,
  currentUser: any,
  freshProcess: (e?: boolean) => void,
  module_name: string,
  loading: boolean,
}

export default (props: Props) => {
  const {data, processes, currentUser, freshProcess, module_name, loading, module} = props;
  const isEdit = data.can_updated && !data.lock_edit && module && module.isNew;
  
  const [approval_button_setting, setapproval_button_setting] = useState<any>();
  const [settings, setSettings] = useState<Array<any>>([]);
  const [currentProcessNode, setCurrentProcessNode] = useState<ProcessNodeMoudle>();
  const beforeNodes =
    processes?.process_nodes?.filter(
      (item) => item.sort_num < (currentProcessNode?.sort_num || 0),
    ) || [];

  useEffect(() => {
    if (processes) {
      console.log('processes', processes);
      let currentNode: any = null;
      let isPause = false;
      processes.process_nodes.forEach((process_node) => {
        if (!isPause) {
          if (isShowButton('aduit', processes, process_node)) {
            currentNode = process_node;
          } else if (process_node.status === 'pause') {
            currentNode = null;
            isPause = true;
          }
        }
      });
      console.log('currentNode', currentNode);

      setapproval_button_setting(currentNode ? currentNode?.approval_node.approval_button_setting : undefined);
      if (currentNode) {
        if (currentNode?.approval_node.approval_button_setting) {
          setSettings(Object.keys(currentNode?.approval_node.approval_button_setting).filter((item) => !(item === 'agree' || item === 'reject') && currentNode?.approval_node.approval_button_setting[item].enabled));
        } else {
          setSettings([]);
        }
      }
      setCurrentProcessNode(currentNode);
    }
  }, [processes]);
  
   // 判断显示的按钮
   const isShowButton = (
    showType: string,
    _processes: ProcessMoudle,
    process_node?: ProcessNodeMoudle,
  ) => {
    if (_processes && currentUser) {
      if (showType === 'revoke') {
        return (
          (currentUser.is_admin ||
            (data.owner_id && currentUser.id === data.owner_id.id)) &&
          _processes.status !== 'revoke' &&
          _processes.process_nodes[0].status === 'wait_audit'
        );
      }

      if (showType === 'aduit') {
        if (process_node) {
          const isCurrent =
            process_node.current_approver_ids.indexOf(currentUser.id) !== -1;
          return (
            (isCurrent || currentUser.is_admin) &&
            (process_node.status === 'wait_audit' ||
              process_node.status === 'aduiting')
          );
        }
      }

      if (showType === 'resubmit') {
        return (
          (_processes.status === 'rejected' ||
            _processes.status === 'revoke') &&
          (currentUser.is_admin ||
            (data.owner_id && currentUser.id === data.owner_id.id))
        );
      }
    }
    return false;
  };

  const moreRef = useRef<any>();

  // 撤回
  const revokeProcess = _.throttle(
    (id: string) => {
      Dialog.confirm({
        title: '确定撤回吗？',
        onConfirm: () => {
          processRevoke({process_id: id}).then((res) => {
            if (res.code === 200) {
              freshProcess();
              message.success(res.data.results.tip || '');
            } else {
              message.success(res.tips || '');
            }
          });
        }
      })
    },
    2000,
    {leading: true, trailing: false},
  );

  // 重新提交
  const reSubmitProcess = _.throttle(
    (id: string) => {
      processResubmit({process_id: id})
        .then((res) => {
          if (res.code === 200) {
            freshProcess();
            message.success(res.data.results.tip || '');
          } else {
            message.success(res.tips || '');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    2000,
    {leading: true, trailing: false},
  );

  const onMore = (type: string, title?: string) => {
    moreRef.current && moreRef.current.hide();
    switch (type) {
      case 'submit':
        // 提交
        setSubmitVisible(true);
        break;
      case 'transfer':
        // 转交
        setTransferVisible(true);
        break;
      case 'append':
        // 加签
        setAppendVisible(true);
        break;
      case 'return':
        // 退回
        setReturnVisible(true);
        break;
      case 'modify':
        // 编辑
        Taro.navigateTo({
          url: `pages/main/workbench/cloud/form/index?module_name=${module_name}&process_node_id=${currentProcessNode?.id}&id=${data.id}&title=${title}`,
        })
        break;
    }
  }

  const [aggreeVisible, setAggreeVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [appendVisible, setAppendVisible] = useState(false);
  const [returnVisible, setReturnVisible] = useState(false);

  return (
    <View className='cloud-show-tabbar' style={{display: isEdit || settings.length ? 'flex' : 'none'}}>
      {!loading ? (
        <View className="cloud-show-tabbar-row">
          {isEdit ?
            <View
              onClick={() => {
                Taro.navigateTo({
                  url: `pages/main/workbench/cloud/form/index?module_name=${module_name}&id=${data.id}`,
                })
              }}
              className='cloud-show-tabbar-btn'>
              <EditSOutline fontSize={22} />
              <Text>修改</Text>
            </View> : null
          }
          {processes && isShowButton('resubmit', processes) && 
            <View
              onClick={() => reSubmitProcess(processes ? processes.id : '')}
              className='cloud-show-tabbar-btn'>
              <RedoOutline fontSize={22} />
              <Text>重新提交</Text>
            </View>
          }
          {processes && isShowButton('revoke', processes) && 
            <View
              onClick={() => revokeProcess(processes ? processes.id : '')}
              className='cloud-show-tabbar-btn'>
              <FileWrongOutline fontSize={22} />
              <Text>撤回</Text>
            </View>
          }
          {/* 退回 */}
          {approval_button_setting?.return?.enabled && 
            <View className='cloud-show-tabbar-btn2' style={{background: '#ec2c64'}} onClick={() => {
              onMore('return');
            }}>
              <Text style={{color: '#FFF'}}>{approval_button_setting?.return?.name}</Text>
            </View>
          }
          {/* 提交 */}
          {approval_button_setting?.submit?.enabled && 
            <View className='cloud-show-tabbar-btn2' style={{background: '#1661ab'}} onClick={() => {
              onMore('submit');
            }}>
              <Text style={{color: '#FFF'}}>{approval_button_setting?.submit?.name}</Text>
            </View>
          }
          {/* 编辑 */}
          {approval_button_setting?.modify?.enabled && 
            <View className='cloud-show-tabbar-btn2' style={{background: '#2c9678'}} onClick={() => {
              onMore('modify', approval_button_setting?.modify?.name);
            }}>
              <Text style={{color: '#FFF'}}>{approval_button_setting?.modify?.name}</Text>
            </View>
          }
          {/* 加签 */}
          {approval_button_setting?.append?.enabled && 
            <View className='cloud-show-tabbar-btn2' style={{background: '#2c9678'}} onClick={() => {
              onMore('append');
            }}>
              <Text style={{color: '#FFF'}}>{approval_button_setting?.append?.name}</Text>
            </View>
          }
          {/* 转交 */}
          {approval_button_setting?.transfer?.enabled && 
            <View className='cloud-show-tabbar-btn2' style={{background: '#b2bbbe'}} onClick={() => {
              onMore('transfer');
            }}>
              <Text style={{color: '#FFF'}}>{approval_button_setting?.transfer?.name}</Text>
            </View>
          }
          {/* 拒绝 */}
          {approval_button_setting?.reject?.enabled && 
            <View className='cloud-show-tabbar-btn2' onClick={() => {
              setRejectVisible(true);
            }}>
              <Text>{approval_button_setting?.reject?.name}</Text>
            </View>
          }
          {/* 同意 */}
          {approval_button_setting?.agree?.enabled && 
            <View className='cloud-show-tabbar-btn2 primary' onClick={() => setAggreeVisible(true)}>
              <Text>{approval_button_setting?.agree?.name}</Text>
            </View>
          }
        </View>
      ) :  (
        <DotLoading />
      )}
      
      <Popup visible={aggreeVisible} destroyOnClose={true} onMaskClick={() => setAggreeVisible(false)} bodyStyle={{height: '80vh'}}>
        <AgreeModal id={currentProcessNode && currentProcessNode.id || ''} onClose={(e) => {
          setAggreeVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
      <Popup visible={rejectVisible} destroyOnClose={true} onMaskClick={() => setRejectVisible(false)} bodyStyle={{height: '80vh'}}>
        <RejectModal id={currentProcessNode && currentProcessNode.id || ''} onClose={(e) => {
          setRejectVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
      <Popup visible={submitVisible} destroyOnClose={true} onMaskClick={() => setSubmitVisible(false)} bodyStyle={{height: '80vh'}}>
        <SubmitModal id={currentProcessNode && currentProcessNode.id || ''} onClose={(e) => {
          setSubmitVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
      <Popup visible={transferVisible} destroyOnClose={true} onMaskClick={() => setTransferVisible(false)} bodyStyle={{height: '80vh'}}>
        <TransferModal currentProcessNode={currentProcessNode} onClose={(e) => {
          setTransferVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
      <Popup visible={appendVisible} destroyOnClose={true} onMaskClick={() => setAppendVisible(false)} bodyStyle={{height: '80vh'}}>
        <AppendModal id={currentProcessNode && currentProcessNode.id || ''} onClose={(e) => {
          setAppendVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
      <Popup visible={returnVisible} destroyOnClose={true} onMaskClick={() => setReturnVisible(false)} bodyStyle={{height: '80vh'}}>
        <ReturnMoal id={currentProcessNode && currentProcessNode.id || ''} processNodes={beforeNodes} onClose={(e) => {
          setReturnVisible(false);
          if (e === 'success') {
            freshProcess(true);
          }
        }}/>
      </Popup>
    </View>
  )
}