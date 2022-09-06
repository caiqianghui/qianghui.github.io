import FormItem from './FormItem';
import {View} from '@tarojs/components';

export default (props) => {
  const {section} = props;
  const fields = section.fields.filter(
    (field) =>
      field.mobile_view.indexOf('new') !== -1 &&
      field.accessibility !== 'hidden',
  );

  return (
    <View className="baseSectiosContent">
      <View className="collapse-panel-content">
        {fields.filter((item) => !item.hidden).map((field) => <FormItem key={field.id} field={field}/>)}
      </View>
    </View>
  );
};
