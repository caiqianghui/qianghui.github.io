/**
 * 附件
 */
import { View, Text } from "@tarojs/components"
import { NavBar, Popup, Image, SwipeAction, Popover } from "antd-mobile";
import {AddOutline} from 'antd-mobile-icons'

import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";

interface Props {
  module: string;
  zoho_id: string;
  list: any;
}

export default (props: Props) => {
  const [signinData, setSigninData] = useState();
  const [attachments, setAttachments] = useState<any>();

  const {module, zoho_id, list} = props;

 // 附件列表
 const getAttachments = () => {
  if (module && zoho_id) {
    if (module && zoho_id) {
      NetCloudFun.get(`/crm/v2/${module}/${zoho_id}/Attachments`).then((res) => {
        console.log(res);
        if (res.data) {
          console.log(res.data);
          setAttachments(res.data);
        }
      }).catch((err) => {
        console.log('err)', err);
      });
    }
  }
}

  useEffect(() => {
    getAttachments();
  }, []);

  const actions = [
    { key: 'camera', text: '拍摄照片' },
    { key: 'photo', text: '从图库选择' },
    { key: 'file', text: '从文件附加' },
  ]

  return (
    <View  className="association-content">
      <View className='association-item'>
        <Text>{list.title}</Text>
        <Popover.Menu
          actions={actions}
          onAction={node => {}}
          placement='bottom-start'
          trigger='click'
        >
          <AddOutline />
        </Popover.Menu>
      </View>
      <>
        <View className='note-content'>
          {(attachments || []).map((item) => {
            return (
              <View className='note-item' onClick={() => {
                setSigninData(item);
                console.log(item);
              }}>
                {/* <Image src=/> */}
                <View className='note-item-avatar'>
                  <Text>{item.Created_By.name[0]}</Text>
                </View>
                <View className='note-item-text-content'>
                  <Text className='note-item-title'>{item.File_Name}</Text>
                  <Text className='note-item-name'>{item.Modified_By.name}</Text>
                </View>
              </View>
            )
          })}
          <Popup
            visible={signinData}
            onMaskClick={() => {
              setSigninData(undefined);
            }}
            bodyStyle={{ height: '90vh' }}
          >
            <Attachment {...props} data={signinData} onBack={() => setSigninData(undefined)}/>
          </Popup>
        </View>
      </>
    </View>
  )
}

interface AttachmentProps {
  data: any;
  onBack: (e?: string) => void;
  module: string;
  zoho_id: string;
}

const Attachment = (props: AttachmentProps) => {
  const {onBack, module, zoho_id} = props;

  const onDown = () => {
    NetCloudFun.get(`/crm/v2/${module}/${zoho_id}/photo`).then((res) => {
      console.log(res);
      
      // if (res.data) {
      //   message.success('添加成功');
      //   onBack('success');
      // } else {
      //   message.error('添加失败-请重试');
      // }
    })
  }


  return (
    <View className="attachment-content">
      <NavBar onBack={() => {
        onBack();
      }} right={<Text className={ 'attachment-content-save'} onClick={onDown}>下载</Text>} />
      <Image />
    </View>
  )
}