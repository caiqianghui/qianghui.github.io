import React, { useState, useEffect, Suspense } from 'react';

export default (props: any) => {
  const [Element, setElement] = useState<any>();
  const {field} = props;
  const {data_type} = field;
  useEffect(() => {
    const element = React.lazy(() => {
      if (data_type === 'textarea') {
        // 多行
        return import(`./elements/TextAreaField`);
      } else if (data_type === 'email') {
        // 电子邮件
        return import(`./elements/TextEmail`);
      } else if (data_type === 'phone') {
        // 电话
        return import(`./elements/TextPhone`);
      } else if (data_type === 'picklist') {
        // 选择列表
        return import(`./elements/Picklist`);
      } else if (data_type === 'multiselectpicklist') {
        // 多选列表
        return import(`./elements/Multiselectpicklist`);
      } else if (data_type === 'date') {
        // 日期
        return import(`./elements/DateField`);
      } else if (data_type === 'datetime') {
        // 日期时间
        return import(`./elements/DatetimeField`);
      } else if (data_type === 'integer') {
        // 数字
        return import(`./elements/IntegerField`);
      } else if (data_type === 'autonumber') {
        // 自动编号
        return import(`./elements/TextField`);
      } else if (data_type === 'currency') {
        // 货币
        return import(`./elements/PercentField`);
        // return import(`./elements/Picklist`);
      } else if (data_type === 'double') {
        // 小数 百分数
        return import(`./elements/PercentField`);
      } else if (data_type === 'bigint') {
        // 长整数
        return import(`./elements/IntegerField`);
      } else if (data_type === 'boolean') {
        // 复选框
        return import(`./elements/BooleanField`);
      } else if (data_type === 'website') {
        // URL
        return import(`./elements/LinkField`);
      } else if (data_type === 'lookup') {
        // 查找
        return import(`./elements/ResourceField`);
      } else if (data_type === 'userlookup') {
        // 用户
        return import(`./elements/UserField`);
      } else if (data_type === 'fileupload') {
        // 文件上传
        return import(`./elements/MultipleAttachmentField`);
      } else if (data_type === 'profileimage') {
        // 上传图片
        return import('./elements/MultipleImageField');
      } else if (data_type === 'multiselectlookup') {
        // 多选查找
        return import(`./elements/ResourceField`);
      } else if (data_type === 'ownerlookup') {
        // 线索所有者 查找
        return import(`./elements/UserField`);
      }
      // 单行文本
      return import(`./elements/TextField`);
    });
    // 公式
    setElement(element);
  },[])
  

  return (
    <Suspense fallback={<div />}>
      {!!Element && <Element {...props} />}
    </Suspense>
  );
}