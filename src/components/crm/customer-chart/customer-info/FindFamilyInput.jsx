import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { AutoComplete } from '~/components/AutoComplete';
import {
  FindCustomerAutoCompleteRow,
  returnSex,
} from '~/components/crm/appointment-boards/FindCustomerAutoCompleteRow';
import { Popper } from '@mui/material';
import { ReactComponent as SearchIcon } from '~/assets/images/icon/ic-search.svg';
import { phoneNumberFormatHyphen } from '~/utils/filters';
import { ClearButton } from '~/components/ClearButton';
import { Fade, InputAdornment } from '@mui/material';

const IconWrapper = styled.div`
  display: flex;
`;

const returnText = (customer) => {
  let { name, birthday, phoneNumber } = customer;
  if (birthday) birthday = birthday.replace(/-/g, '.');
  if (phoneNumber) phoneNumber = phoneNumberFormatHyphen(phoneNumber);

  return `${name ?? '-'}/${birthday ?? '-'}/${returnSex(customer.sex) ?? '-'}/${
    phoneNumber ?? '-'
  }`;
};

export const FindFamilyInput = observer(
  ({ index, obj, setObj, items, setItems, disabled }) => {
    const [focused, setFocused] = useState(false);
    const [timer, setTimer] = useState(0); // 디바운싱 타이머
    const [customers, setCustomers] = useState([]);

    const { get, response } = useFetch();

    const findCustomer = async (param) => {
      const getData = await get(buildUrl('/customers', param));
      if (response.ok) {
        const { data } = getData;
        setCustomers(
          data.map((v) => {
            return {
              ...v,
              searchValue: `${v.name ?? '-'}/${v.birthday ?? '-'}/${
                returnSex(v.sex) ?? '-'
              }/${v.phoneNumber ?? '-'}`,
              searchOption: `${v.name}/${v.phoneNumberLast}`,
            };
          })
        );
      }
    };

    const onChangeItem = (e, option) => {
      if (e.key === 'Enter' && typeof option === 'string') {
        return;
      }
      if (option === null) {
        let update = [...items];
        update[index] = { id: '', name: '' };
        setItems(update);
        setObj({ ...obj, familyRelationships: update });
      } else {
        let update = [...items];
        update[index] = {
          id: option.id,
          name: returnText(option),
        };
        setItems(update);
        setObj({ ...obj, familyRelationships: update });
      }
    };

    const onChangeInput = (e) => {
      const { target } = e;
      const { value } = target;
      let update = [...items];
      update[index] = { id: null, name: value };
      setItems(update);

      if (value.length >= 2) {
        if (timer) {
          clearTimeout(timer);
        }
        const newTimer = setTimeout(() => {
          let param = {};
          if (!isNaN(value) && value.length === 4) {
            param.phoneNumberLast = value;
          } else {
            param.name = value;
          }
          findCustomer(param);
        }, 500);
        setTimer(newTimer);
      }
    };

    const PopperComponent = function (props) {
      return (
        <Popper
          {...props}
          placement="bottom-end"
          style={{ width: '360px', zIndex: 1300 }}
        />
      );
    };

    return (
      <AutoComplete
        options={customers}
        onChange={(e, option) => onChangeItem(e, option)}
        inputValue={items[index].name}
        ListboxProps={{ style: { maxHeight: '334px', padding: 0 } }}
        PopperComponent={PopperComponent}
        renderOption={(props, option) => (
          <FindCustomerAutoCompleteRow props={props} option={option} />
        )}
        onChangeInput={onChangeInput}
        placeholder="가족관계를 등록하세요"
        inputProps={{
          endAdornment: (
            <>
              <Fade in={focused && items[index].name}>
                <InputAdornment position="end">
                  <ClearButton
                    onClick={() => {
                      let update = [...items];
                      update[index] = { id: null, name: '' };
                      setItems(update);
                      setObj({ ...obj, familyRelationships: update });
                      setCustomers([]);
                    }}
                  />
                </InputAdornment>
              </Fade>
              <IconWrapper>
                <SearchIcon />
              </IconWrapper>
            </>
          ),
        }}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
);

FindFamilyInput.propTypes = {
  index: PropTypes.number,
  obj: PropTypes.object,
  setObj: PropTypes.func,
  items: PropTypes.array,
  setItems: PropTypes.func,
  disabled: PropTypes.bool,
};
