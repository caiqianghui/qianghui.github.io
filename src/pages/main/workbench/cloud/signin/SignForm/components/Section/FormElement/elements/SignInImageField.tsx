import { View, Text } from "@tarojs/components"
import { message } from "antd";
import ImageUploader, { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactImage from "src/components/ReactImage";
import './style.scss';

interface Props {
  address: string;
  onChange?: (e: any) => void;
}

export default (props: Props) => {
  const {address, onChange} = props;
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [onChangeFileList, setOnChangeFileList] = useState<ImageUploadItem[]>([]);

  useEffect(() => {
    if (onChangeFileList.length) {
      onChange && onChange(onChangeFileList);
    }
  }, [onChangeFileList]);

  const mockUpload = async (file: File) => {
    return {
      url: URL.createObjectURL(file),
    }
  }

  return (
    <View className="field">
      <View className="signin-popup-camera-content">
        {fileList.map((image, index) => {
          return (
            <ReactImage
              className="signin-popup-camera-image"
              key={index}
              images={fileList.map((img) => (img.url))}
              url={image.url}
              index={index}
              onDelete={(e) => {
                setFileList(fileList.filter((file) => file.url !== e));
                const _fileList = onChangeFileList.filter((file) => file.url !== e);
                setOnChangeFileList(_fileList)
                onChange && onChange(_fileList);
              }}
            />
          )
        })}
        <ImageUploader
          style={{ '--cell-size': '90px' }}
          capture={true}
          value={fileList}
          upload={(file) => {
            console.log('上传原始图片', file);
            addWaterMark({
              imageUrl: file,
              address: address,
              success: (e: File) => {
                if (e) {
                  console.log('添加水印图片', e);
                  mockUpload(e).then((url) => {
                    setFileList(fileList.concat(url));
                    const _url = {
                      ...e,
                      ...url,
                      originFileObj: e,
                    }
                    const _fileList = onChangeFileList.concat(_url);
                    setOnChangeFileList(_fileList);
                    onChange && onChange(_fileList);
                  });
                }
              }
            });
            return mockUpload(file);
          }}
          className='signin-popup-camera-image'
        >
          <View className="cameras">
            <Text>拍照</Text>
          </View>
        </ImageUploader>
      </View>
    </View>
  );

}

/**
* canvas添加水印
* @param {参数obj} param 
* @param {文件二进制流} param.imageUrl 必传
* @param {水印地址} param.address 必传
* @param {回调函数} param.success 必传
*/
interface AddWaterMarkParam {
  imageUrl: File,
  address: any;
  success: (e) => void;
}

const addWaterMark = (param: AddWaterMarkParam) => {
  const {imageUrl, address, success} = param;
  const targetSize = 2 * 1024 * 1024;
  console.log('targetSize', targetSize);
  let canvas = document.createElement('canvas');
  if (canvas.getContext) {
    const context: any = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 2;
    context.scale(dpr, dpr);
    //  2M 除以总的大小 2M / size 
    changeFileToBaseURL(imageUrl, (base64) => {
      if (base64) {
        let image = new Image();
        image.src = base64;
        image.onload = function() {
          // 获得长宽比例
          let width = image.width;
          let height = image.height;
          if (imageUrl.size > targetSize) {
            console.log(targetSize / imageUrl.size);
            const ratio = Math.sqrt(targetSize / imageUrl.size) || 1;
            console.log(ratio);
            width =  ratio * width;
            height = ratio * height;
          }
          canvas.width = width;
          canvas.height = height;
          context.fill();
          context.drawImage(image, 0, 0, width, height); // 把视频中的一帧在canvas画布里面绘制出来
          context.fillStyle = '#ffffff'
          context.shadowColor = '#333';
          context.shadowBlur = 2;
          context.font = width / 20 + "px Arial";
          context.fillText(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), width / 20, height - width / 10);
          context.font = width / 30 + "px Arial";
          if (address) {
            const {addressComponent, formatted_address} = address;
            if (addressComponent) {
              const {country, province, city, district} = addressComponent;
              context.fillText(province + city + district, width / 20,  height - width / 16, width - width / 20);
              if (formatted_address.indexOf(district)) {
                const districtIndex = formatted_address.indexOf(district) + district.length
                context.fillText(formatted_address.substring(districtIndex, formatted_address.length), width / 20,  height - width / 40, width - width / 20);
              }
            }
          }
          let imgData = canvas.toDataURL('image/jpeg');
          
          if (imgData) {
            success(base64TOfile(imgData));
          }
        }
      }
    })
    // pressImg({
    //   file: param.imageUrl,
    //   targetSize: 2 * 1024 * 1024,
    //   quality: 0.5,
    //   width: 375,
    //   success: (resultFile: File) => {
    //     //如果不是null就是压缩成功
    //     if(resultFile){
    //     }
    //   }
    // });
  }
};

const base64TOfile = (base64) => {
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
  return filetest
}

/**
* canvas压缩图片
* @param {参数obj} param 
* @param {文件二进制流} param.file 必传
* @param {目标压缩大小} param.targetSize 不传初始赋值-1
* @param {输出图片宽度} param.width 不传初始赋值-1，等比缩放不用传高度
* @param {输出图片名称} param.fileName 不传初始赋值image
* @param {压缩图片程度} param.quality 不传初始赋值0.92。值范围0~1
* @param {回调函数} param.success 必传
*/
function pressImg(param){
  //如果没有回调函数就不执行
  if(param && param.success){
    //如果file没定义返回null
    if(param.file == undefined) return param.success(null);
    //给参数附初始值
    param.targetSize = param.hasOwnProperty("targetSize") ? param.targetSize : -1;
    param.width = param.hasOwnProperty("width") ? param.width : -1;
    param.fileName = param.hasOwnProperty("fileName") ? param.fileName: "image";
    param.quality = param.hasOwnProperty("quality") ? param.quality : 0.92;
    // 得到文件类型
    var fileType = param.file.type;
    //如果当前size比目标size小，直接输出
    var size = param.file.size;

    if(param.targetSize > size){
      return param.success(param.file);
    }
    // 读取file文件,得到的结果为base64位
    changeFileToBaseURL(param.file,function(base64){
      if(base64){
        var image = new Image();
        image.src = base64;
        image.onload = function(){
          // 获得长宽比例
          // console.log(image.width, image.height);
          const scale = image.width / image.height;
          //创建一个canvas
          const canvas = document.createElement('canvas');
          //获取上下文
          const context: any = canvas.getContext('2d');
          //获取压缩后的图片宽度,如果width为-1，默认原图宽度
          canvas.width = param.width == -1 ? image.width : param.width;
          //获取压缩后的图片高度,如果width为-1，默认原图高度
          canvas.height = param.width == -1 ? image.height : parseInt(param.width / scale + '');
          //把图片绘制到canvas上面
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          //压缩图片，获取到新的base64Url
          var newImageData = canvas.toDataURL(fileType, param.quality);
          //将base64转化成文件流
          var resultFile = dataURLtoFile(newImageData,param.fileName);
          //判断如果targetSize有限制且压缩后的图片大小比目标大小大，就弹出错误
          if(param.targetSize != -1 && param.targetSize < resultFile.size){
            // 超过比例，重新压缩 
            message.error('图片过大, 上传失败');
          }else{
            //返回文件流
            param.success(resultFile);
          }
        }
      }
    });
  }
}

/**
* @param {二进制文件流} file 
* @param {回调函数，返回base64} fn 
*/
function changeFileToBaseURL(file,fn){
  // 创建读取文件对象
  var fileReader = new FileReader();
  //如果file没定义返回null
  if(file == undefined) return fn(null);
  // 读取file文件,得到的结果为base64位
  fileReader.readAsDataURL(file);
  fileReader.onload = function(){
    // 把读取到的base64
    var imgBase64Data = this.result;
    fn(imgBase64Data);
  }
}

/**
 * 将base64转换为文件
 * @param {baseURL} dataurl 
 * @param {文件名称} filename 
 * @return {文件二进制流}
*/
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
