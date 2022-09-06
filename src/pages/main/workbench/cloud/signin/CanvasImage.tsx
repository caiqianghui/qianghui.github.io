import { View, Text } from '@tarojs/components';
import React from 'react';
import './index.scss';
 
interface Props{
  iamge: string;
  content: {
    time?: string;
    address?: string;
  }
  canvaswidth?: number;
  canvasheight?: number;
  onChange: (e: File | undefined) => void;
  onCancel: () => void;
}

interface State {
  base64url: string;
  image: File | undefined;
}

class photoSynthesis extends React.Component<Props, State> {
  canvasRef: any;
  constructor(props) {
    super(props);
    this.initCanvas = this.initCanvas.bind(this)
    this.canvasRef = React.createRef();
    this.state = {
      base64url: '',
      image: undefined,
    }
  }

  initCanvas() {
    const {iamge, content} = this.props;
    const that = this;
    let canvas = this.canvasRef.current;
    canvas.width = 375 * 3;
    canvas.height = 1600;
    let context = canvas.getContext("2d");
    var image = new Image();
    image.src = iamge;  //背景图片 你自己本地的图片或者在线图片
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
      // context.rect(0 , 0 , canvas.width , canvas.height);
      context.fill();
      context.font = "60px Courier New";
      context.drawImage(image , 0 , 0 ,canvas.width , canvas.height);
      context.font = "32px Courier New";
      context.fillText(`某某人  ${content.time}`, 20, canvas.height - 200);
      context.fillText(`${content.address}`, 20,  canvas.height - 100, canvas.width - 100);
      let imgData = canvas.toDataURL('png');
      const _fixType = function(type)  {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
      };
      
      imgData = imgData.replace(_fixType('png'), 'image/octet-stream');
      that.setState({
        image: that.base64TOfile(imgData),
        base64url: imgData,
      });
    }
  }


  base64TOfile(base64){
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]); // 解码base-64编码的数据
    let n = bstr.length; 
    let u8arr = new Uint8Array(n);// 无符号整型数组
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    let filename: any = new Date().getTime();
    let filetest = new File([u8arr], filename, {type:mime})
    console.log(filetest);
    return filetest
  }
 
  componentDidMount() {
    this.initCanvas()
  }
  componentDidUpdate() {
    // this.initCanvas()
  }
  
  render() {
    return (
      <View style={{ display:"flex",flexDirection:"column", padding: '0 20px'}}>
        <canvas ref={this.canvasRef}></canvas>
        <View className='canvas-btns'>
          <Text onClick={() => this.props.onCancel()} className='canvas-btn-cancer'>取消</Text>
          <Text onClick={() => this.props.onChange(this.state.image)} className='canvas-btn-change'>确定</Text>
        </View>
      </View>
    )
  }
}
 
export default photoSynthesis;