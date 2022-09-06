import BaseSection from './BaseSection';
import SubSection from './SubSection';
import SelectAddress from './SelectAddress';
import FilesUpload from './FilesUpload';
import ImagesUpload from './ImagesUpload';

export default (props) => {
  const { form, section, data } = props;

  const renderSection = () => {
    const showFields = section.fields.filter(item => !item.hidden && item.accessibility !== 'hidden' && item.view.indexOf(data.id ? 'edit' : 'new') !== -1);
    const isShow = section.category === 'sub_form' ? showFields.find(field => field.type === 'Fields::NestedFormField') : showFields.length > 0
    if (!isShow) {
      return <></>;
    }

    if (section.category === 'sub_form') {
      return <SubSection section={section} data={data} form={form} />;
    }
    if (section.category === 'address') {
      return <SelectAddress section={section} data={data} form={form} />;
    }
    if (section.category === 'attachment') {
      return <FilesUpload section={section} data={data} form={form} />;
    }
    if (section.category === 'image') {
      return <ImagesUpload section={section} data={data} form={form} />;
    }

    return <BaseSection section={section} cols={form.cols || 4} data={data} form={form} />;
  }
  return renderSection();
}