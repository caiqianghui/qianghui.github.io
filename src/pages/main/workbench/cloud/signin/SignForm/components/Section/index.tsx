import BaseSection from './BaseSection';
import SubSection from './SubSection';
import SelectAddress from './SelectAddress';
import FilesUpload from './FilesUpload';
import ImagesUpload from './ImagesUpload';

export default (props) => {
  const { form, section } = props;

  const renderSection = () => {
    const showFields = section.fields.filter(item => !item.hidden && item.view.indexOf('new') !== -1);
    const isShow = section.category === 'sub_form' ? showFields.find(field => field.type === 'Fields::NestedFormField') : showFields.length > 0
    if (!isShow) {
      return <></>;
    }

    if (section.category === 'sub_form') {
      return <SubSection section={section} />;
    }
    if (section.category === 'address') {
      return <SelectAddress section={section}/>;
    }
    if (section.category === 'attachment') {
      return <FilesUpload section={section} form={form} />;
    }
    if (section.category === 'image') {
      return <ImagesUpload section={section} />;
    }
    return <BaseSection section={section} />;
  }
  return renderSection();
}