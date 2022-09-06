import { View, Text } from "@tarojs/components";
import { NavBar, TextArea } from "antd-mobile";
import {EnvironmentOutline} from 'antd-mobile-icons'
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import SigninMap from "src/components/SigninMap";
import './index.scss';

interface Props {
  data: any;
  onBack: () => void;
}

const Index = (props: Props) => {
  const {data, onBack} = props;
  const [address, setAddress] = useState<any>({
    formatted_address: '',
  });
  
  const [location, setLocation] = useState<Array<number>>([]);
  const [refMap, setRefMap] = useState<any>();

  // const [value, setValue] = useState('');

  useEffect(() => {
    if (data.Parent_Id) {
      setLocation([data.Parent_Id.Location_Longitude, data.Parent_Id.Location_Latitude]);
      setAddress({formatted_address: data.Parent_Id.Check_In_Address})
    }
  }, [])



  return (
    <View className="show-signin">
      <NavBar
        onBack={() => {
          onBack();
        }}
        >
        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Text>签到</Text>
          <Text style={{fontSize: '12px'}}>{data && dayjs(data.Created_Time).format('YYYY年MM月DD日 HH:mm')}</Text>
        </View>
      </NavBar>
      <View>
        <SigninMap setRefMap={setRefMap} refMap={refMap} location={location}/>
      </View>
      <View className="container">
        <View className="main-content">
          <View className="created-avatal">
            <Text>{data && data.Created_By.name[0]}</Text>
          </View>
          <View className="address-content">
            <Text className="address" onClick={() => {
              window.open(`http://uri.amap.com/marker?position=${location[0]},${location[1]}&name=${address.formatted_address}&coordinate=gaode&callnative=1`);
            }}><EnvironmentOutline className="icon"/>{address.formatted_address}</Text>
            <Text>{data && data.Created_By.name}</Text>
          </View>
        </View>
        {/* <TextArea
          value={value}
          disabled        
          className="text-area-field"
          autoSize={{ minRows: 2, maxRows: 5 }}
          onChange={(e) => setValue(e)}
        /> */}
      </View>
    </View>
  )
}

export default Index;
