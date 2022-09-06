import { useState, useEffect } from 'react';
import {
  TreeSelect,
} from 'antd';
import debounce from 'lodash/debounce';
import { getSelections } from 'src/pages/services/selection';

export default (props) => {
  const { field, value, isDisable, placeholder, onChange } = props;
  const [selectionDatas, setSelectionDatas] = useState([]);

  const searchSelectionDatas = (condition) => {
    if (field.options.data_source_type) {
      getSelections(field.options.data_source_type, {
        q: condition,
      }).then((res) => {
        if (res.data) {
          setSelectionDatas(res.data.datas);
        }
      });
    }
  };

  useEffect(() => {
    if (value) {
      if (selectionDatas.length === 0) {
        searchSelectionDatas(field);
      }
    }
  }, [value]);

  const fetchSelectionDatas = debounce((keyword) => {
    searchSelectionDatas({ name_cont: keyword });
  }, 500);
  

  return (
    <TreeSelect
      showSearch
      allowClear
      placeholder={placeholder}
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp="title"
      treeData={selectionDatas}
      onSearch={(v) => fetchSelectionDatas(v)}
      onDropdownVisibleChange={() =>
        selectionDatas.length === 0 && searchSelectionDatas(field)
      }
      onChange={(v) => onChange(v === undefined ? null : v)}
      value={value}
      disabled={isDisable}
    />
  )
}