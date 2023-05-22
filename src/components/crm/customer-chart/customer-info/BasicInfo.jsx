import {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import styled, { css } from 'styled-components';
import Phone from '~/components/Phone';
import QuillTextField from '~/components/quill/QuillTextField';
import DateInput from '~/components/DateInput';
import hooks from '~/hooks';
import moment from 'moment';
import { useServices } from '~/hooks/useServices';
import { translate } from '~/utils/filters';
import { CtiCheckbox as Checkbox } from '~/components/CtiCheckbox';
import { FileInput } from '~/components/common/FileInput';
import Button from '~/components/Button2';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import defaultProfile from '~/assets/images/common/profile-default-img.png';
import { useFetch } from 'use-http';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { MultiComboBox } from '~/components/MultiComboBox';
import { TextField } from '~/components/TextField';
import { FindRecommenderInput } from './FindRecommenderInput';
import { unusedCode } from '~/utils/unusedCodeUtil';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr 1fr 1fr;
  gap: 5px;
`;

const Profile = styled.div`
  grid-row: 1 / span 4;
  display: flex;
  padding: 5px 0px;
  width: 144px;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  button {
    font-size: 12px;
    font-weight: 500;
    width: 100%;
  }
`;
const Section = styled.div`
  grid-column: span 3;
  display: flex;
  flex-direction: row;
  row-gap: 3px;
  width: 100%;
`;

const SmsSection = styled.div`
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  padding: 3px;
  row-gap: 3px;
  width: 1152px;

  select {
    font-size: 12px;
  }
`;
const RadioWrapper = styled.div`
  padding-top: 6px;
  display: flex;
`;

const CheckboxWrapper = styled.div`
  ${({ checked }) =>
    checked === false &&
    css`
      .cti-checkbox:disabled + label {
        background: url(/assets/images/icon/cti-checkbox.svg);
        background-color: #a9a7a7;
        border-radius: 3px;
      }
    `}
`;

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

const ChartNumberHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Underline = styled.div`
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;

const MemoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${({ disabled }) =>
    disabled &&
    css`
      .quill {
        background-color: #f3f8ff;
        color: #a1b1ca;
        border-top: 1px solid #dee2ec;
      }
      .ql-toolbar {
        display: none;
      }
    `}
`;

const InputWrapper = styled.div`
  .react-datepicker-wrapper input {
    height: 29px;
  }
  input {
    height: 29px;
    background-color: #fff;
    padding: 3px 10px;
    ::placeholder {
      font-size: 12px;
    }
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Separate = styled.div`
  margin: 0 5px;
`;

const Picture = styled.div`
  width: 140px;
  height: 140px;
  border: 1px solid #dee2ec;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-image: url(${defaultProfile});

  ${({ url }) =>
    url &&
    css`
      background-image: url(${url});
    `}
`;

const AcquisitionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  width: 1152px;
`;

const BasicInfo = () => {
  const {
    obj,
    setObj,
    inputRef,
    ssnRef,
    onChangeValue,
    disableForm,
    customer,
    acquisitionChannel,
    setAcquisitionChannel,
  } = useContext(CustomerInfoContext);
  const snackbar = useSnackbarContext();
  const services = useServices();
  const imageRef = useRef('');
  const fileRef = useRef();
  const calendar = useRef(null);
  const [chartInputFlag, setChartInputFlag] = useState(true);
  const [radioItemsType] = useState([
    { value: 'domestic', label: 'DOMESTIC' },
    { value: 'foreigner', label: 'FOREIGN' },
  ]);
  const [radioItemsSex] = useState([
    { value: 'male', label: 'MALE' },
    { value: 'female', label: 'FEMALE' },
  ]);

  const [acquisitionChannelOptions, setAcquisitionChannelOptions] = useState(
    []
  );

  const { get: getImage, data: imageUrlResponse } = useFetch('/images');

  const acquisitionChannelsCallApi = useCallback(async () => {
    let params = { limit: 300, visible: true };
    const resp = await services.crm.customer.acquisitionChannel.all(params);
    if (!resp) return;
    let options = [...resp.data];
    if (obj.acquisitionChannels) {
      let unusedAcquisitionChannel = [
        ...obj.acquisitionChannels
          .filter((f) => !f.visible && !f.isDeleted)
          .map((v) => ({
            ...v,
            name: unusedCode.unusedCodeValue + v.name,
          })),
        ...obj.acquisitionChannels
          .filter((f) => f.isDeleted)
          .map((v) => ({
            ...v,
            name: unusedCode.deletedCodeValue + v.name,
          })),
      ];
      options.unshift(...unusedAcquisitionChannel);
    }
    setAcquisitionChannelOptions(
      options.map((v) => {
        return { label: v.name, id: v.id };
      })
    );
    if (obj.acquisitionChannels && obj.acquisitionChannels.length > 0) {
      setAcquisitionChannel([
        ...obj.acquisitionChannels.map((v) => {
          return { label: v.name, id: v.id };
        }),
      ]);
    }
  }, [services.crm.customer.acquisitionChannel]);

  useEffect(() => {
    acquisitionChannelsCallApi();
  }, [acquisitionChannelsCallApi]);

  const getThumb = (imageId) => {
    if (!imageId) return;
    getImage(`/${imageId}`);
  };

  useEffect(() => {
    if (obj.profileImageId) {
      getThumb(obj.profileImageId);
    }
  }, []);

  const blobUrl = useMemo(() => {
    if (!obj.profileImageId) return null;
    return imageUrlResponse?.data.thumbnailUrl;
  }, [imageUrlResponse, obj.profileImageId]);

  const onChangePicker = (birthday, e) => {
    if (e.target.value !== undefined && !/^[0-9]*$/.test(e.target.value)) {
      snackbar.open('alert', translate('ERROR_NUMBERS_ONLY'));
      let changeObj = { ...obj };
      delete changeObj.birthday;

      setObj(changeObj);
      calendar.current.setOpen(false);
      return;
    }

    if (
      birthday === null ||
      e.target.value === undefined ||
      e.target.value.length === 6
    ) {
      //데이트 피커 날짜를 선택한 경우 혹은 입력값이 6자리인 경우
      if (birthday > new Date()) {
        birthday.setFullYear(birthday.getFullYear() - 100);
      }
      let changeValue =
        birthday === null ? null : moment(birthday).format('YYYY-MM-DD');
      onChangeValue('birthday', changeValue);
    }
  };

  const onChangeProfileImage = (e) => {
    let target = e.target;
    if (target.files[0] === undefined) {
      return;
    }

    const { size, name } = e.target.files[0];
    const fileType = name.split('.').pop();
    const confirmType = ['jpg', 'JPG', 'png', 'PNG', 'jpeg'];
    // 10Mb
    const confirmSize = 10;
    if (size / 1024 / 1024 > confirmSize) {
      snackbar.open('alert', '10MB 이하로만 첨부가능합니다.');
      return;
    }

    if (confirmType.indexOf(fileType) === -1) {
      snackbar.open('alert', 'jpg 또는 PNG 파일만 첨부가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        imageRef.current.style.backgroundImage = `url(${event.target.result.toString()})`;
        setObj({ ...obj, pictureFile: target.files[0] });
      };
    };
    reader.readAsDataURL(target.files[0]);
  };
  return (
    <Wrapper>
      <Title>기본정보</Title>
      <GridContainer>
        <Profile>
          <Picture ref={imageRef} url={blobUrl} />
          <FileInput ref={fileRef} onChange={onChangeProfileImage} />
          {!disableForm && (
            <>
              <Button
                styled="outline"
                type="secondary"
                onClick={() => fileRef.current.click()}
              >
                사진 첨부하기
              </Button>
              <Underline
                color="#BBBBBB"
                onClick={() => {
                  obj['pictureFile'] = null;
                  obj['profileImageId'] = null;
                  imageRef.current.style.backgroundImage = null;
                  setObj({ ...obj });
                }}
              >
                사진삭제
              </Underline>
            </>
          )}
        </Profile>
        <FormControl>
          <ChartNumberHeader>
            <label>{translate('CHART_NO')}</label>
            {!disableForm && (
              <Underline
                color="rgb(44, 98, 246)"
                onClick={() => {
                  if (!disableForm) {
                    if (!chartInputFlag) {
                      setObj({
                        ...obj,
                        chartNo: customer.chartNo,
                      });
                    }
                  }
                  setChartInputFlag(!chartInputFlag);
                }}
              >
                {chartInputFlag ? (obj.id ? '변경' : '직접입력') : '취소'}
              </Underline>
            )}
          </ChartNumberHeader>
          <FlexWrapper>
            <TextField
              tabIndex="1"
              disabled={disableForm || chartInputFlag}
              value={obj.chartNo ?? ''}
              onChange={(v) => onChangeValue('chartNo', v)}
              placeholder={'등록완료 시 자동발급'}
            />
          </FlexWrapper>
        </FormControl>
        <FormControl>
          <label>고객명</label>
          <TextField
            tabIndex="2"
            value={obj.name || ''}
            onChange={(v) => onChangeValue('name', v)}
            placeholder="이름을 입력하세요."
            ref={inputRef}
            disabled={disableForm}
            border={!disableForm}
            autoFocus
          />
        </FormControl>
        <FormControl>
          <label>{translate('PHONE_NUMBER')}</label>
          <InputWrapper>
            <Phone
              tabIndex={3}
              phone={obj.phoneNumber || ''}
              onChange={(phoneNumber) =>
                onChangeValue('phoneNumber', phoneNumber)
              }
              placeholder="전화번호를 입력하세요."
              disabled={disableForm}
              border={!disableForm}
            />
          </InputWrapper>
        </FormControl>
        <FormControl>
          <label>주민등록번호</label>
          <FlexWrapper>
            <TextField
              maxLength="6"
              tabIndex="4"
              value={(obj || {}).ssnHead1 || ''}
              onChange={(v) => onChangeValue('ssnHead1', v)}
              placeholder="앞 6자리"
              disabled={disableForm}
            />
            <Separate>_</Separate>
            <TextField
              maxLength="1"
              tabIndex="5"
              value={(obj || {}).ssnHead2 || ''}
              onChange={(v) => {
                if (!/^[0-9]*$/.test(v)) {
                  snackbar.open('alert', '숫자만 사용할 수 있습니다');
                  return;
                }

                let value = v;
                let update = {
                  ssnHead2: value,
                  // 양수(2,4,6,8)면 여자, 음수(1,3,5,7)면 남자
                  sex: value % 2 ? 'male' : 'female',
                };
                setObj((obj) => {
                  return { ...obj, ...update };
                });
              }}
              ref={ssnRef}
              disabled={disableForm}
              style={{
                width: '100px',
              }}
            />
          </FlexWrapper>
        </FormControl>
        <FormControl>
          <label>생년월일 (만 나이 자동계산)</label>
          <InputWrapper>
            <DateInput
              ref={calendar}
              tabIndex="6"
              value={obj.birthday}
              onChange={onChangePicker}
              dateFormat="yyMMdd"
              placeholder="ex ) 910826 "
              disabled={disableForm}
              popperModifiers
            />
          </InputWrapper>
        </FormControl>
        <FormControl>
          <label>{translate('SEX')}</label>
          <RadioWrapper>
            {hooks.radios({
              radios: radioItemsSex,
              obj,
              setObj,
              name: 'sex',
              tabIndex: 7,
              disabled: disableForm,
            })}
          </RadioWrapper>
        </FormControl>
        <Section>
          <AcquisitionWrapper>
            <FormControl disabled={disableForm}>
              <label>최초 내원경로 (최대 3개)</label>
              <MultiComboBox
                options={acquisitionChannelOptions}
                value={acquisitionChannelOptions.filter((o) =>
                  acquisitionChannel.map((v) => v.id).includes(o.id)
                )}
                onChange={(v) => {
                  if (v.length > 3) {
                    snackbar.open('alert', '최대 3개까지 선택 가능합니다.');
                    return;
                  }
                  setAcquisitionChannel(v);
                }}
                placeholder="내원경로를 선택하세요"
                limit={3}
                size="large"
                tabIndex="8"
                disabled={disableForm}
              />
            </FormControl>
          </AcquisitionWrapper>
          <FormControl>
            <label>소개자</label>
            <FindRecommenderInput
              tabIndex="8"
              obj={obj}
              setObj={setObj}
              disabled={disableForm}
            />
          </FormControl>
        </Section>
        <Section>
          <FormControl>
            <label>{translate('TYPE')}</label>
            <RadioWrapper>
              {hooks.radios({
                radios: radioItemsType,
                obj,
                setObj,
                name: 'type',
                tabIndex: 9,
                disabled: disableForm,
              })}
            </RadioWrapper>
          </FormControl>
          <SmsSection>
            <label>문자수신동의</label>
            <FlexWrapper
              style={{
                columnGap: '5px',
                paddingTop: '3px',
                alignItems: 'center',
              }}
            >
              <CheckboxWrapper checked={obj['smsEnabled']}>
                <Checkbox
                  checked={obj['smsEnabled']}
                  disabled={disableForm}
                  onChange={() => {
                    obj['smsEnabled'] = !obj['smsEnabled'];
                    if (obj.smsEnabled === false) {
                      obj.eventSmsEnabled = false;
                    }
                    setObj({ ...obj });
                  }}
                />
              </CheckboxWrapper>
              <label>{`${translate('SMS_ENABLED')} (`}</label>
              <CheckboxWrapper checked={obj['eventSmsEnabled']}>
                <Checkbox
                  checked={obj['eventSmsEnabled']}
                  disabled={disableForm || !obj['smsEnabled']}
                  onChange={() => {
                    if (obj.smsEnabled === false) {
                      return;
                    }
                    setObj({
                      ...obj,
                      eventSmsEnabled: !obj['eventSmsEnabled'],
                    });
                  }}
                />
              </CheckboxWrapper>
              <label>마케팅문자 포함</label>)
            </FlexWrapper>
          </SmsSection>
        </Section>
      </GridContainer>
      <MemoWrapper disabled={disableForm}>
        <label>{translate('MEMO')}</label>
        <QuillTextField
          tabIndex={12}
          value={obj.memo ?? ''}
          onChange={(v) => onChangeValue('memo', v)}
          placeholder="메모를 입력하세요."
          readOnly={disableForm}
        />
      </MemoWrapper>
    </Wrapper>
  );
};

export default BasicInfo;
