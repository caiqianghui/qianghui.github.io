/**
 * 关联列表
 */

import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import RelatedList from "./RelatedList";

interface Props {
  module_name: string;
  zoho_id: string;
  refreshKey?: {
    time?: Date,
    api_name?: string,
  };
}

export default (props: Props) => {
  const {module_name} = props;

  const _lists = [
    {api_name: 'Notes', title: '备注'},
    {api_name: 'Calls', title: '通话'},
  ]

  const [lists, setLists] = useState<Array<any>>();

    
  const note = {api_name: 'Notes', title: '备注'};
  const sigin = {api_name: 'Signin', title: '签到'};
  const contacts = {api_name: 'Contacts', title: '联系人'};

  useEffect(() => {
    console.log('关联界面' + new Date());
    if (!lists) {
      switch (module_name) {
        case 'Leads':
          setLists(_lists.concat(sigin));
          break;
        case 'Deals':
          setLists(_lists.concat(sigin, contacts));
          break;
        case 'Accounts':
          setLists(_lists.concat(contacts));
          break;
        case 'Public_Leads':
          setLists(_lists.concat(contacts, sigin));
          break;
        case 'TelephoneDevelopment':
          setLists(_lists);
          break;
        default:
          setLists([note]);
          break;
      }
    }
  }, []);

  return (
    <View className='association'>
      {lists && lists.map((list, index) => {
        return (
          <RelatedList {...props} list={list} key={index} module={module_name}/>
        )
      })}
    </View>
  )
}