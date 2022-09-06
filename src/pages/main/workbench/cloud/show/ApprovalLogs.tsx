import { View, Text } from "@tarojs/components"
import { useState } from "react";
import { DownOutline, UpOutline} from 'antd-mobile-icons';

interface Props {
  datas: Array<any>;
  onMove: (e: boolean) => void;
  info: any;
}

export default (props: Props) => {
  const {datas, onMove, info} = props;

  const [active, setActive] = useState(false);

  return (
    <View className="cloud-show-approvallog">
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} onClick={() => {
        setActive(!active);
      }}>
        <Text className="cloud-show-approvallog-title">审批日志</Text>
        {active ? <UpOutline /> : <DownOutline />}
      </View>
      {active &&
        <>
          <View className="cloud-show-approvallog-content">
            {datas.map((data, index) => {
              let color = 'blue';
              if (data.status === 'rejected') {
                color = 'red';
              } else if (data.status === 'passed' || data.status === 'submit') {
                color = 'green';
              }
              return (
                <View key={data.id} className="cloud-show-approvallog-content-item">
                  <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{background: color}} className="cloud-show-approvallog-content-item-icon" />
                    <View className="cloud-show-approvallog-content-item-line" style={{opacity: index + 1 === datas.length ? 0 : 1}} />
                  </View>
                  <View className="cloud-show-approvallog-content-item-text">
                    <View>
                      <Text className="cloud-show-approvallog-content-item-text-name">{data.username}</Text>
                      <Text>  {data.approval_at}&#12288;{getShowTime(data.deal_time)}</Text>
                    </View>
                    <Text>{data.status_str} {data.remark ? `(${data.remark})` : ''}</Text>
                  </View>
                </View>
              )
            })}
          </View>
          {info.total_pages > 1 && info.total_count !== datas.length && <Text className="cloud-show-approvallog-move" onClick={() => onMove(false)}>查看更多</Text>}
        </>
      }
    </View>
  )
}

const getShowTime = (time: number) => {
  if (!time) {
    return '';
  }

  let value;
  if (time / 60 < 1) {
    value = `（${time}秒）`;
  } else if (time / 3600 < 1) {
    value = `  （${Math.round(time / 60)}分钟）`;
  } else if (time / 86400 < 1) {
    value = `（${Math.round(time / 3600)}小时）`;
  } else {
    value = `（${Math.round(time / 86400)}天）`;
  }

  return value || '';
};
