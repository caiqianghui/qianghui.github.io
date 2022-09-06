import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, NavBar } from "antd-mobile";
import React from "react";
import {LeftOutline} from 'antd-mobile-icons'

interface Props {
  
}

interface State {

}

export default class Index extends React.Component<Props, State>{

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <View style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <NavBar
          backArrow={<LeftOutline color="#FFF"/>}
          style={{background: '#4a93ed'}}
          onBack={() => {
            Taro.navigateBack();  
          }}
          >
          <Text style={{color: '#FFF'}} className='webkit-hidden1'>竞品价格反馈</Text>
        </NavBar>
        <View style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', padding: '40px'}}>
          <Button block style={{marginBottom: '20px'}} onClick={() => {
            Taro.navigateTo({url: `pages/main/workbench/zoho/form/index?module_name=CompetitionInformationFeedback`});
          }}>创建</Button>
          <Button block style={{backgroundColor: '#4a93ed', color: '#FFF'}} onClick={() => {
            Taro.navigateTo({url: `pages/main/workbench/zoho/list/index?module_name=CompetitionInformationFeedback`});
          }}>查看</Button>
        </View>
      </View>
    )
  }
}