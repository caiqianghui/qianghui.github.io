import { View } from "@tarojs/components"
import { DotLoading, Skeleton } from "antd-mobile"

export default () => {
  return (
    <View style={{padding: '0 20px'}}>
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
      <div style={{ color: '#999999' }}>
        <DotLoading color='currentColor' />
        <span>加载中</span>
      </div>
    </View>
  )
}