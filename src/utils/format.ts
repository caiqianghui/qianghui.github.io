import dayjs from "dayjs";

export function initFormData(values, fields, is_copy = false) {
  const newValues: any = {};
  [
    'id',
    'key',
    'tracking_data_id',
    'tracking_form_id',
    'entryable_id',
    'entryable_type',
    'outable_id',
    'outable_type',
    'product_base_properties',
    'pricing_system_products',
  ].forEach((column) => {
    if (values.hasOwnProperty(column)) {
      newValues[column] = values[column];
    }
  });
  if (is_copy) {
    delete newValues.id;
  }
  fields.forEach(field => {
    if (values.hasOwnProperty(field.name)) {
      if ((field.type === 'Fields::DateField' || field.type === 'Fields::DatetimeField') && values[field.name]) {
        newValues[field.name] = dayjs(values[field.name]);
      } else if (field.type === 'Fields::NestedFormField') {
        newValues[field.name] = (values[field.name] || []).map((item) => {
          return initFormData(item, field.fields, is_copy);
        });
      } else if ((field.type === 'Fields::ResourceField' || field.type === 'Fields::UserField') && (typeof values[field.name]) === 'object') {
        newValues[field.name] = values[field.name] && values[field.name].id;
      } else if ((field.type === 'Fields::DecimalField' || field.type === 'Fields::PercentField') && values[field.name]) {
        newValues[field.name] = parseFloat(values[field.name]);
      } else {
        newValues[field.name] = values[field.name];
      }
    }
  })

  return newValues;
}

export function formatFormData(values, fields, set_default = false) {
  const newValues = {};
  [
    'id',
    'key',
    'tracking_data_id',
    'tracking_form_id',
    '_destroy',
    'entryable_id',
    'entryable_type',
    'outable_id',
    'outable_type',
    'product_base_properties',
    'pricing_system_products',
    'settleable_type',
    'settleable_module_name',
  ].forEach((column) => {
    if (values.hasOwnProperty(column)) {
      newValues[column] = values[column];
    }
  });
  fields.forEach((field) => {
    if (values.hasOwnProperty(field.name)) {
      if (field.type === 'Fields::DateField' && values[field.name]) {
        newValues[field.name] = dayjs(values[field.name]).format('YYYY-MM-DD');
      } else if (field.type === 'Fields::DatetimeField' && values[field.name]) {
        newValues[field.name] = dayjs(values[field.name]).format('YYYY-MM-DD HH:mm:ss');
      } else if (field.type === 'Fields::NestedFormField' && (values[field.name] || []).length > 0) {
        newValues[field.name] = values[field.name].map((item) => {
          return formatFormData(item || {}, field.fields);
        });
      } else if (field.type === 'Fields::TextField') {
        newValues[field.name] = values[field.name] && String(values[field.name]).replace(/(^\s*)|(\s*$)/g, "");;
      } else if (set_default && (field.type === 'Fields::DecimalField' || field.type === 'Fields::IntegerField')) {
        newValues[field.name] = parseFloat(values[field.name] || 0);
      } else {
        newValues[field.name] = values[field.name];
      }
    }
    if (values.hasOwnProperty(`${field.name}_disable_edit`)) {
      newValues[`${field.name}_disable_edit`] = values[`${field.name}_disable_edit`];
    }
  });
  return newValues;
}