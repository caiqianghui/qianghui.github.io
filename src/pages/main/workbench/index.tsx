import { View, Text, Image } from '@tarojs/components'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import './index.scss'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { SoundOutline, RightOutline } from 'antd-mobile-icons'
import http from 'src/utils/http/cloud/http';
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';
import NetCloudFun from 'src/pages/services/functions';
import HttpClient from 'src/utils/http/cloud/HttpClient';
import { Button, DotLoading } from 'antd-mobile';

const {ltcMenu, ctoMenu} = iBodor

const Home = () => {
  const tokenId = getCurrentInstance().router?.params.tokenId || '';

  const [allMenu, setAllMenu] = useState<Array<any>>([ltcMenu]);

  const [isLogin, setIsLogin] = useState(false);

  const [loading, setLoading] = useState(false);

  const getMyMenus = (isAdmin = false) => {
    HttpClient.get('/api/v1/setting_manage/mobile_menus/my_menus',).then(((res) => {
      if (res.code === 200 && res.data) {
        let cloudMenus = res.data.datas.filter((data) => data.name === ctoMenu.name)
        .map((data) => (
          {...data, type: 'cloud', children: data.children.map((children) => ({...children, ...ctoMenu.children.find((item) => item.moduleName === children.pathname)}))})
        );
        if (!isAdmin) {
          cloudMenus = cloudMenus.map((data) => ({...data, children: data.children.filter((children) => !children.isAdmin)}))
        }
        setAllMenu([ltcMenu, ...cloudMenus]);
        Taro.setStorage({key: 'allmenus', data: [ltcMenu, ...cloudMenus]});
      }
    })).catch(() => {});
  }

  const getToken = () => {
    if (tokenId) {
      setLoading(true);
      Taro.setStorage({key: 'tokenId', data: tokenId});
      const token = 'NYbImmWjVdyN8Dh8PPq4XqVuKNCNWcp5dCDa8o2Xtyg';
      http.post('/api/v1/functions/single_sign_on/execute', {
        params: {
          token_id: tokenId,
        }
      },
      {headers: {Authorization: `Bearer ${token}`}}).then((res) => {
        if (res.data.code === 200 && res.data.data.result) {
          const data = res.data.data.result;
          // 存储登录信息
          Taro.setStorage({key: 'refresh_token', data: data.refresh_token});
          Taro.setStorage({key: 'access_token', data: data.access_token}).then(() => {
            // 获取当前zoho用户
            NetCloudFun.get('/crm/v2/users?type=CurrentUser').then((res: any) => {
              if (res.users) {
                Taro.setStorage({key: 'currentUser', data: res.users[0]});
              }
            });
            getUser();
          });
          Taro.setStorage({key: 'expires_in', data: data.created_at + data.expires_in});
          Taro.setStorage({key: 'zoho_access_token', data: data.zoho_access_token});
          Taro.setStorage({key: 'expiration_time', data: data.expiration_time});
          setLoading(false);
          setIsLogin(true);
        } else {
          setLoading(false);
        }
      }).catch(() => {
        setLoading(false);
      })
    }
  }

  const [isAdmin, setIsAdmin] = useState(false);

  // 获取当前登录cloud信息
  const getUser = () => {
    HttpClient.get('/api/v1/account/users/current_user').then((res) => {
      if (res.code=== 200 && res.data) {
        Taro.setStorage({key: 'cloudCurrentUser', data: res.data});
        if (res.data.is_admin || res.data.profile_id && res.data.profile_id.name === '管理员') {
          setIsAdmin(true);
          getMyMenus(true);
        } else {
          getMyMenus();
        }

      }
    }).catch((_err) => {
      // message.error(err.tips)
      // console.log(err);
    })
  }

  useEffect(() => {
    const oldTokenId = Taro.getStorageSync('tokenId');

    if (tokenId !== oldTokenId) {
      removeStorage();
    }

    if (tokenId) {
      getToken();
    } else {
      removeStorage();
    }
  }, [tokenId]);

  const removeStorage = () => {
    Taro.removeStorageSync('refresh_token');
    Taro.removeStorageSync('access_token');
    Taro.removeStorageSync('expires_in');
    Taro.removeStorageSync('zoho_access_token');
    Taro.removeStorageSync('expiration_time');
    Taro.removeStorageSync('currentUser');
    Taro.removeStorageSync('cloudCurrentUser');
    Taro.removeStorageSync('allmenus');
  }

  return (
    <View className='home-container'>
      {!loading && isLogin ? (
        <>
          <View className='home-sound-outline-top'>
            <View className='home-sound-outline'>
              <View className='home-sound-outline-left'>
                <SoundOutline />
                <Text>通知</Text>
              </View>
              <RightOutline />
            </View>
          </View>
          <View className='home-content'>
            {allMenu && allMenu.map((item) => {
              return (
                <View key={item.name} className='home-content-item'>
                  <View className='home-content-item-top'>
                    <Text className='home-content-item-top-name' onClick={() => {
                      // if (item.name === 'C T O') {
                      //   Taro.navigateTo({
                      //     url: 'pages/main/workbench/cloud/approval/index'
                      //   })
                      // }
                    }}>{item.name}</Text>
                    {item.type === 'cloud' && isAdmin && <Text onClick={() => {
                      Taro.navigateTo({
                        url: `pages/main/workbench/cloud/management/index?id=${item.id}`,
                      })
                    }}>管理</Text>}
                  </View>
                  {item.children.length ? (
                    <View className='home-content-item-children'>
                      {item.children.map((children: Module) => {
                        return (
                          <View className='home-content-item-children-app' key={children.name} onClick={() => {
                              Taro.navigateTo({
                                url: `pages/main/workbench/${children?.pathname}/index?module_name=${children.moduleName}`,
                              });
                          }}>
                            {children?.logo_url ? (
                                <View className='home-content-item-children-app-icon'>
                                  <Image mode='aspectFill' className='home-content-item-children-app-icon' src={children.logo_url}/>
                                </View>
                            ) : (
                              <View className='home-content-item-children-app-icon'>
                                <Text className='icon-name'>{children.name[0]}</Text>
                              </View>
                            )}
                            <Text className='home-content-item-children-app-name webkit-hidden1'>{children.name}</Text>
                          </View>
                        )
                      })}
                    </View>
                  ) : null}
                </View>
              )
            })}
          </View>
        </>
      ) : (
        <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
          {loading && !isLogin ? (
            <Text>正在加载<DotLoading /></Text>
          ) : (
            <Button onClick={getToken}>点击重试</Button>
          )}
        </View>
      )}
    </View>
  )
}

export default Home;
