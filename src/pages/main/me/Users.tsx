import { View, Text, Image } from "@tarojs/components";
import dayjs from "dayjs";

interface Props {
  user: any;
}

export default (props: Props) => {
  const {user} = props;
  return (
    <View className="user">
      <Text className="user-title">基本信息</Text>
       <View className="user-content">
        <View className="user-content-head">
          <View className="user-content-head-avatar">
            <Image className="user-content-head-avatar-image" src={`https://contacts.zoho.com.cn/file?fs=thumb&ID=${user.zuid}`}/>
          </View>
          <View className="user-content-head-right">
            <Text className="user-content-head-right-name">{user.first_name}</Text>
            <Text>{user.territories[0]?.name}</Text>
            <Text>{user.email}</Text>
          </View>
        </View>
        <View className="user-content-main">
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">名字</Text>
            <Text className="user-content-main-item-content">{user.first_name}</Text>
          </View>
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">电子邮件</Text>
            <Text className="user-content-main-item-content">{user.email}</Text>
          </View>
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">职位</Text>
            <Text className="user-content-main-item-content">{user.role.name}</Text>
          </View>
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">角色</Text>
            <Text className="user-content-main-item-content">{user.profile?.name === 'Administrator' ? '管理员' : user.profile?.name}</Text>
          </View>
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">添加人</Text>
            <Text className="user-content-main-item-content">{user.created_by?.name}{dayjs(user.created_time).format('   YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View className="user-content-main-item">
            <Text className="user-content-main-item-title">电话</Text>
            <Text className="user-content-main-item-content">{user.phone}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}