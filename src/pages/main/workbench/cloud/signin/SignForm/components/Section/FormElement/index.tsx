import React, { useState, useEffect, Suspense, useContext } from 'react';
import { FormContainerContext } from '../../FormContainer';

export default (props: any) => {
  const { refForm, overloadData } = useContext<any>(FormContainerContext);
  const { field, subFormName, index } = props;
  const [Element, setElement] = useState<any>();
  const placeholder = field.is_show_tip && field.tip_type === 'placeholder' ? field.hint : null;
  let isDisableEdit = field.is_disable_edit;
  if (field.is_disable_edit && field.disable_edit_condition && field.disable_edit_condition !== '') {
    if (subFormName) {
      isDisableEdit = refForm.getFieldValue([subFormName, index, `${field.name}_disable_edit`]);
    } else {
      isDisableEdit = field.disable_edit;
    }
  } else if (field.disable_edit === true) {
    isDisableEdit = true;
  } else if (subFormName && (overloadData[subFormName] || [])[index] && overloadData[subFormName][index][field.name]) {
    isDisableEdit = overloadData[subFormName][index][field.name].disable;
  }
  const isDisable = field.is_formula || isDisableEdit || field.accessibility === 'read_only' || !field.can_modify;
  const options = {...props, placeholder, isDisable};

  useEffect(() => {
    const element = React.lazy(() => {
      if (field.type === 'Fields::ResourceField' && field.options.data_source_type === 'products') {
        return import('./elements/OrderProductField');
      } 

      if (field.type === 'Fields::TextField-iBbodor') {
        return import('./elements/ModuleSelect');
      }
      
      const fieldType = field.type.split('::')[1];
      return import(`./elements/${fieldType}`);
    });

    setElement(element);
  },[])
  

  return (
    <Suspense fallback={<div />}>
      {!!Element && <Element {...options} />}
    </Suspense>
  );
}