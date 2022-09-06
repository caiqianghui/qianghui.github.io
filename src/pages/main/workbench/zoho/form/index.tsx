import {View} from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import './style.scss';
import FormContainer from "./components/FormContainer";
import { useEffect, useState } from "react";
import NetCloudFun from "src/pages/services/functions";
import iBodor, { Module } from 'src/pages/main/workbench/ibodor';

const {ltcMenu} = iBodor;
const {children} = ltcMenu;

interface Props {
  module_name: string;
  open_type: string;
  onBack: (e?: string) => void;
}

const Index = (props: Props) => {
  const module_name = props.module_name || getCurrentInstance().router?.params.module_name || '';
  const name = props.module_name || getCurrentInstance().router?.params.name || '';
  const phone = props.module_name || getCurrentInstance().router?.params.phone || '';
  const type = getCurrentInstance().router?.params.type || '';
  const id = getCurrentInstance().router?.params.id || '';
  const [sections, setSections] = useState<Array<any>>([]);
  const [form, setForm] = useState({});
  const [data, setData] = useState({});
  const [fieldMapDependencies, setFieldMapDependencies] = useState([]);
  const [fields, setFields] = useState([]);

  const [module, setModule] = useState<Module>();

  useEffect(() => {
    if (id) {
      NetCloudFun.get(`/crm/v2/${module_name}/${id}`).then((res) => {
        console.log(res);
        if (res.data) {
          setData(res.data[0]);
        }
      }).catch((err) => {
        console.log(err);
      })
    }
    NetCloudFun.get(`/crm/v2/settings/layouts`, {
      module: module_name
    }).then((res: any) => {
      res.layouts[0].sections.forEach((item) => {
        item.fields = item.fields.filter((field) => field.view_type.create);
      });
      setSections(res.layouts[0].sections.filter((item) => item.name !== 'Record Image'));
      
    }).catch((err) => {
      console.log(err);
    })
    setModule(children.find((item) => item.moduleName === module_name));
    if (name || phone) {
      setData({...data, Name: name, Phone: phone});
    }
  }, []);

  return (
    <View className='home-form'>
      {sections.length ? (
        <FormContainer
          {...props}
          id={id}
          sections={sections}
          setSections={setSections}
          fieldMapDependencies={fieldMapDependencies}
          form={form}
          data={data}
          title={module?.name}
          module={module_name}
          // params={{...{refreshToken, accessToken, expiresIn, module, id, copy_data, language, association_id, association_module, conversion_id, source_id, type}, query}}
        />
      ) : null}
    </View>
  )
}

export default Index;
