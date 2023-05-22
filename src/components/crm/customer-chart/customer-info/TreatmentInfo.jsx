import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useServices } from '~/hooks/useServices';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import Label from '~/components/Label2';
import moment from 'moment';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import DateInput from '~/components/DateInput';
import { UnderlineButton } from '~/components/UnderlineButton';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { MultiComboBox } from '~/components/MultiComboBox';
import { ComboBox } from '~/components/ComboBox';
import { unusedCode } from '~/utils/unusedCodeUtil';
import { getOptions } from '~/hooks/useFormSelect';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
`;

const FlexWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

const TreatmentInfo = () => {
  const {
    obj,
    setObj,
    doctors,
    counselors,
    favorites,
    setFavorites,
    disableForm,
    type,
    customer,
  } = useContext(CustomerInfoContext);
  const [originValue] = useState(obj);
  const snackbar = useSnackbarContext();
  const services = useServices();
  const [favoriteOptions, setFavoriteOptions] = useState([]);
  const [establishedDateInputFlag, setEstablishedDateInputFlag] = useState(
    true
  );

  const { data: levelList } = useFetch(
    buildUrl('/customers/levels', {
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

  const treatmentItemCategoriesCallApi = useCallback(async () => {
    try {
      let params = { limit: 10000, visible: true, orderBy: 'order asc' };
      const resp = await services.crm.treatment.categories.items_categories_v2(
        params
      );
      if (!resp) return;
      let options = [...resp.data];
      if (obj.favorites) {
        let unusedFavorites = [
          ...obj.favorites
            .filter((f) => !f.visible && !f.isDeleted)
            .map((v) => ({
              ...v,
              name: unusedCode.unusedCodeValue + v.name,
            })),
          ...obj.favorites
            .filter((f) => f.isDeleted)
            .map((v) => ({
              ...v,
              name: unusedCode.deletedCodeValue + v.name,
            })),
        ];
        options.unshift(...unusedFavorites);
      }

      setFavoriteOptions(
        options.map((v) => {
          return { label: v.name, id: v.id };
        })
      );
      if (obj.favorites && obj.favorites.length > 0) {
        setFavorites([
          ...obj.favorites.map((v) => {
            return { label: v.name, id: v.id };
          }),
        ]);
      }
    } catch (e) {
      console.log(e.description);
    }
  }, [services.crm.treatment.categories]);

  useEffect(() => {
    treatmentItemCategoriesCallApi();
  }, [treatmentItemCategoriesCallApi]);

  const counselorOptions = useMemo(() => {
    return getOptions(counselors, originValue?.counselor).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [counselors, originValue.counselor]);

  const doctorOptions = useMemo(() => {
    return getOptions(doctors, originValue?.doctor).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [doctors, originValue.doctor]);

  const levelOptions = useMemo(() => {
    if (!levelList) return [];
    return getOptions(levelList, originValue?.level).map((v) => ({
      ...v,
      label: v.name ?? v.label,
    }));
  }, [levelList, originValue?.level]);

  return (
    <Wrapper>
      <Title>진료정보</Title>
      <FlexWrapper>
        <FormControl>
          <Label text="담당상담사">
            <ComboBox
              tabIndex="16"
              value={counselorOptions?.find((f) => f.id === obj?.counselor?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  counselor: { id: v ? v.id : null },
                });
              }}
              placeholder="상담사를 선택하세요"
              disabled={disableForm}
              options={counselorOptions}
              getOptionLabel={(option) => option.label ?? ''}
            />
          </Label>
        </FormControl>
        <FormControl>
          <Label text="담당의사">
            <ComboBox
              tabIndex="17"
              value={doctorOptions?.find((f) => f.id === obj?.doctor?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  doctor: { id: v ? v.id : null },
                });
              }}
              placeholder="의사를 선택하세요"
              disabled={disableForm}
              options={doctorOptions}
              getOptionLabel={(option) => option.label ?? ''}
            />
          </Label>
        </FormControl>
        <FormControl disabled={disableForm}>
          <label>관심항목 (최대 3개)</label>
          <MultiComboBox
            options={favoriteOptions}
            value={favoriteOptions.filter((o) =>
              favorites.map((v) => v.id).includes(o.id)
            )}
            onChange={(v) => {
              if (v.length > 3) {
                snackbar.open('alert', '최대 3개까지 선택 가능합니다.');
                return;
              }
              setFavorites(v);
            }}
            placeholder="관심항목을 선택하세요"
            limit={3}
            size="medium"
            tabIndex="18"
            disabled={disableForm}
          />
        </FormControl>
      </FlexWrapper>
      <FlexWrapper>
        <FormControl>
          <Label text="고객등급">
            <ComboBox
              tabIndex="19"
              value={levelOptions?.find((f) => f.id === obj?.level?.id)}
              onChange={(v) => {
                setObj({
                  ...obj,
                  level: { id: v ? v.id : null },
                });
              }}
              placeholder="고객등급을 선택하세요"
              disabled={disableForm}
              options={levelOptions}
            />
          </Label>
        </FormControl>
        <FormControl>
          {type !== 'create' && (
            <>
              <LabelWrapper>
                <div style={{ display: 'flex' }}>
                  <label>신환 구분일</label>
                  {obj.establishmentMethod === 'MANUAL' && (
                    <div style={{ color: '#A1B1CA' }}>*변경됨</div>
                  )}
                </div>

                {!disableForm && (
                  <UnderlineButton
                    size="s"
                    color="primary"
                    onClick={() => {
                      if (!disableForm) {
                        if (!establishedDateInputFlag) {
                          const resetEstablishedOn =
                            customer.establishedOn === null
                              ? null
                              : moment(customer.establishedOn).format(
                                  'YYYY-MM-DD'
                                );
                          setObj({
                            ...obj,
                            establishedOn: resetEstablishedOn,
                          });
                        }
                        setEstablishedDateInputFlag(!establishedDateInputFlag);
                      }
                    }}
                  >
                    {establishedDateInputFlag ? '변경' : '취소'}
                  </UnderlineButton>
                )}
              </LabelWrapper>
              <InputWrapper>
                <DateInput
                  value={obj.establishedOn}
                  onChange={(v) => {
                    if (!v) {
                      snackbar.alert(
                        '신환구분일은 삭제할 수 없습니다. 필요 시 일자를 변경하세요.'
                      );
                      return;
                    }
                    setObj({
                      ...obj,
                      establishedOn: moment(v).format('YYYY-MM-DD'),
                    });
                  }}
                  dateFormat="yyyy-MM-dd"
                  disabled={disableForm || establishedDateInputFlag}
                  popperModifiers
                />
              </InputWrapper>
            </>
          )}
        </FormControl>
      </FlexWrapper>
    </Wrapper>
  );
};

export default TreatmentInfo;
