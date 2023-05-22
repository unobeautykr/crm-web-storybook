import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { $case, translate } from '~/utils/filters';
import { mustParse } from '~/utils/json';
import chart from '~/store/chart';
import { RadioInput } from '~/components/RadioInput';

const RadioInputWrapper = styled(RadioInput)`
  margin-right: 4px;
`;

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => ++value);
};

const openCustomerChartNew = (options) => {
  chart.show({
    options,
  });
};

const closeCustomerChartNew = (id) => {
  chart.closeModalByCustomerId(id);
};

const radios = ({ radios, disabled, obj, setObj, name, tabIndex }) => (
  <div className="radios flex-row">
    {radios.map((radio, idx) => (
      <div
        key={idx}
        className="radio-item flex-row items-center flex-wrap m-r-16"
      >
        <RadioInputWrapper
          tabIndex={tabIndex}
          name={name}
          value={radio.value}
          disabled={disabled ?? false}
          checked={radio.value === obj[name]}
          onChange={(e) => {
            obj[name] = mustParse(e.target.value);
            setObj({ ...obj });
          }}
        />
        {translate(radio.label || (radio.value || '').toUpperCase())}
      </div>
    ))}
  </div>
);
const estimatedServiceMinutesList = [
  '10',
  '30',
  '60',
  '90',
  '120',
  '150',
  '180',
  '210',
  '240',
  '270',
  '300',
  '330',
  '360',
  '390',
  '420',
  '450',
  '480',
];

const selector = ({ options, unit, value, onChange, name, disabled }) => {
  return (
    <select
      disabled={String(name).includes('lunch') && !disabled ? true : false}
      name={name}
      value={value || ''}
      onChange={onChange}
    >
      <option disabled value={''} key={-1}>
        -
      </option>
      {options.map((value, idx) => (
        <option value={value} key={idx}>
          {value}
          {unit}
        </option>
      ))}
    </select>
  );
};

const disabledField = ({ obj, requiredFields }) => {
  const missingField = requiredFields.find(
    (key) =>
      (typeof obj[key] !== 'boolean' && !obj[key]) ||
      (typeof obj[key] === 'object' && !(obj[key] || {}).id)
  );

  return missingField
    ? translate('ERROR_MISSING_FIELD').replace(
        /%s/,
        translate($case.toConst(missingField))
      )
    : null;
};

const sortObjectToOrderKey = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .sort(([, a], [, b]) => a.order - b.order)
      .map((v, i) => {
        let redorderValue = {
          ...v[1],
          order: i + 1,
        };
        return [v[0], redorderValue];
      })
  );
};

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item, i) => {
    return {
      ...obj,
      [item[key]]: { ...item.value, order: i + 1 },
    };
  }, initialValue);
};

export default {
  useForceUpdate,
  openCustomerChartNew,
  closeCustomerChartNew,
  estimatedServiceMinutesList,
  selector,
  radios,
  disabledField,
  sortObjectToOrderKey,
  convertArrayToObject,
};
