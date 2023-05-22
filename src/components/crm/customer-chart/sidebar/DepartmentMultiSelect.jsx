import { useState, useCallback, useEffect } from 'react';
import { MultiSelect } from '~/components/MultiSelect';
import PropTypes from 'prop-types';
import { useServices } from '~/hooks/useServices';

const multiSelectStyle = { width: '230px', backgroundColor: 'white' };
export const DepartmentMultiSelect = ({ value, onChange, ...props }) => {
  const services = useServices();
  const [departments, setDepartments] = useState([]);

  const departmentCallApi = useCallback(async () => {
    let params = { limit: 300, visible: true };
    const resp = await services.crm.crud.departmentCategory.all(params);
    let departments = [];
    for (const d of resp.data) {
      departments = [
        ...departments,
        ...d.departments
          .map((v) => {
            return {
              ...v,
              name: `${d.name} - ${v.name}`,
            };
          })
          .filter((d) => d.visible),
      ];
    }

    setDepartments(departments);
  }, []);

  useEffect(() => {
    departmentCallApi();
  }, [departmentCallApi]);

  const onChangeSelect = (selectedItems) => {
    onChange(selectedItems);
  };

  return (
    <MultiSelect
      options={departments}
      value={value}
      optionValue="id"
      optionLabel="name"
      onChange={onChangeSelect}
      placeholder="부서선택"
      style={multiSelectStyle}
      {...props}
    />
  );
};

DepartmentMultiSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
