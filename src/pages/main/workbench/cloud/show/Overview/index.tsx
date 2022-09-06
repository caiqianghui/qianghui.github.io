/**
 * 审批
 */

import { Text, View } from "@tarojs/components"
import { useState } from "react";
import { Step, Steps } from "src/components/Steps";
import { Dialog } from "antd-mobile";
import { processResubmit, processRevoke } from "src/pages/services/model_process";
import { message } from "antd";
import _ from "lodash";
import { ProcessMoudle, ProcessNodeMoudle } from "..";

interface Props {
  moduleName: string,
  data: any,
  processes: ProcessMoudle | any,
  setProcesses: (e?: any) => void,
  fields: any,
  currentUser: any,
  freshProcess: (e: boolean) => void,
}

export default (props: Props) => {

  const [currentProcessNode, setCurrentProcessNode] = useState<ProcessNodeMoudle | null>();

  const {
    data,
    moduleName,
    processes,
    setProcesses,
    fields,
    currentUser,
    freshProcess
  } = props;

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

  // 撤回
  const revokeProcess = _.throttle(
    (id: string) => {
      Dialog.confirm({
        title: '确定撤回吗？',
        onConfirm: () => {
          processRevoke({process_id: id}).then((res) => {
            if (res.code === 200) {
              freshProcess(true);
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
            freshProcess(true);
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

  return processes ? (
    <>
      {/* {processes && isShowButton('resubmit', processes) && 
        <View
          onClick={() => reSubmitProcess(processes ? processes.id : '')}>
          <Text style={{display: 'block', textAlign: 'right', marginBottom: '10px', marginRight: '10px', color: '#5355e8'}}>重新提交</Text>
        </View>
      }
      {processes && isShowButton('revoke', processes) && 
        <View
          onClick={() => revokeProcess(processes ? processes.id : '')}>
          <Text style={{display: 'block', textAlign: 'right', marginBottom: '10px', marginRight: '10px', color: '#5355e8'}}>撤回</Text>
        </View>
      } */}
      <View className="cloud-show-overview">
        <Text className="cloud-show-overview-title">审批流程</Text>
        <View className="cloud-show-overview-content">
          <Steps>
            {processes.process_nodes.map((item, index, arr) => {
              return (
                <Step currentNum={index + 1} step={arr} status={item.status} key={item.id} title={<Node data={item}/>} />
              )
            })}
          </Steps>
        </View>
      </View>
    </>
  ) : <></>
}

interface NodeProps {
  data: ProcessNodeMoudle,
}

const Node = (props: NodeProps) => {
  
  const {data} = props;

  const [active, setActive] = useState(false);

  // 审批状态
  const statusStr = (process_node: ProcessNodeMoudle) => {
    switch (process_node.status) {
      // 待审批
      case 'wait_audit':
        return "待审批";
      // 已审批
      case 'passed':
        return '已审批';
      // 驳回
      case 'rejected':
        return '驳回';
      // 审批中
      case 'aduiting':
        return '审批中';
      // 审批暂停
      case 'pause':
        return `审批暂停 ${process_node?.approval_node?.other_setting?.approval_pause_tip &&
          ` (${process_node?.approval_node?.other_setting?.approval_pause_tip})`}`;
      default:
        return null;
    }
  };

  // 多人审批头像颜色
  const getAvatarColor = (process_node: ProcessNodeMoudle, user_id: string) => {
    let color = '#ccc';

    if (process_node.multiapprover_type === 'by_order') {
      const currentApproverId = process_node.current_approver_ids[0];
      if (
        process_node.current_approver_ids.length === 0 ||
        process_node.approver_ids.indexOf(user_id) <
          process_node.approver_ids.indexOf(currentApproverId)
      ) {
        color = '#87d068';
      }
    } else if (process_node.current_approver_ids.indexOf(user_id) === -1) {
      color = '#87d068';
    }

    return color;
  };

  // 审批提示
  const getApprovalStatusTooltip = (process_node: ProcessNodeMoudle) => {
    let content = '';
    if (process_node.approvers.length > 1) {
      if (process_node.multiapprover_type === 'all_sign') {
        content += '多人审批方式: 会签（需所有审批人同意)';
      } else if (process_node.multiapprover_type === 'any_sign') {
        content += '多人审批方式: 或签（一名审批人同意即可）';
      } else if (process_node.multiapprover_type === 'by_order') {
        content += '多人审批方式: 依次审批（按顺序依次审批）';
      }
    } else if (
      process_node.status === 'passed' ||
      process_node.status === 'rejected'
    ) {
      content += process_node.updated_at;
    }

    return content !== '' ? content : null;
  };

  const Tooltip =
    getApprovalStatusTooltip(data) ? (
      <Text style={{marginRight: '10px'}}>
        {getApprovalStatusTooltip(data)}
      </Text>
    ) : null;

  return (
    <View className="cloud-show-overview-content-item">
      <View className="cloud-show-overview-content-item-head">
        <Text className="cloud-show-overview-content-item-head-title">{data.approval_node.label}</Text>
        {data.approvers.map((user) => {
          return (
            <View key={user.id} className="cloud-show-overview-content-item-content-user">
              {/* <View className="cloud-show-overview-content-item-content-user-avatar" style={{backgroundColor: getAvatarColor(data, user.id)}}>
                <Text className="cloud-show-overview-content-item-content-user-avatar-name">{user.name[0]}</Text>
              </View> */}
              <Text className="cloud-show-overview-content-item-content-name">{user.name}</Text>
            </View>
          )
        })}
        {/* {active ? <UpOutline /> : <DownOutline />} */}
      </View>
      <Text className="cloud-show-overview-content-item-status">{data.approver_ids.length > 1 ? data.approver_ids.length + '人依次审批' : ''}</Text>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        {statusStr(data)}{Tooltip}
      </View>
      {data.remark &&
        <View style={{display: data.remark ? 'block' : 'none'}} className="cloud-show-overview-content-item-remark">
          <Text>备注：{data.remark}</Text>
        </View>
      }
    </View>
  )
}