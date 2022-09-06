/**
 * 菜单管理
 */

import { View, Text, Image } from "@tarojs/components"
import Taro, { getCurrentInstance } from "@tarojs/taro"
import { message } from "antd";
import { ActionSheet, DotLoading, NavBar } from "antd-mobile"
import { Action } from "antd-mobile/es/components/action-sheet";
import { useEffect, useRef, useState } from "react";
import './index.scss';
import { uploadLogo } from "./service";

export default () => {
  const id = getCurrentInstance().router?.params.id;

  const [menus, setMenus] = useState<any>();
  const [itemValue, setItemValue] = useState<any>();

  const getMenu = () => {
    const allMenus = Taro.getStorageSync('allmenus');
    if (allMenus) {
      setMenus(allMenus.find((item) => item.id === id));
    }
  }

  useEffect(() => {
    getMenu();
  }, []);

  const caneraRef = useRef<any>();

  const [loading, setLoading] = useState(false);

  const handlePhoto = async (event) => {
    const files = [...event.target.files];
    if (files.length === 0) return;
    await setLoading(true);
    files.map((file => {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
        formData.append('id', itemValue.id);
        uploadLogo(formData).then((res) => {
          if (res.code === 200 && res.data) {
            message.success(itemValue.name + '图标已更新');
            const data = res.data;
            setMenus({
              ...menus,
              children: menus.children.map((item) => item.id === data.id ? {...item, logo_url: data.logo_url} : {...item})
            });
            setLoading(false);
            setItemValue(undefined);
          }
        });
      }
    }))
  }

  const actions: Action[] = [
    { text: <>
      <input
        type={'file'}
        ref={caneraRef}
        hidden
        accept={'.jpg,.jpeg,.png'}
        onChange={(event) => handlePhoto(event)}
      />
      <span>{loading ? '正在上传' : '上传图标'}{loading && <DotLoading />}</span>
    </>, key: 'camera' },
  ];

  return (
    <View className="management">
      <NavBar onBack={() => Taro.navigateBack()}>菜单管理</NavBar>
      <View className="management-content">
        {menus && (
          <View className="management-content-item">
            <Text className="management-content-item-name">{menus.name}</Text>
            <View className="management-content-item-children" >
              {menus.children.map((item) => {
                return (
                  <View className="management-content-item-children-app" onClick={() => setItemValue(item)} key={item.id}>
                    {item.logo_url ? (
                      <View className="management-content-item-children-app-icon">
                        <Image className="management-content-item-children-app-icon-image" mode='aspectFill' src={item.logo_url}/>
                      </View>
                    ) : (
                      <View className="management-content-item-children-app-icon">
                        <Text>{item.name[0]}</Text>
                      </View>
                    )}
                    <Text className="management-content-item-children-app-name webkit-hidden1">{item.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </View>
      <ActionSheet
        extra='请选择修改图标方式'
        cancelText='取消'
        visible={itemValue}
        actions={actions}
        onAction={({key}) => {
          if (key === 'camera') {
            if (!loading) {
              caneraRef && caneraRef.current.click();
            }
          }
        }}
        onClose={() => setItemValue(undefined)}
      />
    </View>
  )
}
