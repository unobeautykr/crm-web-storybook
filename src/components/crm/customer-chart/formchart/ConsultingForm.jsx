import { useState, useContext, useEffect, useMemo } from 'react';
import { useForm, useFormState, Controller } from 'react-hook-form';
import moment from 'moment';
import { useDataEvent } from '~/hooks/useDataEvent';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { EventType } from '~/store/dataEvent';
import { TabType } from '~/core/TabUtil';

import { useUpdateCustomer } from '~/hooks/useUpdateCustomer';
import { useRegistration } from '~/hooks/useRegistration';
import { useLoadingMsg } from '~/hooks/useLoadingMsg';
import { LoadingModal } from '~/components/modals/common/LoadingModal';
import CustomerDefaultField from './CustomerDefaultField';
import Label from '~/components/Label2';
import CounselorSelect from '../CounselorSelect';
import ConsultingResultSelect from './ConsultingResultSelect';
import Memo from '../Memo';
import SurgerySelect from './SurgerySelect';
import SaveButton from '../SaveButton';
import useSavePenChart from '~/hooks/useSavePenChart';
import PenChart from './PenChart';
import { toHexColorHtml } from '~/components/quill/quillUtil';
import NextStepButton from '../NextStepButton';
import { NextStepSelectModal } from '~/components/modals/NextStepSelectModal';
import { useDialog } from '~/hooks/useDialog';
import { isConfirmInactiveValue } from '~/hooks/useFormSelect';
import { useApi } from '~/components/providers/ApiProvider';

const ConsultingForm = () => {
  const nextModal = useDialog();
  const dataEvent = useDataEvent();
  const {
    customer,
    originFormData,
    formData,
    setEditingForm,
    closeForm,
    reloadChart,
    connectRegistration,
    snackbar,
  } = useContext(CustomerChartContext);
  const { consultingsApi } = useApi();
  const [loadingType, setLoadingType] = useState(null);
  const { loadingMsg } = useLoadingMsg({ loadingType });

  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: Object.assign(
      {
        date: moment(),
        counselor:
          customer.counselor?.status === 'active'
            ? customer.counselor?.id ?? null
            : null,
        saveCustomer: false,
        surgery: [],
        result: null,
        memo: '',
      },
      formData
    ),
  });
  const { isDirty, isSubmitting } = useFormState({
    control,
  });

  const watchSaveCustomerOptions = watch(['counselor']);
  const watchNextStep = watch('nextStep');

  const { updateRegistration, isOpenNextSelectModal, registrationValidate } =
    useRegistration({
      registrationId: connectRegistration?.id,
    });
  const { updateCustomer } = useUpdateCustomer({
    customerId: customer.id,
    callback: () => dataEvent.emit(EventType.CUSTOMER_LOAD_API),
  });

  const customerDefaultFieldList = useMemo(() => {
    let update = [];
    const counselor = getValues('counselor');

    if (counselor && !(customer.counselor?.id == counselor))
      update.push('COUNSELOR');

    return update;
  }, [watchSaveCustomerOptions]);

  const {
    files,
    setFiles,
    folders,
    setFolders,
    localFiles,
    setLocalFiles,
    localDeleteFiles,
    onEdit,
    onDelete,
    onSavePenChart,
  } = useSavePenChart({
    updateLoadingType: setLoadingType,
    formData: formData,
  });

  useEffect(() => {
    if (connectRegistration && !connectRegistration.invalid) {
      setValue('date', connectRegistration.date);
      if (
        isConfirmInactiveValue(originFormData, connectRegistration, 'counselor')
      ) {
        setValue('counselor', null);
      } else {
        setValue('counselor', connectRegistration.counselor?.id);
      }
    } else {
      setValue('nextStep', '');
    }
  }, [setValue, connectRegistration]);

  useEffect(() => {
    setEditingForm(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (formData.id) {
      setValue('counselor', formData.counselor ?? null);
    }
    setLoadingType(null);
  }, [formData]);

  const getFormData = () => {
    let data = getValues();
    return {
      counselorId: data.counselor,
      customerId: customer.id,
      memo: toHexColorHtml(data.memo),
      resultId: data.result,
      date: moment(formData.date).format('YYYY-MM-DD'),
      treatmentItemIds: data.surgery.filter((v) => v?.id).map((v) => v.id),
    };
  };

  const onSave = async (data, registrationPayload) => {
    let payload = {
      customerId: data.customerId,
      counselorId: data.counselorId,
      ...registrationPayload,
    };

    if (connectRegistration == null || connectRegistration?.invalid) {
      payload.date = data.date;
    } else {
      payload.startAt = moment(
        `${data.date} ${connectRegistration.startHour}`
      ).format('YYYY-MM-DD HH:mm');
      payload.endAt = moment(
        `${data.date} ${connectRegistration.endHour}`
      ).format('YYYY-MM-DD HH:mm');
    }

    const registrationId = await updateRegistration(
      payload,
      connectRegistration?.invalid
    );
    let registrationMessage = registrationValidate(registrationId);
    if (registrationMessage) {
      snackbar.open('alert', registrationMessage);
      return;
    }
    data.registrationId = registrationId;
    let response = null;
    if (formData?.id) {
      setLoadingType('form_edit');
      try {
        response = await consultingsApi.update(formData.id, data);
      } catch (e) {
        if (e.code === 404) {
          snackbar.alert('삭제된 차트입니다. 취소 후 등록해주세요.');
          return;
        }
      }
    } else {
      setLoadingType('form_save');
      response = await consultingsApi.create(data);
    }

    if (getValues('saveCustomer')) {
      await updateCustomer({
        counselorId: data.counselorId,
      });
    }
    if (response?.data?.id) {
      snackbar.success(
        `상담을 ${formData?.id ? '수정' : '생성'}했습니다. ${
          connectRegistration?.id ? '연결된 접수정보가 업데이트 됩니다.' : ''
        }`
      );
      closeForm(false);
      reloadChart(TabType.consulting);
    }
    setLoadingType(null);
  };

  const onSaveForm = async () => {
    let data = getFormData();
    const fileData = await onSavePenChart();
    if (fileData) {
      data.datas = [...fileData];
    }

    let nextStep = watchNextStep;
    if (!formData?.id) {
      const open = isOpenNextSelectModal(nextStep, connectRegistration);
      let registrationPayload = {};
      if (nextStep !== '') {
        registrationPayload.status = nextStep;
      }
      if (open) {
        nextModal.open({
          onCancel: () => {
            nextModal.close();
            onSave(data, registrationPayload);
          },
          onConfirm: (payload) => {
            nextModal.close();
            onSave(data, { ...registrationPayload, ...payload });
          },
        });
      } else {
        await onSave(data, registrationPayload);
      }
    } else {
      await onSave(data);
    }
    setLoadingType(null);
  };

  return (
    <>
      <LoadingModal show={loadingType} msg={loadingMsg} />
      <Label
        text="상담사"
        connect={connectRegistration && !connectRegistration?.invalid}
      >
        <Controller
          name="counselor"
          control={control}
          render={({ field }) => (
            <CounselorSelect
              {...field}
              originValue={originFormData?.registration?.counselor}
            />
          )}
        />
        {customerDefaultFieldList.length > 0 && (
          <Controller
            name="saveCustomer"
            control={control}
            render={({ field }) => (
              <CustomerDefaultField
                {...field}
                name={customerDefaultFieldList}
              />
            )}
          />
        )}
      </Label>
      <Controller
        name="surgery"
        control={control}
        render={({ field }) => <SurgerySelect {...field} />}
      />
      <Label text="상담결과">
        <Controller
          name="result"
          control={control}
          render={({ field }) => (
            <ConsultingResultSelect
              {...field}
              originValue={originFormData?.result}
            />
          )}
        />
      </Label>
      <Label text="상담내용">
        <Controller
          name="memo"
          control={control}
          render={({ field }) => <Memo {...field} tabName="consulting" />}
        />
      </Label>
      {!formData?.id &&
        !connectRegistration?.invalid &&
        connectRegistration?.category &&
        connectRegistration?.category !== 'NONE' && (
          <>
            <Controller
              name="appointmentStatus"
              control={control}
              render={({ field }) => (
                <NextStepButton
                  {...field}
                  tabName={connectRegistration.category}
                  valueList={[
                    '',
                    'TREATMENT_WAITING',
                    'PAYMENT_WAITING',
                    'SURGERY_WAITING',
                    'LEAVE',
                    `${connectRegistration.category}_DONE`,
                  ]}
                  onChange={(value) => setValue('nextStep', value)}
                  value={watch('nextStep')}
                />
              )}
            />
          </>
        )}
      <Label text="펜차트">
        <PenChart
          files={files}
          setFiles={setFiles}
          folders={folders}
          setFolders={setFolders}
          localFiles={localFiles}
          setLocalFiles={setLocalFiles}
          localDeleteFiles={localDeleteFiles}
          onEdit={onEdit}
          onDelete={onDelete}
          directory={formData.directory}
        />
      </Label>
      <SaveButton
        onClose={closeForm}
        onClick={handleSubmit(onSaveForm)}
        disabled={isSubmitting}
      >
        {formData.id ? '수정완료' : '저장'}
      </SaveButton>
      <NextStepSelectModal
        open={nextModal.opened}
        onClose={() => nextModal.close()}
        type={watchNextStep}
        registration={connectRegistration}
        onCancel={nextModal.onCancel}
        onConfirm={nextModal.onConfirm}
      />
    </>
  );
};

export default ConsultingForm;
