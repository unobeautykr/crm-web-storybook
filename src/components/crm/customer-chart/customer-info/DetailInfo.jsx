import { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Phone from '~/components/Phone';
import DaumPostcode from 'react-daum-postcode';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import { ReactComponent as SearchIcon } from '~/assets/images/icon/ic-search.svg';
import Label from '~/components/Label2';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { DropdownList } from '~/components/DropdownList';
import { ComboBox } from '~/components/ComboBox';
import { TextField } from '~/components/TextField';
import { getOptions } from '~/hooks/useFormSelect';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
`;

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

const AdressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px;
  row-gap: 2px;
  width: 1480px;
`;

const SearchInput = styled.div`
  display: inline-block;
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  margin-right: 8px;
`;

const InputWrapper = styled.div`
  input {
    height: 29px;
    background-color: #fff;
    padding: 3px 10px;
    ::placeholder {
      font-size: 12px;
    }
    :disabled {
      background-color: #f3f8ff;
      color: #a1b1ca;
    }
  }
`;

const postCodeStyle = {
  display: 'inline-table',
  position: 'absolute',
  height: '448px',
  left: '0',
  bottom: '35px',
  border: '1px solid #000000',
};

const marriedList = [
  { id: false, label: '미혼' },
  { id: true, label: '기혼' },
];

const DetailInfo = () => {
  const { obj, setObj, onChangeValue, disableForm, isOpenPost, setIsOpenPost } =
    useContext(CustomerInfoContext);
  const [originValue] = useState(obj);

  const onChangeOpenPost = (e) => {
    e.stopPropagation();
    setIsOpenPost(!isOpenPost);
  };

  const onCompletePost = (data) => {
    let fullAddr =
      data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
    let extraAddr = '';

    if (data.userSelectedType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr +=
          extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setObj({ ...obj, address: fullAddr });
    setIsOpenPost(false);
  };

  const { data: jobList } = useFetch(
    buildUrl('/customers/jobs', {
      limit: 300,
      visible: true,
    }),
    {
      onNewData: (old, updates) => {
        return (
          updates?.data.map((v) => ({
            id: v.id,
            label: v.name,
          })) ?? []
        );
      },
    },
    []
  );

  const { data: complaintList } = useFetch(
    buildUrl('/customers/complaints', {
      limit: 300,
      visible: true,
    }),
    {
      onNewData: (old, updates) => {
        return (
          updates?.data.map((v) => ({
            id: v.id,
            label: v.content,
          })) ?? []
        );
      },
    },
    []
  );

  const { data: regionList } = useFetch(
    buildUrl('/customers/regions', {
      limit: 300,
      visible: true,
    }),
    {
      onNewData: (old, updates) => {
        return (
          updates?.data.map((v) => ({
            id: v.id,
            label: v.name,
          })) ?? []
        );
      },
    },
    []
  );

  const jobOptions = useMemo(() => {
    if (!jobList) return [];
    return getOptions(jobList, originValue?.job).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [jobList, originValue?.job]);

  const regionOptions = useMemo(() => {
    if (!regionList) return [];
    return getOptions(regionList, originValue?.region).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [regionList, originValue?.region]);

  const complaintOptions = useMemo(() => {
    if (!complaintList) return [];
    if (!originValue?.complaint) return complaintList;

    return getOptions(
      complaintList,
      Object.assign(originValue.complaint, {
        name: originValue.complaint.content,
      })
    ).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [complaintList, originValue.complaint]);

  return (
    <Wrapper>
      <FlexWrapper>
        <AdressWrapper>
          <label>주소</label>
          <SearchInput>
            <TextField
              readOnly
              tabIndex="20"
              value={obj.address || ''}
              onChange={() => {
                setObj({ ...obj, address: '' });
              }}
              onClick={(e) => onChangeOpenPost(e)}
              placeholder="주소를 검색하세요"
              disabled={disableForm}
              endAdornment={
                <IconWrapper>
                  <SearchIcon />
                </IconWrapper>
              }
            />
            {isOpenPost ? (
              <DaumPostcode
                style={postCodeStyle}
                autoClose
                onComplete={onCompletePost}
              />
            ) : null}
          </SearchInput>
        </AdressWrapper>
        <FormControl>
          <label>상세주소</label>
          <TextField
            tabIndex="21"
            value={obj.addressDetail || ''}
            onChange={(v) => {
              obj['addressDetail'] = v;
              setObj({ ...obj });
            }}
            placeholder="상세주소를 입력하세요"
            disabled={disableForm}
          />
        </FormControl>
      </FlexWrapper>
      <FlexWrapper>
        <FormControl>
          <Label text="직업">
            <ComboBox
              tabIndex="22"
              value={jobOptions?.find((f) => f.id === obj?.job?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  job: { id: v ? v.id : null },
                });
              }}
              placeholder="직업을 선택하세요"
              disabled={disableForm}
              options={jobOptions}
            />
          </Label>
        </FormControl>
        <FormControl>
          <Label text="결혼여부">
            <DropdownList
              options={marriedList}
              value={marriedList.find((f) => f.id === obj?.married)}
              onChange={(v) => {
                setObj({ ...obj, married: v?.id ?? null });
              }}
              placeholder="결혼 여부를 선택하세요"
              disabled={disableForm}
              tabIndex="23"
            />
          </Label>
        </FormControl>
        <FormControl>
          <Label text="국가/지역">
            <ComboBox
              tabIndex="24"
              value={regionOptions?.find((f) => f.id === obj?.region?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  region: { id: v ? v.id : null },
                });
              }}
              placeholder="국가/지역을 선택하세요"
              disabled={disableForm}
              options={regionOptions}
            />
          </Label>
        </FormControl>
      </FlexWrapper>
      <FlexWrapper>
        <FormControl>
          <Label text="불만사항">
            <ComboBox
              tabIndex="25"
              value={complaintOptions?.find((f) => f.id === obj?.complaint?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  complaint: { id: v ? v.id : null },
                });
              }}
              placeholder="불만사항을 선택하세요"
              disabled={disableForm}
              options={complaintOptions}
            />
          </Label>
        </FormControl>
        <FormControl>
          <label>이메일</label>
          <TextField
            tabIndex="26"
            value={obj.email || ''}
            onChange={(v) => onChangeValue('email', v)}
            placeholder="이메일을 입력하세요"
            disabled={disableForm}
          />
        </FormControl>
        <FormControl>
          <label>전화번호2</label>
          <InputWrapper>
            <Phone
              tabIndex={27}
              phone={obj.phoneNumber2 || ''}
              onChange={(phoneNumber) =>
                onChangeValue('phoneNumber2', phoneNumber)
              }
              placeholder="전화번호를 입력하세요"
              disabled={disableForm}
            />
          </InputWrapper>
        </FormControl>
      </FlexWrapper>
    </Wrapper>
  );
};

export default DetailInfo;
