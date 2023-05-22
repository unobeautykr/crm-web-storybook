import { useContext } from 'react';
import styled from 'styled-components';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import Label from '~/components/Label2';
import { DropdownList } from '~/components/DropdownList';
import { TextField } from '~/components/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const FlexWrapper = styled.div`
  display: flex;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px;
  row-gap: 2px;
  width: 100%;

  select {
    font-size: 12px;
    max-width: 480px;
    :disabled {
      background-color: #f3f8ff;
      color: #a1b1ca;
    }
  }
`;

const InputWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const InputEndAdornment = styled(InputAdornment)`
  p {
    font-size: 12px;
    margin-right: 8px;
  }
`;

const bloodTypeList = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'O', label: 'O' },
  { id: 'AB', label: 'AB' },
  { id: 'Rh-A', label: 'Rh-A' },
  { id: 'Rh-B', label: 'Rh-B' },
  { id: 'Rh-O', label: 'Rh-O' },
  { id: 'Rh-AB', label: 'Rh-AB' },
];

const VitalInfo = () => {
  const { obj, setObj, onChangeValue, disableForm } = useContext(
    CustomerInfoContext
  );
  return (
    <FlexWrapper>
      <FormControl>
        <label>키</label>
        <InputWrapper>
          <TextField
            maxLength={3}
            tabIndex="13"
            value={obj.height || ''}
            onChange={(v) => onChangeValue('height', v)}
            placeholder="키를 입력하세요"
            disabled={disableForm}
            endAdornment={<InputEndAdornment>cm</InputEndAdornment>}
          />
        </InputWrapper>
      </FormControl>
      <FormControl>
        <Label text="혈액형">
          <DropdownList
            options={bloodTypeList}
            value={bloodTypeList.find((f) => f.id === obj?.bloodType)}
            onChange={(v) => {
              setObj({ ...obj, bloodType: v?.id ?? null });
            }}
            placeholder="혈액형"
            disabled={disableForm}
            tabIndex="14"
          />
        </Label>
      </FormControl>
      <FormControl>
        <label>몸무게</label>
        <InputWrapper>
          <TextField
            maxLength="3"
            tabIndex="15"
            value={obj.weight || ''}
            onChange={(v) => onChangeValue('weight', v)}
            placeholder="몸무게를 입력하세요"
            disabled={disableForm}
            endAdornment={<InputEndAdornment>kg</InputEndAdornment>}
          />
        </InputWrapper>
      </FormControl>
    </FlexWrapper>
  );
};
export default VitalInfo;
