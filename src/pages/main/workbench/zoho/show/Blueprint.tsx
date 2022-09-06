/**
 * 线索蓝图
 */
import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import { DownFill, LikeOutline } from 'antd-mobile-icons'
import classname from 'classnames';

import './index.scss';
import { JumboTabs, Popup } from "antd-mobile";
import DealsStage from "./DealsStage";
import { message } from "antd";

interface Props {
  active: string;
  data: any;
  refresh: () => void;
}

export default (props: Props) => {
  const {data, refresh} = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const lists = [
    {label: '资质审查', icon: null, key: '', fields: ['Account_Budget'], color: '#e972fd'},
    {label: '需求分析', icon: null, key: '', fields: ['Account_Budget', 'Processing_Demand'], color: '#4137be'},
    {label: '决策体系', icon: null, key: '', fields: ['Decision_Maker', 'Decision_Process', 'Decision_Time'], color: '#fea36a'},
    {label: '合约过程', icon: null, key: '', fields: ['Contract_Time'], color: '#999999'},
    {label: '赢单关闭', icon: <LikeOutline />, key: '', fields: ['Amount', 'Closing_Date', 'Stage', 'Account_Budget', 'Processing_Demand', 'Decision_Maker', 'Decision_Process', 'Decision_Time', 'Signature_Time'], color: '#25b52a'},
    {label: '丢单关闭', icon: <LikeOutline className="icon-down"/>, key: '', fields: ['Amount', 'Closing_Date', 'Stage', '丢单原因'], color: '#eb4d4d'},
    {label: '客户计划变更', icon: <LikeOutline className="icon-down"/>, key: '', fields: ['Amount', 'Closing_Date', 'Stage', '丢单原因', 'Planned_Change_Time'], color: '#e972fd'},
  ];

  useEffect(() => {
    lists.forEach((list, index) => {
      if (list.label === props.active) {
        setActiveIndex(index);
      }
    });
  }, [props]);

  useEffect(() => {
    setTimeout(() => {
      onChangeBluePrint(activeIndex);
    });
  }, [activeIndex]);

  const onChangeBluePrint = (index: number) => {

    const length = lists.length;
    let scrollIndex = activeIndex > index ? index - 1 : index + 1;

    if (scrollIndex > length - 1) {
      scrollIndex = length -1;
    }
    if (scrollIndex < 0) {
      scrollIndex = 0;
    }

    const element = document.getElementsByClassName('blueprint-content-list-item')[scrollIndex];
    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  const [info, setInfo] = useState<any>();
  const [showDealsStage, setShowDealsStage] = useState(false);
  const [destroyOnClose, setDestroyOnClose] = useState(false);

  return (
    <View className="blueprint-content">
      <View className="blueprint-content-list">
        {lists.map((list, index) => {
          const clsName = classname({
            'blueprint-content-list-item': true,
            active: activeIndex === index,
            'before-none': index + 1 === lists.length
          });
          return (
            <View
              onClick={() => {
                const currentList = lists.find((item) => item.label === props.active);
                console.log(currentList);
                if (currentList) {
                  const currentIndex = lists.indexOf(currentList);
                  if (props.active.indexOf('关闭') !== -1) {
                    message.warn('阶段已关闭');
                  } else {
                    if (index > currentIndex || currentIndex === lists.length -1) {
                      setInfo({...list, index});
                      setShowDealsStage(true);
                    }
                  }
                }
              }}
              key={index}
              style={activeIndex === index ? {background: list.color} : {}}
              className={clsName}
            >
              {list.icon}
              <Text>{list.label}</Text>
              {activeIndex === index ? (
                <DownFill style={{marginLeft: 4}} fontSize={12} />
              ) : null}
            </View>
          )
        })}
      </View>
      <Popup visible={showDealsStage} onMaskClick={() => setShowDealsStage(false)} destroyOnClose={destroyOnClose} bodyStyle={{height: '80vh'}}>
        <DealsStage data={data} info={info} onSave={(e) => {
          setShowDealsStage(false);
          if (e === 'success') {
            setActiveIndex(info.index);
            setDestroyOnClose(true);
            refresh();
          }
        }}/>
      </Popup>
    </View>
  )
}