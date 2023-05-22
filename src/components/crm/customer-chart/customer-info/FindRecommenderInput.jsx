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
import { ClearButton } from '~/components/ClearButton';
import { Fade, InputAdornment } from '@mui/material';

const IconWrapper = styled.div`
  display: flex;
`;

export const FindRecommenderInput = observer(({ obj, setObj, disabled }) => {
  const [focused, setFocused] = useState(false);
  const [timer, setTimer] = useState(0); // 디바운싱 타이머
  const [customers, setCustomers] = useState([]);
  const [inputValue, setInputValue] = useState(obj.recommender?.name ?? '');

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
      setInputValue('');
      obj.recommenderId = null;
      obj.recommenderName = null;
      obj.recommender = null;
      setObj({ ...obj });
    } else {
      setInputValue(option.name);
      obj.recommenderId = option.id;
      obj.recommenderName = option.name;
      obj.recommender = option;
      setObj({ ...obj });
    }
  };

  const onChangeInput = (e) => {
    const { target } = e;
    const { value } = target;
    if (!value) {
      obj.recommenderId = null;
      obj.recommenderName = null;
      obj.recommender = null;
      setObj({ ...obj });
    }
    setInputValue(value);

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
        placement="bottom-start"
        style={{ width: '360px', zIndex: 1300 }}
      />
    );
  };

  return (
    <AutoComplete
      options={customers}
      onChange={(e, option) => onChangeItem(e, option)}
      inputValue={inputValue}
      ListboxProps={{ style: { maxHeight: '334px', padding: 0 } }}
      PopperComponent={PopperComponent}
      renderOption={(props, option) => (
        <FindCustomerAutoCompleteRow props={props} option={option} />
      )}
      onChangeInput={onChangeInput}
      placeholder="소개자를 검색하세요"
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      inputProps={{
        endAdornment: (
          <>
            <Fade in={focused && inputValue}>
              <InputAdornment position="end">
                <ClearButton
                  onClick={() => {
                    setInputValue('');
                    obj.recommenderId = null;
                    obj.recommenderName = null;
                    obj.recommender = null;
                    setObj({ ...obj });
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
    />
  );
});

FindRecommenderInput.propTypes = {
  obj: PropTypes.object,
  setObj: PropTypes.func,
  disabled: PropTypes.bool,
};
