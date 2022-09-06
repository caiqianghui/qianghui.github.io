/*! For license information please see 81.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[81],{"129":function(t,i,n){"use strict";n.r(i),n.d(i,"taro_video_control",(function(){return h})),n.d(i,"taro_video_core",(function(){return g})),n.d(i,"taro_video_danmu",(function(){return p}));var u=n(31),c=n(177),__awaiter=function(t,i,n,u){function r(t){return t instanceof n?t:new n((function(i){i(t)}))}return new(n||(n=Promise))((function(n,c){function a(t){try{l(u.next(t))}catch(t){c(t)}}function s(t){try{l(u.throw(t))}catch(t){c(t)}}function l(t){t.done?n(t.value):r(t.value).then(a,s)}l((u=u.apply(t,i||[])).next())}))},__generator=function(t,i){var n,u,c,d,h={"label":0,"sent":function(){if(1&c[0])throw c[1];return c[1]},"trys":[],"ops":[]};return d={"next":s(0),"throw":s(1),"return":s(2)},"function"==typeof Symbol&&(d[Symbol.iterator]=function(){return this}),d;function s(t){return function(i){return l([t,i])}}function l(d){if(n)throw new TypeError("Generator is already executing.");for(;h;)try{if(n=1,u&&(c=2&d[0]?u.return:d[0]?u.throw||((c=u.return)&&c.call(u),0):u.next)&&!(c=c.call(u,d[1])).done)return c;switch(u=0,c&&(d=[2&d[0],c.value]),d[0]){case 0:case 1:c=d;break;case 4:return h.label++,{"value":d[1],"done":!1};case 5:h.label++,u=d[1],d=[0];continue;case 7:d=h.ops.pop(),h.trys.pop();continue;default:if(!(c=h.trys,(c=c.length>0&&c[c.length-1])||6!==d[0]&&2!==d[0])){h=0;continue}if(3===d[0]&&(!c||d[1]>c[0]&&d[1]<c[3])){h.label=d[1];break}if(6===d[0]&&h.label<c[1]){h.label=c[1],c=d;break}if(c&&h.label<c[2]){h.label=c[2],h.ops.push(d);break}c[2]&&h.ops.pop(),h.trys.pop();continue}d=i.call(t,h)}catch(t){d=[6,t],u=0}finally{n=c=0}if(5&d[0])throw d[1];return{"value":d[0]?d[1]:void 0,"done":!0}}},__spreadArray=function(t,i){for(var n=0,u=i.length,c=t.length;n<u;n++,c++)t[c]=i[n];return t},formatTime=function(t){if(null==t)return"";var i=Math.round(t%60),n=Math.round((t-i)/60);return(n<10?"0"+n:n)+":"+(i<10?"0"+i:i)},normalizeNumber=function(t){return Math.max(-1,Math.min(t,1))},d=function(){for(var t,i=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n=["webkitEnterFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],u=0,c=i.length,d={};u<c;u++)if((t=i[u])&&t[1]in document){for(u=0;u<t.length;u++)d[i[0][u]]=t[u];return d}if(!d[i[0][0]])for(u=0;u<n.length;u++)d[i[0][u]]=n[u];return d}(),h=function(){function e(t){var i=this;Object(u.g)(this,t),this.visible=!1,this.isDraggingProgressBall=!1,this.percentage=0,this.progressDimentions={"left":0,"width":0},this.calcPercentage=function(t){var n=t-i.progressDimentions.left;return n=Math.max(n,0),(n=Math.min(n,i.progressDimentions.width))/i.progressDimentions.width},this.onDragProgressBallStart=function(){i.isDraggingProgressBall=!0,i.hideControlsTimer&&clearTimeout(i.hideControlsTimer)},this.onClickProgress=function(t){t.stopPropagation();var n=i.calcPercentage(t.pageX);i.seekFunc(n*i.duration),i.toggleVisibility(!0)}}return e.prototype.onDocumentTouchMove=function(t){if(this.isDraggingProgressBall){var i=t.touches[0].pageX;this.percentage=this.calcPercentage(i),this.setProgressBall(this.percentage),this.setCurrentTime(this.percentage*this.duration)}},e.prototype.onDocumentTouchEnd=function(){this.isDraggingProgressBall&&(this.isDraggingProgressBall=!1,this.seekFunc(this.percentage*this.duration),this.toggleVisibility(!0))},e.prototype.setProgressBall=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(i){return this.progressBallRef&&(this.progressBallRef.style.left=100*t+"%"),[2]}))}))},e.prototype.toggleVisibility=function(t){return __awaiter(this,void 0,void 0,(function(){var i,n=this;return __generator(this,(function(u){return(i=void 0===t?!this.visible:t)?(this.hideControlsTimer&&clearTimeout(this.hideControlsTimer),this.isPlaying&&(this.hideControlsTimer=setTimeout((function(){n.toggleVisibility(!1)}),2e3)),this.controlsRef.style.visibility="visible"):this.controlsRef.style.visibility="hidden",this.visible=!!i,[2]}))}))},e.prototype.getIsDraggingProgressBall=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return[2,this.isDraggingProgressBall]}))}))},e.prototype.setCurrentTime=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(i){return this.currentTimeRef.innerHTML=formatTime(t),[2]}))}))},e.prototype.render=function(){var t,i=this,n=this,c=n.controls,d=n.currentTime,h=n.duration,g=n.isPlaying,p=n.pauseFunc,A=n.playFunc,b=n.showPlayBtn,f=n.showProgress,m=formatTime(h);return t=b?g?Object(u.e)("div",{"class":"taro-video-control-button taro-video-control-button-pause","onClick":p}):Object(u.e)("div",{"class":"taro-video-control-button taro-video-control-button-play","onClick":A}):null,Object(u.e)(u.a,{"class":"taro-video-bar taro-video-bar-full"},c&&Object(u.e)("div",{"class":"taro-video-controls"},t,f&&Object(u.e)("div",{"class":"taro-video-current-time","ref":function(t){return i.currentTimeRef=t}},formatTime(d)),f&&Object(u.e)("div",{"class":"taro-video-progress-container","onClick":this.onClickProgress},Object(u.e)("div",{"class":"taro-video-progress","ref":function(t){if(t){var n=t.getBoundingClientRect();i.progressDimentions.left=n.left,i.progressDimentions.width=n.width}}},Object(u.e)("div",{"class":"taro-video-progress-buffered","style":{"width":"100%"}}),Object(u.e)("div",{"class":"taro-video-ball","ref":function(t){return i.progressBallRef=t},"onTouchStart":this.onDragProgressBallStart,"style":{"left":(m?this.currentTime/h*100:0)+"%"}},Object(u.e)("div",{"class":"taro-video-inner"})))),f&&Object(u.e)("div",{"class":"taro-video-duration"},m)),Object(u.e)("slot",null))},Object.defineProperty(e.prototype,"controlsRef",{"get":function(){return Object(u.d)(this)},"enumerable":!1,"configurable":!0}),e}(),g=function(){function e(t){var i=this;Object(u.g)(this,t),this.onPlay=Object(u.c)(this,"play",7),this.onPause=Object(u.c)(this,"pause",7),this.onEnded=Object(u.c)(this,"ended",7),this.onTimeUpdate=Object(u.c)(this,"timeupdate",7),this.onError=Object(u.c)(this,"error",7),this.onFullScreenChange=Object(u.c)(this,"fullscreenchange",7),this.onProgress=Object(u.c)(this,"progress",7),this.onLoadedMetaData=Object(u.c)(this,"loadedmetadata",7),this.currentTime=0,this.isDraggingProgress=!1,this.gestureType="none",this.controls=!0,this.autoplay=!1,this.loop=!1,this.muted=!1,this.initialTime=0,this.objectFit="contain",this.showProgress=!0,this.showFullscreenBtn=!0,this.showPlayBtn=!0,this.showCenterPlayBtn=!0,this.showMuteBtn=!1,this.danmuBtn=!1,this.enableDanmu=!1,this.enablePlayGesture=!1,this.enableProgressGesture=!0,this.vslideGesture=!1,this.vslideGestureInFullscreen=!0,this.nativeProps={},this._enableDanmu=!1,this.isPlaying=!1,this.isFirst=!0,this.isFullScreen=!1,this.fullScreenTimestamp=(new Date).getTime(),this.isMute=!1,this.analyseGesture=function(t){var n,u={"type":"none"},c=t.touches[0].screenX,d=t.touches[0].screenY,h=c-i.lastTouchScreenX,g=d-i.lastTouchScreenY,p=i.isFullScreen?i.vslideGestureInFullscreen:i.vslideGesture;if("none"===i.gestureType){if(function(t,i){return Math.sqrt(Math.pow(t,2)+Math.pow(i,2))}(h,g)<10)return u;if(Math.abs(g)>=Math.abs(h)){if(!p)return u;i.gestureType="adjustVolume",i.lastVolume=i.videoRef.volume}else if(Math.abs(g)<Math.abs(h)){if(!i.enableProgressGesture)return u;i.gestureType="adjustProgress",i.lastPercentage=i.currentTime/(null!==(n=i.duration)&&void 0!==n?n:i._duration)}}return u.type=i.gestureType,u.dataX=normalizeNumber(h/200),u.dataY=normalizeNumber(g/200),u},this.handlePlay=function(){i.isPlaying=!0,i.isFirst=!1,i.controlsRef.toggleVisibility(!0),i.onPlay.emit()},this.handlePause=function(){i.isPlaying=!1,i.controlsRef.toggleVisibility(!0),i.onPause.emit()},this.handleEnded=function(){i.isFirst=!0,i.pause(),i.controlsRef.toggleVisibility(),i.onEnded.emit()},this.handleTimeUpdate=function(t,i){var n=0;return function(){var u=Date.now();u-n>i&&(t.apply(this,arguments),n=u)}}((function(t){return __awaiter(i,void 0,void 0,(function(){var i,n,u,c;return __generator(this,(function(d){switch(d.label){case 0:return this.currentTime=this.videoRef.currentTime,u=this.duration||this._duration,[4,this.controlsRef.getIsDraggingProgressBall()];case 1:return c=d.sent(),this.controls&&this.showProgress&&(c||this.isDraggingProgress||(this.controlsRef.setProgressBall(this.currentTime/u),this.controlsRef.setCurrentTime(this.currentTime))),this.danmuRef.tick(this.currentTime),this.onTimeUpdate.emit({"duration":null===(i=t.target)||void 0===i?void 0:i.duration,"currentTime":null===(n=t.target)||void 0===n?void 0:n.currentTime}),this.duration&&this.currentTime>=this.duration&&(this.seek(0),this.handleEnded()),[2]}}))}))}),250),this.handleError=function(t){var n,u;i.onError.emit({"errMsg":null===(u=null===(n=t.target)||void 0===n?void 0:n.error)||void 0===u?void 0:u.message})},this.handleDurationChange=function(){i._duration=i.videoRef.duration},this.handleProgress=function(){i.onProgress.emit()},this.handleLoadedMetaData=function(t){var n=t.target;i.onLoadedMetaData.emit({"width":n.videoWidth,"height":n.videoHeight,"duration":n.duration})},this._play=function(){return i.videoRef.play()},this._pause=function(){return i.videoRef.pause()},this._stop=function(){i.videoRef.pause(),i._seek(0)},this._seek=function(t){i.videoRef.currentTime=t},this.onTouchStartContainer=function(t){i.lastTouchScreenX=t.touches[0].screenX,i.lastTouchScreenY=t.touches[0].screenY},this.onClickContainer=function(){if(i.enablePlayGesture){var t=Date.now();t-i.lastClickedTime<300&&(i.isPlaying?i.pause():i.play()),i.lastClickedTime=t}i.controlsRef.toggleVisibility()},this.onClickFullScreenBtn=function(t){t.stopPropagation(),i.toggleFullScreen()},this.handleFullScreenChange=function(t){var n=(new Date).getTime();!t.detail&&i.isFullScreen&&!document[d.fullscreenElement]&&n-i.fullScreenTimestamp>100&&i.toggleFullScreen(!1)},this.toggleFullScreen=function(t){void 0===t&&(t=!i.isFullScreen),i.isFullScreen=t,i.controlsRef.toggleVisibility(!0),i.fullScreenTimestamp=(new Date).getTime(),i.onFullScreenChange.emit({"fullScreen":i.isFullScreen,"direction":"vertical"}),i.isFullScreen&&!document[d.fullscreenElement]&&setTimeout((function(){i.videoRef[d.requestFullscreen]({"navigationUI":"show"})}),0)},this.toggleMute=function(t){t.stopPropagation(),i.videoRef.muted=!i.isMute,i.controlsRef.toggleVisibility(!0),i.isMute=!i.isMute},this.toggleDanmu=function(t){t.stopPropagation(),i.controlsRef.toggleVisibility(!0),i._enableDanmu=!i._enableDanmu}}return e.prototype.componentWillLoad=function(){this._enableDanmu=this.enableDanmu},e.prototype.componentDidLoad=function(){this.initialTime&&(this.videoRef.currentTime=this.initialTime),this.danmuRef.sendDanmu(this.danmuList),document.addEventListener&&document.addEventListener(d.fullscreenchange,this.handleFullScreenChange)},e.prototype.componentDidRender=function(){},e.prototype.disconnectedCallback=function(){document.removeEventListener&&document.removeEventListener(d.fullscreenchange,this.handleFullScreenChange)},e.prototype.watchEnableDanmu=function(t){this._enableDanmu=t},e.prototype.onDocumentTouchMove=function(t){return __awaiter(this,void 0,void 0,(function(){var i,n,u;return __generator(this,(function(c){switch(c.label){case 0:return void 0===this.lastTouchScreenX||void 0===this.lastTouchScreenY?[2]:[4,this.controlsRef.getIsDraggingProgressBall()];case 1:return c.sent()||("adjustVolume"===(i=this.analyseGesture(t)).type?(this.toastVolumeRef.style.visibility="visible",n=Math.max(Math.min(this.lastVolume-i.dataY,1),0),this.videoRef.volume=n,this.toastVolumeBarRef.style.width=100*n+"%"):"adjustProgress"===i.type&&(this.isDraggingProgress=!0,this.nextPercentage=Math.max(Math.min(this.lastPercentage+i.dataX,1),0),this.controls&&this.showProgress&&(this.controlsRef.setProgressBall(this.nextPercentage),this.controlsRef.toggleVisibility(!0)),u=this.duration||this._duration,this.toastProgressTitleRef.innerHTML=formatTime(this.nextPercentage*u)+" / "+formatTime(u),this.toastProgressRef.style.visibility="visible")),[2]}}))}))},e.prototype.onDocumentTouchEnd=function(){var t;"adjustVolume"===this.gestureType?this.toastVolumeRef.style.visibility="hidden":"adjustProgress"===this.gestureType&&(this.toastProgressRef.style.visibility="hidden"),this.isDraggingProgress&&(this.isDraggingProgress=!1,this.seek(this.nextPercentage*(null!==(t=this.duration)&&void 0!==t?t:this._duration))),this.gestureType="none",this.lastTouchScreenX=void 0,this.lastTouchScreenY=void 0},e.prototype.play=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return this._play(),[2]}))}))},e.prototype.pause=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return this._pause(),[2]}))}))},e.prototype.stop=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return this._stop(),[2]}))}))},e.prototype.seek=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(i){return this._seek(t),[2]}))}))},e.prototype.requestFullScreen=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return this.toggleFullScreen(!0),[2]}))}))},e.prototype.exitFullScreen=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){return this.toggleFullScreen(!1),[2]}))}))},e.prototype.render=function(){var t=this,i=this,n=i.src,d=i.controls,h=i.autoplay,g=i.loop,p=i.muted,A=i.poster,b=i.objectFit,f=i.isFirst,m=i.isMute,v=i.isFullScreen,y=i.duration,w=i._duration,E=i.showCenterPlayBtn,k=i.isPlaying,x=i._enableDanmu,j=i.showMuteBtn,O=i.danmuBtn,T=i.showFullscreenBtn,I=i.nativeProps,B=formatTime(y||w||null);return Object(u.e)(u.a,{"class":Object(c.a)("taro-video-container",{"taro-video-type-fullscreen":v}),"onTouchStart":this.onTouchStartContainer,"onClick":this.onClickContainer},Object(u.e)("video",Object.assign({"class":"taro-video-video","style":{"object-fit":b},"ref":function(i){i&&(t.videoRef=i)},"src":n,"autoplay":h,"loop":g,"muted":p,"poster":d?A:void 0,"playsinline":!0,"webkit-playsinline":!0,"onPlay":this.handlePlay,"onPause":this.handlePause,"onEnded":this.handleEnded,"onTimeUpdate":this.handleTimeUpdate,"onError":this.handleError,"onDurationChange":this.handleDurationChange,"onProgress":this.handleProgress,"onLoadedMetaData":this.handleLoadedMetaData},I),"暂时不支持播放该视频"),Object(u.e)("taro-video-danmu",{"ref":function(i){i&&(t.danmuRef=i)},"enable":x}),f&&E&&!k&&Object(u.e)("div",{"class":"taro-video-cover"},Object(u.e)("div",{"class":"taro-video-cover-play-button","onClick":function(){return t.play()}}),Object(u.e)("p",{"class":"taro-video-cover-duration"},B)),Object(u.e)("taro-video-control",{"ref":function(i){i&&(t.controlsRef=i)},"controls":d,"currentTime":this.currentTime,"duration":this.duration||this._duration||void 0,"isPlaying":this.isPlaying,"pauseFunc":this._pause,"playFunc":this._play,"seekFunc":this._seek,"showPlayBtn":this.showPlayBtn,"showProgress":this.showProgress},j&&Object(u.e)("div",{"class":Object(c.a)("taro-video-mute",{"taro-video-type-mute":m}),"onClick":this.toggleMute}),O&&Object(u.e)("div",{"class":Object(c.a)("taro-video-danmu-button",{"taro-video-danmu-button-active":x}),"onClick":this.toggleDanmu},"弹幕"),T&&Object(u.e)("div",{"class":Object(c.a)("taro-video-fullscreen",{"taro-video-type-fullscreen":v}),"onClick":this.onClickFullScreenBtn})),Object(u.e)("div",{"class":"taro-video-toast taro-video-toast-volume","ref":function(i){i&&(t.toastVolumeRef=i)}},Object(u.e)("div",{"class":"taro-video-toast-title"},"音量"),Object(u.e)("div",{"class":"taro-video-toast-icon"}),Object(u.e)("div",{"class":"taro-video-toast-value"},Object(u.e)("div",{"class":"taro-video-toast-value-content","ref":function(i){i&&(t.toastVolumeBarRef=i)}},Object(u.e)("div",{"class":"taro-video-toast-volume-grids"},Array(10).fill(1).map((function(){return Object(u.e)("div",{"class":"taro-video-toast-volume-grids-item"})})))))),Object(u.e)("div",{"class":"taro-video-toast taro-video-toast-progress","ref":function(i){i&&(t.toastProgressRef=i)}},Object(u.e)("div",{"class":"taro-video-toast-title","ref":function(i){i&&(t.toastProgressTitleRef=i)}})))},Object.defineProperty(e.prototype,"el",{"get":function(){return Object(u.d)(this)},"enumerable":!1,"configurable":!0}),Object.defineProperty(e,"watchers",{"get":function(){return{"enableDanmu":["watchEnableDanmu"]}},"enumerable":!1,"configurable":!0}),e}();g.style='.taro-video{width:100%;height:225px;display:inline-block;line-height:0;overflow:hidden;position:relative}.taro-video[hidden]{display:none}.taro-video-container{width:100%;height:100%;background-color:#000;display:inline-block;position:absolute;top:0;left:0;overflow:hidden;-o-object-position:inherit;object-position:inherit}.taro-video-container.taro-video-type-fullscreen{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999}.taro-video-container.taro-video-type-fullscreen.taro-video-type-rotate-left{-webkit-transform:translate(-50%, -50%) rotate(-90deg);transform:translate(-50%, -50%) rotate(-90deg)}.taro-video-container.taro-video-type-fullscreen.taro-video-type-rotate-right{-webkit-transform:translate(-50%, -50%) rotate(90deg);transform:translate(-50%, -50%) rotate(90deg)}.taro-video-video{width:100%;height:100%;-o-object-position:inherit;object-position:inherit}.taro-video-cover{position:absolute;top:0;left:0;bottom:0;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;background-color:rgba(1, 1, 1, 0.5);z-index:1}.taro-video-cover-play-button{width:40px;height:40px;background-size:50%;background-repeat:no-repeat;background-position:50% 50%}.taro-video-cover-duration{color:#fff;font-size:16px;line-height:1;margin-top:10px}.taro-video-bar{visibility:hidden;height:44px;background-color:rgba(0, 0, 0, 0.5);overflow:hidden;position:absolute;bottom:0;right:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:0 10px;z-index:1}.taro-video-bar.taro-video-bar-full{left:0}.taro-video-controls{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;margin:0 8.5px}.taro-video-control-button{width:13px;height:15px;padding:14.5px 12.5px 14.5px 12.5px;margin-left:-8.5px;-webkit-box-sizing:content-box;box-sizing:content-box}.taro-video-control-button:after{content:"";display:block;width:100%;height:100%;background-size:100%;background-position:50% 50%;background-repeat:no-repeat}.taro-video-control-button.taro-video-control-button-play:after,.taro-video-cover-play-button{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAAWhJREFUSA1j+P///0cgBoHjQGzCQCsAtgJB/AMy5wCxGNXtQ9iBwvoA5BUCMQvVLEQxHpNzDSjkRhXLMM3GKrIeKKpEkYVYjcUu+AMo3ALE3GRZiN1MvKKPgbIRJFuG10j8koeA0gZEW4jfLIKyf4EqpgOxMEELCRpFnIJ3QGU5QMyM00LizCFa1SWgSkeslhFtBGkKVwGVy6FYSJp+klR/A6quB2JOkIWMIK0oNlOf8xBoZDE9LAI7nYn6HsBq4l96WHQEaLUpAyiOaASeAM2NgvuPBpaACt82IEYtfKls0UagecpwXyAzqGTRdaA57sjmYrAptAjUsCkGYlYMg9EFyLQI1IiZB8Ti6Obh5JNh0QmgHlOcBuKSIMGi50C18UDMiMssvOJEWPQLqKYbiHnxGkRIkoBF24DyaoTMIEoeh0W3geI+RBlArCI0iz4D+RVAzEasfqLVAQ19AcSg5LoYiKWI1kiiQgCMBLnEEcfDSgAAAABJRU5ErkJggg==)}.taro-video-control-button.taro-video-control-button-pause:after{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAgCAYAAAAffCjxAAAAAXNSR0IArs4c6QAAAFlJREFUSA3tksEKACAIQ7X//5zq98wOgQayum8QaGweHhMzG/6OujzKAymn+0LMqivu1XznWmX8/echTIyMyAgTwA72iIwwAexgj8gIE8CO3aMRbDPMaEy5BRGaKcZv8YxRAAAAAElFTkSuQmCC)}.taro-video-current-time,.taro-video-duration{height:14.5px;line-height:14.5px;margin-top:15px;margin-bottom:14.5px;font-size:12px;color:#cbcbcb}.taro-video-progress-container{-webkit-box-flex:2;-webkit-flex-grow:2;-ms-flex-positive:2;flex-grow:2;position:relative}.taro-video-progress{height:2px;margin:21px 12px;background-color:rgba(255, 255, 255, 0.4);position:relative}.taro-video-progress-buffered{position:absolute;left:0;top:0;width:0;height:100%;-webkit-transition:width 0.1s;transition:width 0.1s;background-color:rgba(255, 255, 255, 0.8)}.taro-video-ball{width:16px;height:16px;padding:14px;position:absolute;top:-21px;-webkit-box-sizing:content-box;box-sizing:content-box;left:0;margin-left:-22px}.taro-video-inner{width:100%;height:100%;background-color:#fff;border-radius:50%}.taro-video-danmu-button{white-space:nowrap;line-height:1;padding:2px 10px;border:1px solid #fff;border-radius:5px;font-size:13px;color:#fff;margin:0 8.5px}.taro-video-danmu-button.taro-video-danmu-button-active{border-color:#48c23d;color:#48c23d}.taro-video-fullscreen,.taro-video-mute{width:17px;height:17px;padding:8.5px;-webkit-box-sizing:content-box;box-sizing:content-box;background-size:50%;background-position:50% 50%;background-repeat:no-repeat}.taro-video-fullscreen{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAhUlEQVRYR+2WSwrAMAhEnZO3PfmULLooGEFTiIXJ2s/kRY2wzQeb85sE9CRA8jSzY1YfAFzhJBnU1AVgxH2dSiArCnD9QgGzRNnOech48SRABHoSyFb5in3PSbhyo6yvCPQkEM3u7BsPe/0FIvBfAh/vhKmVbO9SWun1qk/PSVi9TcVPBG6R1YIhgWwNpQAAAABJRU5ErkJggg==)}.taro-video-fullscreen.taro-video-type-fullscreen{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPUlEQVRYR+2Xu0pDURBF1/ZLxNcHKNiIlfhA7C0UBSEE8RNEBNFPUEQEEbGxFiSSSrCwEHsf5E/ccsSUuWfUhKQ40947+y42Z8+ZK/pcinzf9hhwD1xJ2q/qsb0JHAOzkl5y+lGAGnCWICQtZgAS6DxQk3TeLYA6cAo0JSXxjmW7CcwBdUkJurKiDhSA4kBvHbA9CqwBQx2O7BSw8ssU3ALPFRF4knT3nQLbr8B4LjLBOdAAFgJaLUkjbYC9n+zm+i4kXWbmwCqwnRMCHiXthuZAQOzPrxSA4kBxYDAcsH0EzATCfCLpJjOINoCtgFZabg7bk7AFDAeaGpKWgitZTu5N0kQbYBmYrujo9mX0CVxL+gidAdu9vY5zXhWA4sAgOND3X7NJ4AHYCaxkB8B62gslvecSFpoDOZH/PP8Cnt7hIaM5xCEAAAAASUVORK5CYII=)}.taro-video-mute{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDQtMTFUMTA6MTg6MjArMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA0LTExVDEwOjIyOjIyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTExVDEwOjIyOjIyKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk3YmE4Yjg0LTFhNTYtNGM1MS04NDVkLTNiZmYyMGI0ZDc0ZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjg1NGQ3MjlkLWUwNjctZjU0OC1hMTlhLTBlZjQ4OGRkYjJiOSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA1ODY3ZDFlLWQ3NGEtNDgyNC04MDU3LTYzYmRmMTdjODk5ZSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDU4NjdkMWUtZDc0YS00ODI0LTgwNTctNjNiZGYxN2M4OTllIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDEwOjE4OjIwKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTdiYThiODQtMWE1Ni00YzUxLTg0NWQtM2JmZjIwYjRkNzRmIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDEwOjIyOjIyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz459+FoAAABqElEQVRYhc2XPWsVQRSGnxPjF4oGRfxoRQKGWCU2Ft7CykrQWosEyf/If0hhIPgHDEmbNJZqCFxiQEgTUGxsBUVEHgvnyrjZZJO92V1fGIaZnTPvszPszNlQ6VIjnbr/DwCoDLMNak/dUVfUK0f2rQugnlcX/FevWgFQH6gf3autRgHUC+piiXHzAOmtPx9gXgug8itQx9SXwDpw47AGKXZWvXvQmNFCwE3gCXA2dY0Az4GrRzHONA9cU/vAbERsllEOyh31e8USV2mrMPdG9uyn+rDom2/BHHCm5puWKiKmgdtAnz+rvaxO5mNygEvHaZ5BfADuARvAaWBpP4DGFBHfgBngFzClTrUKkCDeA+9S837rAEnbqb7VFcCpVJ/oCmCw959aB1AfAROpudYqgDoOLKRmPyLelAF8bcD4pPoMeAtcB34AT4uDBqXXwFG8XXUU/72MIuK1OgE8Bs6l7mEvo8up7lN1Ge0n9aK6VHMFZvJTr9S3CiALaCQhqZOSvegMIAvu2UVSWpigLC1fbQ0gm6in7qpfLCQbhwGIYcyPQ53/G3YO8BtUtd35bvKcVwAAAABJRU5ErkJggg==)}.taro-video-mute.taro-video-type-mute{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDQtMTFUMTA6MTk6MDMrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA0LTExVDEwOjIyOjMzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTExVDEwOjIyOjMzKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAzYjJmNjE2LTZmZTUtNDJjNC1iNTgwLTczNzZjZjI2NzdmNSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjYzZjQ2NTYzLWE0ZjktOGQ0Mi1hM2FhLTY3ODJhNDBhYWNjMSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjIyYWNjMWFlLTg4ZmMtNDBlZi1iMWM1LTNmODgwY2QzYWI2MiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjJhY2MxYWUtODhmYy00MGVmLWIxYzUtM2Y4ODBjZDNhYjYyIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDEwOjE5OjAzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDNiMmY2MTYtNmZlNS00MmM0LWI1ODAtNzM3NmNmMjY3N2Y1IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDEwOjIyOjMzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5PmxYVAAACLklEQVRYhc2XP2sVQRRHz40hKoqaQgVBCy1EozFlGiVFxMLGh4piYWEh+hkEP4YKAVFEEFTyughaCH6DqIVpAhYWEgIxoJE8cywyi5tNHu/tJmvyg2WZO3dmzt47/zZUtoJ6Nhsg09YDiYhKDzACTAFNYH9lEpUq80TdrT5wpV5n/ZV9KoGoo+pXV2uyKkipOaLuUceAt8DhUvQd1FsCYhR4ChzaSIBMHSOi7lOfsByFWiCgEBH1GHAF2JlMPcBt4GC3HUYEaj9wF3gVEVPtfNVTwAXgWX7CDKq/1piAZTSZBmim8qJ6sQ3EgDqb/L7kU3MH2NHtl3dQX3r3Ak21UYAYAj4A/cl0JB+RF+uMRj4iQ+p8zt7KYFLdXKHuRi0gacBhV6a6pd5bA6KRNagFJPU9qv5u47toLmW1HnoR8Q5oAK1CVQu4FBHj/wUkaXsb+4pzpVaQFPqXrN7Be4Fx9VztIOr1BLEtmX4A94E/qdwHTKjDWYM6lu81dSlnn3V570BtuLxaMs2rZ/IgYxsBovaoPwsQA4VoFWEm8ql5DiysNyURsQTMpOIMcDYiPhd8xoGr/FtNC2G6FKXD6ihwGdiVHMoeeh8jYlA9ANwE3kTEp3bO6vE03qOONzR1r/q4RGrquaFFxFxE3ALOA9+6jExpdb180y55AhirhaRTatq0GXEzL8+ZIuI9cBJ4WKiartJf9nWV/mty7UfUafW7erpqRGI9EBuprffvu9n6C1KOmsqwI5A1AAAAAElFTkSuQmCC)}.taro-video-danmu{position:absolute;top:0;left:0;bottom:0;width:100%;margin-top:14px;margin-bottom:44px;font-size:14px;line-height:14px;overflow:visible}.taro-video-danmu-item{line-height:1;position:absolute;color:#fff;white-space:nowrap;left:100%;-webkit-transform:translatex(0);transform:translatex(0);-webkit-transition-property:left, -webkit-transform;transition-property:left, -webkit-transform;transition-property:left, transform;transition-property:left, transform, -webkit-transform;-webkit-transition-duration:3s;transition-duration:3s;-webkit-transition-timing-function:linear;transition-timing-function:linear}.taro-video-toast{pointer-events:none;position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);border-radius:5px;background-color:rgba(255, 255, 255, 0.8);color:#000;display:block;visibility:hidden}.taro-video-toast.taro-video-toast-volume{width:100px;height:100px;display:block}.taro-video-toast-volume .taro-video-toast-title{width:100%;font-size:12px;line-height:16px;text-align:center;margin-top:10px;display:block}.taro-video-toast-volume .taro-video-toast-icon{fill:#000;width:50%;height:50%;margin-left:25%;display:block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFhklEQVR4Xu2aeaxfQxTHP1VBES0NIQitWtpaaxeCUkQtaYVa0tiClAq1ExIiQTVppaWxt8RWSa2tWkJQRGgtQaSIpUKEpG0ssbbk28yV2+mZO/e9e3vvu/e98897mZnfzPl+75mZs0wvurn06ub46SGgxwLqZaA3sB/wO/A+8G/V6tS5BU4BJgJbO9DvAMOB36okoQ4CNgAeBEYbQK8Bbm4zAdsBc4EdAyA/APZoKwHHAA8DG2UA/AnYrG0ErAVcD1yXA9gfQJ8c40obsqbPgH7AY8CROTVuFQFD3X7fJid4DWsNAWOAGZ0w58YTsDZwKzChA189PbTRBGwKzAYO6iT4srbAMHfTfAksjulS1iG4JzAH2Dy2YKS/qAVcCdzi1vgZOBZ4PWvNGAG6wgYCW0IwctzNmf06BcEXtYABwOeA4otEfgEOdnGGqV6IAAUopwM6zDYuAVjeKYpYwCjgCWOhH513+b2lhE+Avrj89NPyalzyuCIE6EN9BfQ1dHoPOAD40+9LE6D/5aoqSqtLsgiQC60DTiHzfGCFoaSsQAexZdlTgEuyCDgLuK8u5G7dEAHyKN8CBrtxLwDHAX8Z+l4N3GS0L3db4aN0X5opmc+2XZQAfb2LPd2eciG1lUSRJZ9qYHkZONwiYAjwSc3gs24BXWWWfzEVuMjQez13HljX8v7A28lvEgsInaBVcxLaAvr6sgJLtBWeNTrOB+4w2p8DRvoEnAPcXTVaY70QAbrbXwIONX7zBSAL/tvrk1+iviTllnRry2irr/QSEws4D7izCxMg1XQLLAQGGXpeCkw22kOWI49RMUujCJC+uwAfGtfcImAng4AtAMsBeg04pIkESOfbgQsMsNoGnxrtSrfv7rXrSlwXWN6kLZBgEBiB8iWUUZZPIN/AF1nMoiYSICDfAlt5iB4CxhpAzwXuMtqPBuY1lYB5wFEeqFeAwwyguvIUqvuiQO/xphJwP3Cmhyh0EKrOoGDIF7n+M5pKwEwXrqdBCaQSM77Ig7SSIicDs5pKwIvACA+pzFwZIF9OlKm36QyQV7jEqDDJk5VD58uFgGIGX1Se+6yJFqAKsqI6X84GdDb4Mh0Y5zUqjFYFakUTCXja5QLSmBQHbAL8ahAgT1AeYVreSKLLphGwF/CuAfLJQLldGSTFD75c5d4mNCoWyAqG9gYWGED1AOMKo12ZbiWA/idA++deY2DVTZ0Jh5UJPsFQtD/wDaAHGWl5EzgwaUi2gK4UXS11S0cTIjrMFBtYQdAk4DID0BnAAz4B6wNLgTKKG0VIDBHwqitwpOcW+OOB540FdeipNKbUWFrUtn06o5xOij4KyDuqU0IE3Obl/rLA63pTzm9XA8jKACjdniZAaSKFmUpB1yUhAlTsUEpMh913wEkuTe7rKTzPAHqO44vpKPkFhH3cWWBVV6ogJVYZUgz/tXtIYelzI3Ct0fExIGx6j7iKWBUUveyYBehv1RIjIEsfqziq8Xp4pSBJOYTVJFQcVY3wCFeKUjVGyYfQWB00+5bEVBECrNS+qsOKBpVHNCVWHs+LS7H5PV5pOu9v0+OKEOAXR39w1e1C7wM6AkJ1eLmkRcrpRQiQrqobXO5S3vL3/4kBKMsCknV0k+iasVLUMV3UX5SAPGtED8EOT+L9YENnCasUIXNO2goChFWHqAIRyxXN4qI1BCQg9dJESYq8LnbrCBAR8t50Lig6i0krCRBoVWhVlt45wkBrCRBuRZyPuAguxIPe9lXqhpd9DcZMXOvdkPF0Xu/8dohNUmZ/1QQkuitXr+d4fryuFx3jywQYm6suAqSX8vLTXKJDt4QqO6rtLYspXWZ/nQQkOJTAUJZGIav19q9MvKvN1RUIWKMAY5P3EBBjqO393d4C/gMVHwRQlpx21QAAAABJRU5ErkJggg==);background-size:50%;background-position:50% 50%;background-repeat:no-repeat}.taro-video-toast-volume .taro-video-toast-value{width:80px;height:5px;margin-top:5px;margin-left:10px}.taro-video-toast-volume .taro-video-toast-value>.taro-video-toast-value-content{overflow:hidden}.taro-video-toast-volume-grids{width:80px;height:5px}.taro-video-toast-volume-grids-item{float:left;width:7.1px;height:5px;background-color:#000}.taro-video-toast-volume-grids-item:not(:first-child){margin-left:1px}.taro-video-toast.taro-video-toast-progress{background-color:rgba(0, 0, 0, 0.8);color:#fff;font-size:14px;line-height:18px;padding:6px}';var p=function(){function e(t){Object(u.g)(this,t),this.list=[],this.danmuElList=[],this.currentTime=0,this.enable=!1,this.danmuList=[]}return e.prototype.ensureProperties=function(t){var i=Object.assign({},t);return"time"in t||(i.time=this.currentTime),i.key=Math.random(),i.bottom=90*Math.random()+5+"%",i},e.prototype.sendDanmu=function(t){return void 0===t&&(t=[]),__awaiter(this,void 0,void 0,(function(){var i,n=this;return __generator(this,(function(u){return Array.isArray(t)?this.list=__spreadArray(__spreadArray([],this.list),t.map((function(t){return n.ensureProperties(t)}))):(i=t,this.list=__spreadArray(__spreadArray([],this.list),[Object.assign({},this.ensureProperties(i))])),[2]}))}))},e.prototype.tick=function(t){return __awaiter(this,void 0,void 0,(function(){var i,n,u;return __generator(this,(function(c){return this.currentTime=t,this.enable?(i=this.list,n=i.filter((function(i){var n=i.time;return t-n<4&&t>n})),!1,u=this.danmuList,(n.length!==u.length||n.some((function(t){var i=t.key;return u.every((function(t){return i!==t.key}))})))&&(this.danmuList=n),[2]):[2]}))}))},e.prototype.componentDidUpdate=function(){var t=this;requestAnimationFrame((function(){setTimeout((function(){t.danmuElList.splice(0).forEach((function(t){t.style.left="0",t.style.webkitTransform="translateX(-100%)",t.style.transform="translateX(-100%)"}))}))}))},e.prototype.render=function(){var t=this;return this.enable?Object(u.e)(u.a,{"class":"taro-video-danmu"},this.danmuList.map((function(i){var n=i.text,c=i.color,d=i.bottom,h=i.key;return Object(u.e)("p",{"class":"taro-video-danmu-item","key":h,"style":{"color":c,"bottom":d},"ref":function(i){i&&t.danmuElList.push(i)}},n)}))):""},e}()},"177":function(t,i,n){"use strict";n.d(i,"a",(function(){return u}));var u=function createCommonjsModule(t,i,n){return t(n={"path":i,"exports":{},"require":function(t,i){return function commonjsRequire(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}()}},n.exports),n.exports}((function(t){!function(){var i={}.hasOwnProperty;function o(){for(var t=[],n=0;n<arguments.length;n++){var u=arguments[n];if(u){var c=typeof u;if("string"===c||"number"===c)t.push(u);else if(Array.isArray(u)){if(u.length){var d=o.apply(null,u);d&&t.push(d)}}else if("object"===c)if(u.toString===Object.prototype.toString)for(var h in u)i.call(u,h)&&u[h]&&t.push(h);else t.push(u.toString())}}return t.join(" ")}t.exports?(o.default=o,t.exports=o):window.classNames=o}()}))}}]);