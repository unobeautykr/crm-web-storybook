import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PriceInput from '~/components/PriceInput';
import NativeSelect from '~/components/NativeSelect2';
import { TextField } from '~/components/TextField';

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 4px;
`;

const Button = styled.button`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  border-radius: 50% !important;
  color: #fff;
  font-weight: bold;
  line-height: 0;
  background: #eb5757;
`;

const AddButton = styled(Button)`
  background: #293142;
`;

const RemoveButton = styled(Button)`
  background: #eb5757;
`;

const CardInput = ({
  disabled,
  label,
  type,
  value,
  max,
  readOnly,
  onEdit,
  onAdd,
  onRemove,
  selectOptions = [],
}) => {
  const data = useMemo(() => {
    let customCompany = value.customCompany ?? false;
    if (
      value.companyName === null ||
      (value.companyName !== '' &&
        selectOptions.filter((f) => f === value.companyName).length === 0)
    ) {
      customCompany = true;
    }

    return {
      ...value,
      customCompany,
    };
  }, [value, selectOptions]);

  const onChangeAmount = (value) => {
    onEdit({ amount: value });
  };

  const onChangeCompanyName = (value) => {
    if (value === '직접입력') {
      onEdit({
        customCompany: true,
        companyName: null,
      });
      return;
    }

    onEdit({
      customCompany: false,
      companyName: value ?? '',
    });
  };

  return (
    <li>
      <p>{label}</p>
      <PriceInput
        disabled={disabled}
        value={data.amount - data.refundAmount}
        onChange={(v) => onChangeAmount(v + data.refundAmount)}
        readOnly={readOnly}
        max={data.amount - data.refundAmount + max}
        showButton={!readOnly}
      />
      <SelectWrapper>
        {data.customCompany ? (
          <TextField
            placeholder="직접입력"
            value={data?.companyName ?? ''}
            onChange={(v) => {
              onEdit({ companyName: v ?? '', customCompany: true });
            }}
            onClear={() => {
              onEdit({
                companyName: '',
                customCompany: false,
              });
            }}
          />
        ) : (
          <NativeSelect
            value={data.companyName}
            onChange={(v) => onChangeCompanyName(v)}
            options={selectOptions.map((v) => {
              return { value: v };
            })}
            placeholder={type === 'bank' ? '은행 선택' : '카드사 선택'}
            optionValue="value"
            optionLabel="value"
            disabled={disabled || readOnly}
          />
        )}

        {onAdd && (
          <AddButton id="add" disabled={disabled} onClick={onAdd}>
            +
          </AddButton>
        )}
        {onRemove && (
          <RemoveButton id="remove" disabled={disabled} onClick={onRemove}>
            -
          </RemoveButton>
        )}
      </SelectWrapper>
    </li>
  );
};

CardInput.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.string,
  value: PropTypes.object,
  max: PropTypes.number,
  readOnly: PropTypes.bool,
  onEdit: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onAdd: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onRemove: PropTypes.func,
  selectOptions: PropTypes.array,
};

export default CardInput;
