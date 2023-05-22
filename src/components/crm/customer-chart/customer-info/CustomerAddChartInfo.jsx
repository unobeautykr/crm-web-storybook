import { useCallback, useState, useEffect, useRef, createContext } from 'react';
import { observer } from 'mobx-react';
import hooks from '~/hooks';
import moment from 'moment';
import { useFetch } from 'use-http';
import { objectToFormData } from 'object-to-formdata';
import PropTypes from 'prop-types';
import { useDataEvent } from '~/hooks/useDataEvent';
import { useServices } from '~/hooks/useServices';
import { useDialog } from '~/hooks/useDialog';
import styled from 'styled-components';
import { EventType } from '~/store/dataEvent';
import BasicInfo from './BasicInfo';
import AddInfo from './AddInfo';
import TreatmentInfo from './TreatmentInfo';
import OtherInfo from './OtherInfo';
import { Footer } from './Footer';
import { ConfirmModal } from '~/components/modals/common/ConfirmModal';
import { TabType } from '~/core/TabUtil';
import { Button } from '~/components/Button';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { checkEmailFormat } from '~/utils/filters';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  max-height: calc(100vh - 110px);
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  padding: 10px 0px 28px 0;
`;

const ButtonWrapper = styled.div`
  margin: 10px 0;
  width: 100%;
`;

export const CustomerInfoContext = createContext({});

const CustomerAddChartInfo = ({
  customer,
  type,
  setType,
  formData,
  openWorkIn,
  onClose,
  origin,
  params,
}) => {
  const snackbar = useSnackbarContext();
  const { user } = { user: {} };
  const dataEvent = useDataEvent();
  const services = useServices();
  const confirmDialog = useDialog();
  const [counselors, setCounselors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [acquisitionChannel, setAcquisitionChannel] = useState([]);
  const [loadingBtnDisabledFlag, setLoadingBtnDisabledFlag] = useState(false);
  const [beforePhoneNumber, setBeforePhoneNumber] = useState(null);
  const inputRef = useRef();
  const ssnRef = useRef();
  const msgRef = useRef('');
  const [disableForm, setDisableForm] = useState(
    type === 'view' ? true : false
  );

  const [ssnBirthdayFirstInputCheck, setSsnBirthdayFirstInputCheck] =
    useState(false);

  const [obj, setObj] = useState(null);
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(
    origin === 'detail' ? true : false
  );

  const disabled = useCallback(
    () =>
      hooks.disabledField({
        obj,
        requiredFields: ['type', 'sex', 'smsEnabled', 'eventSmsEnabled'],
      }),
    [obj]
  );

  const configCallApi = useCallback(async () => {
    try {
      const resp = await services.crm.clinic.configs({
        groupName: 'customer',
      });

      if (resp && resp.data.length < 1) return;
      else {
        if (!customer || !customer.id)
          setObj({
            ...obj,
            type: 'domestic',
            smsEnabled: true,
            eventSmsEnabled: true,
            sex: resp.data[0].codeValue,
          });
      }
    } catch (e) {
      console.log(e.description);
    }
  }, [services.crm.clinic]);

  useEffect(() => {
    configCallApi();
  }, []);

  const { post: createImage, response: createImageResponse } =
    useFetch('/images');

  const counselorCallApi = useCallback(async () => {
    let params = { duty: '상담사', userStatus: 'active', limit: 300 };
    const resp = await services.crm.user.duty(params);
    if (!resp) return;

    setCounselors(resp.data.map((v) => ({ id: v.id, label: v.name })));
  }, [services.crm.user]);

  useEffect(() => {
    counselorCallApi();
  }, [counselorCallApi]);

  const doctorCallApi = useCallback(async () => {
    let params = { duty: '의사', userStatus: 'active', limit: 300 };
    const resp = await services.crm.user.duty(params);
    if (!resp) return;

    setDoctors(resp.data.map((v) => ({ id: v.id, label: v.name })));
  }, [services.crm.user]);

  useEffect(() => {
    doctorCallApi();
  }, [doctorCallApi]);

  const validate = () => {
    if (obj.email && !checkEmailFormat(obj.email)) return false;
    return true;
  };

  const onClickSave = useCallback(
    async (openModal) => {
      if (!validate()) {
        snackbar.open('alert', '이메일 주소를 확인해주세요.');
        setLoadingBtnDisabledFlag(false);
        return;
      }
      confirmDialog.close();
      const disabledField = disabled();
      if (disabledField) {
        setLoadingBtnDisabledFlag(false);
        snackbar.open('alert', disabledField);
        return;
      }

      if (obj.pictureFile) {
        await createImage(
          objectToFormData({
            original: obj.pictureFile,
          })
        );

        if (createImageResponse.ok) {
          obj.profileImageId = createImageResponse.data.data.id;
        }
      }

      let payload = { ...obj };
      //전화번호 '-' 제거
      if (payload.phoneNumber) {
        payload.phoneNumber = payload.phoneNumber.replace(/-/gi, '');
      }
      //주민등록번호 가공
      payload.ssnHead =
        (payload.ssnHead1 || '').trim() + (payload.ssnHead2 || '').trim();
      !payload.ssnHead && delete payload.ssnHead;
      delete payload.ssnHead1;
      delete payload.ssnHead2;

      //키, 몸무게 빈 값 일때 null 처리
      payload.weight = payload.weight === '' ? null : payload.weight;
      payload.height = payload.height === '' ? null : payload.height;
      payload.doctorId = payload.doctor?.id;
      payload.counselorId = payload.counselor?.id;
      payload.levelId = payload.level?.id ?? null;
      payload.complaintId = payload.complaint?.id ?? null;
      payload.regionId = payload.region?.id ?? null;
      payload.jobId = payload.job?.id ?? null;
      payload.email = payload.email === '' ? null : payload.email;

      if (
        payload.familyRelationships &&
        payload.familyRelationships.length > 0
      ) {
        payload.familyRelationships = payload.familyRelationships
          .filter((e) => e.name)
          .map((v) => v.id);
      }

      payload.favorites =
        favorites.length > 0 ? favorites.map((d) => d.id) : [];

      payload.acquisitionChannels =
        acquisitionChannel.length > 0
          ? acquisitionChannel.map((d) => d.id)
          : [];

      delete payload.establishmentMethod;
      if (
        payload.establishedOn === null ||
        payload.establishedOn === customer.establishedOn
      ) {
        delete payload.establishedOn;
      }
      let endpoint = !obj.id ? 'create' : 'update';
      setLoadingBtnDisabledFlag(true);
      try {
        if (endpoint === 'create') {
          const customer = await services.crm.customer.create(payload);
          snackbar.open('unoblue', '등록되었습니다.');
          onClose();
          if (openModal === 'workIn') openWorkIn(customer.data, formData);
          if (openModal === 'appointment') {
            hooks.openCustomerChartNew({
              customerId: customer?.data?.id,
              tab: TabType.appointment,
              form: { type: TabType.appointment, ...formData },
            });
          }
        } else if (endpoint === 'update') {
          // 01.21
          // 백엔드 레거시 문제로 일단 front request에서 id값만 빼서 db 반영이 안되게 처리
          let updatedId = payload.id;
          delete payload.id;
          await services.crm.customer.update_id(updatedId, payload);
          snackbar.open('unoblue', '수정되었습니다.');
          dataEvent.emit(EventType.CUSTOMER_LOAD_API);
          onClose();
        }
      } catch (e) {
        const { description } = e;
        console.log(description);
        if (e.code === 400 && e.description === 'Duplicated chart number') {
          snackbar.open(
            'alert',
            '동일한 차트번호가 존재합니다. 차트번호를 수정해 주세요.'
          );
        } else {
          snackbar.open('alert', description);
        }
        setLoadingBtnDisabledFlag(false);
      }
    },
    [
      dataEvent,
      services,
      obj,
      disabled,
      favorites,
      formData,
      acquisitionChannel,
    ]
  );

  const onCustomerCheck = async (openModal) => {
    try {
      if (obj.phoneNumber) {
        msgRef.current = '';
        let phoneNumber = obj.phoneNumber.replace(/-/gi, '');

        const resp_phone = await services.crm.customer.all({ phoneNumber });

        const phoneCheckList = resp_phone.data.filter(
          (v) => v.phoneNumber === phoneNumber
        );

        const nameCheckList = resp_phone.data.filter(
          (v) => v.name === obj.name
        );

        //팝업 메세지
        if (phoneCheckList.length > 0) {
          msgRef.current =
            '이미 등록되어있는 연락처입니다. 그래도 등록하시겠습니까?';
        }

        if (nameCheckList.length > 0) {
          msgRef.current =
            '이미 등록되있는 고객입니다. 그래도 등록하시겠습니까?';
        }
        //수정화면 , 기존 번호일 경우
        if (
          obj.id &&
          beforePhoneNumber &&
          beforePhoneNumber.replace(/-/gi, '') === phoneNumber
        )
          msgRef.current = '';

        if (msgRef.current) {
          confirmDialog.open({
            onConfirm: () => onClickSave(openModal),
          });
          setLoadingBtnDisabledFlag(false);
        } else {
          onClickSave(openModal);
        }
      } else {
        onClickSave(openModal);
      }
    } catch (e) {
      console.log(e.description);
      setLoadingBtnDisabledFlag(false);
    }
  };

  const onChangeValue = useCallback(
    (column, value) => {
      //숫자만 입력되는 항목
      if (
        (column === 'ssnHead1' || column === 'height' || column === 'weight') &&
        !/^[0-9]*$/.test(value)
      ) {
        snackbar.open('alert', '숫자만 사용할 수 있습니다');
        return;
      }

      let inputObj = {
        ...obj,
        [column]: value,
      };

      if (column === 'birthday' && !ssnBirthdayFirstInputCheck) {
        let changeValue =
          value === null ? null : moment(value).format('YYYYMMDD');

        if (changeValue === null || changeValue === '') return;
        let ssnValue = changeValue.substr(2, 8);
        inputObj.ssnHead1 = ssnValue;

        //6자리가 모두 입력되었을 때, 최초 상호연동, 그 이후 연동 안함
        setSsnBirthdayFirstInputCheck(true);
      }

      let date = '20' + value;
      let birthday = new Date(moment(date).format('YYYY-MM-DD'));
      if (
        column === 'ssnHead1' &&
        value.length === 6 &&
        !isNaN(birthday) &&
        !ssnBirthdayFirstInputCheck
      ) {
        //주민등록번호 인풋박스 포커스 이동
        ssnRef.current.focus();

        //6자리가 모두 입력되었을 때, 생년월일에 매칭
        let date = '20' + value;
        let birthday = new Date(moment(date).format('YYYY-MM-DD'));
        if (birthday > new Date()) {
          birthday.setFullYear(birthday.getFullYear() - 100);
        }

        let changeValue =
          birthday === null ? null : moment(birthday).format('YYYY-MM-DD');
        inputObj.birthday = changeValue;

        //6자리가 모두 입력되었을 때, 최초 상호연동, 그 이후 연동 안함
        setSsnBirthdayFirstInputCheck(true);
      }
      setObj(inputObj);
    },
    [obj]
  );

  useEffect(() => {
    let _obj = {};
    if (customer !== null && customer.id) {
      _obj = { ...customer };

      // 주민등록번호가 있는 경우
      if (_obj.ssnHead) {
        //7자리인 경우 slice
        if (_obj.ssnHead.length === 7) {
          _obj.ssnHead1 = _obj.ssnHead.slice(0, 6);
          _obj.ssnHead2 = _obj.ssnHead.slice(-1);
        } else {
          _obj.ssnHead1 = _obj.ssnHead;
        }
      }

      setBeforePhoneNumber(_obj.phoneNumber);

      //수정팝업에서는 주민등록번호-생년월일 상호연동하지 않음.
      setSsnBirthdayFirstInputCheck(true);
    } else {
      _obj = {
        type: 'domestic',
        sex: obj && obj.sex ? obj.sex : 'female',
        smsEnabled: true,
        eventSmsEnabled: true,
      };
    }

    if ((customer || {}).id === undefined) {
      //신규고객등록시 접속한 계정의 id가 상담사,의사 목록에 존재하면, 자동입력되도록
      if (counselors.length > 0) {
        if (counselors.findIndex((existing) => existing.id === user.id) > -1) {
          _obj['counselor'] =
            counselors[
              counselors.findIndex((existing) => existing.id === user.id)
            ];
        }
      }

      if (doctors.length > 0) {
        if (doctors.findIndex((existing) => existing.id === user.id)) {
          _obj['doctor'] =
            doctors[doctors.findIndex((existing) => existing.id === user.id)];
        }
      }
    }

    if (params?.name) {
      _obj.name = params.name;
    }

    if (params?.phoneNumber) {
      _obj.phoneNumber = params.phoneNumber;
    }

    if (params?.birthday) {
      _obj.birthday = params.birthday;
    }

    setObj({ ..._obj });
  }, [user, customer, doctors, counselors, params]);

  if (!obj) return null;

  return (
    <CustomerInfoContext.Provider
      value={{
        obj,
        setObj,
        inputRef,
        ssnRef,
        doctors,
        counselors,
        favorites,
        setFavorites,
        acquisitionChannel,
        setAcquisitionChannel,
        onChangeValue,
        type,
        setType,
        loadingBtnDisabledFlag,
        setLoadingBtnDisabledFlag,
        onCustomerCheck,
        disableForm,
        setDisableForm,
        isOpenPost,
        setIsOpenPost,
        customer,
      }}
    >
      <Wrapper
        onClick={() => {
          setIsOpenPost(false);
        }}
      >
        <Body>
          <BasicInfo />
          {!isOpenDetail && (
            <ButtonWrapper>
              <Button
                color="mix"
                styled="outline"
                size="l"
                style={{ width: '100%' }}
                onClick={() => setIsOpenDetail(true)}
              >
                + 상세입력
              </Button>
            </ButtonWrapper>
          )}
          {isOpenDetail && (
            <>
              <AddInfo />
              <TreatmentInfo />
              <OtherInfo />
            </>
          )}
        </Body>
        <Footer />
      </Wrapper>
      <ConfirmModal
        open={confirmDialog.opened}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.onConfirm}
      >
        {msgRef.current}
      </ConfirmModal>
    </CustomerInfoContext.Provider>
  );
};

CustomerAddChartInfo.propTypes = {
  customer: PropTypes.object,
  type: PropTypes.string,
  setType: PropTypes.func,
  snackbar: PropTypes.object,
  formData: PropTypes.object,
  openWorkIn: PropTypes.func,
  onClose: PropTypes.func,
  origin: PropTypes.string,
  params: PropTypes.object,
};

export default observer(CustomerAddChartInfo);
