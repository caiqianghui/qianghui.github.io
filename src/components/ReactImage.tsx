import { View } from '@tarojs/components';
import { ImageViewer, Image } from 'antd-mobile';
import {CloseCircleOutline} from 'antd-mobile-icons';
import { CSSProperties, useState } from 'react';

interface Props {
  images?: Array<string>;
  index: number;
  url: string;
  thumb_url?: string;
  style?: CSSProperties;
  className?: string;
  onDelete?: (e: string) => void;
}

export default (props: Props) => {
  const { thumb_url, url, style, className, onDelete} = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={{position: 'relative'}}>
        <Image
          className={className}
          style={style}
          fit='cover'
          lazy
          src={thumb_url || url}
          onClick={() => {
            setVisible(true);
          }}
        />
        {onDelete && <View className='image-delete-icon' onClick={() => onDelete(url)}><CloseCircleOutline fontSize={16}/></View>}
      </View>
      <ImageViewer
        image={url}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}