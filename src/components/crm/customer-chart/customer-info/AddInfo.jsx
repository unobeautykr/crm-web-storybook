import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import { TextField } from '~/components/TextField';

const FlexWrapper = styled.div`
  display: flex;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px;
  row-gap: 3px;
  width: 100%;

  select {
    font-size: 12px;
    :disabled {
      background-color: #f3f8ff;
      color: #a1b1ca;
    }
  }
  .multi-select {
    .dropdown-heading-value > span.gray {
      color: #a1b1ca;
    }
    .clear-selected-button:disabled {
      background-color: #f3f8ff !important;
      border-color: #f3f8ff !important;
    }
    font-size: 12px;
    font-weight: 400;
    max-width: 480px;

    ${({ disabled }) =>
      disabled &&
      css`
        --rmsc-gray: #a1b1ca !important;

        .dropdown-container {
          background-color: #f3f8ff;
          color: #a1b1ca;
        }
      `}

    .dropdown-container .dropdown-heading {
      width: 100% !important;
      height: 27px !important;
      margin: 0 3px;
    }
    .dropdown-container .dropdown-content {
      width: 100% !important;
    }
    .dropdown-container .dropdown-heading .dropdown-heading-dropdown-arrow {
      transform: scale(0.5) !important;
      margin-right: 2px;
    }
  }
`;

const AddInfo = () => {
  const { obj, inputRef, onChangeValue, disableForm } = useContext(
    CustomerInfoContext
  );

  return (
    <FlexWrapper>
      <FormControl>
        <label>추가정보1</label>
        <TextField
          tabIndex="13"
          value={obj.additionalInfo1 || ''}
          onChange={(v) => onChangeValue('additionalInfo1', v)}
          placeholder="추가정보를 입력하세요(20자 이내)"
          maxLength="20"
          ref={inputRef}
          disabled={disableForm}
        />
      </FormControl>
      <FormControl>
        <label>추가정보2</label>
        <TextField
          tabIndex="14"
          value={obj.additionalInfo2 || ''}
          onChange={(v) => onChangeValue('additionalInfo2', v)}
          placeholder="추가정보를 입력하세요(20자 이내)"
          maxLength="20"
          ref={inputRef}
          disabled={disableForm}
        />
      </FormControl>
      <FormControl>
        <label>추가정보3</label>
        <TextField
          tabIndex="15"
          value={obj.additionalInfo3 || ''}
          onChange={(v) => onChangeValue('additionalInfo3', v)}
          placeholder="추가정보를 입력하세요(20자 이내)"
          maxLength="20"
          ref={inputRef}
          disabled={disableForm}
        />
      </FormControl>
    </FlexWrapper>
  );
};

export default AddInfo;
