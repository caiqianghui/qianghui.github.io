export default class CanvasImg {

  static initCanvas(iamge, content) {
    return new Promise((resolve) => {
      let canvas = document.createElement('canvas');
      canvas.width = 375 * 3;
      canvas.height = 1600;
      let context: any = canvas.getContext("2d");
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
        canvas.remove();
        return resolve (base64TOfile(imgData));
      }
    })
  }

}

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
  console.log(filetest);
  return filetest
}