import { View, Text, Image } from '@tarojs/components'
import './styles.scss';

interface Props {
  name?: string;
}

export default (props: Props) => {
  return (
    <View className='not-data '>
      <Image src={require('../assets/image/main/not_data.png')} />
      <Text style={{color: 'rgba(165, 204, 255)'}}>{props.name || '暂未开发'}</Text>
    </View>
  )
}