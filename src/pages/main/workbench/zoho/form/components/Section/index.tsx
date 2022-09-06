import BaseSection from './BaseSection';
import SubSection from './SubSection';
import SelectAddress from './SelectAddress';
import FilesUpload from './FilesUpload';
import ImagesUpload from './ImagesUpload';

export default (props) => {
  const { form, section, data } = props;

  const renderSection = () => {
    if (section.data_type === 'sub_form') {
      return <SubSection section={section} data={data} form={form} />;
    }
    if (section.data_type === 'address') {
      return <SelectAddress section={section} data={data} form={form} />;
    }
    if (section.data_type === 'attachment') {
      return <FilesUpload section={section} data={data} form={form} />;
    }
    if (section.data_type === 'profileimage') {
      return <ImagesUpload section={section} data={data} form={form} />;
    }

    return <BaseSection section={section} data={data} form={form} />;
  }
  return renderSection();
}