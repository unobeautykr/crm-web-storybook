import { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { useToast } from '~/hooks/useToast';
import { useDialog } from '~/hooks/useDialog';

import Label, { LabelWrapper } from '~/components/Label2';
import { AutoCompleteSelect } from '~/components/AutoCompleteSelect';
import AddSurgeryModal from '~/components/modals/AddSurgeryModal';
import { ConfirmModal } from '~/components/modals/common/ConfirmModal';
import { unusedCode } from '~/utils/unusedCodeUtil';

const Wrapper = styled.div`
  display: grid;
  margin: 8px 0;
  row-gap: 4px;
`;

const OptionsWrapper = styled.div`
  display: flex;
  row-gap: 8px;
  flex-direction: column;
`;

const SelectWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const ListButton = styled.button`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  border-radius: 50% !important;
  margin: 0 8px;
  color: #fff;
  font-weight: bold;
`;

const AddButton = styled(ListButton)`
  background: #293142;
`;

const RemoveButton = styled(ListButton)`
  background: #eb5757;
`;

const treatmentItemCategoryUrl = () =>
  buildUrl('/treatment_items/categories', {
    limit: 10000,
    visible: true,
    orderBy: 'order asc',
  });

const defaultValue = null;
const SurgerySelect = forwardRef(({ value, onChange }, ref) => {
  const { hasPermission } = { hasPermission: () => {} };
  const toast = useToast();
  const confirmDialog = useDialog();
  const surgeryDialog = useDialog();
  const { get: getCategory, data: treatmentCategoryList = { data: [] } } =
    useFetch(treatmentItemCategoryUrl());

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const resetSelect = (i) => {
    let update = [...value];
    update[i] = defaultValue;
    onChange(update);
  };

  const onChangeCategory = (v, i) => {
    if (!v || v.onClick) {
      resetSelect(i);
      return;
    }

    let update = [...value];
    update[i] = {
      category: v,
      ...v.items.filter((d) => d.visible)[0],
    };
    onChange(update);
  };

  const onChangeItem = (v, i) => {
    let update = [...value];
    update[i] = { ...update[i], ...v };
    onChange(update);
  };

  const addList = () => {
    if (treatmentCategoryList.data.length === 0) {
      toast.error('수납코드 설정에서 시/수술을 추가해주세요.');
      return;
    }

    let update = [...value];
    update.push(defaultValue);
    if (value.length === 0) {
      update.push(defaultValue);
    }
    onChange(update);
  };

  const removeList = (i) => {
    const remove = () => {
      let update = [...value];
      update.splice(i, 1);
      onChange(update);
      confirmDialog.close();
    };

    if (!value[i]?.category) {
      remove();
    } else {
      confirmDialog.open({ onConfirm: remove });
    }
  };

  const onUpdate = async (items) => {
    if (!items) return;
    await getCategory();
    if (items) {
      let update = [...value.filter((f) => f?.id), ...items];
      onChange(update);
    }
  };

  const openPaymentCodePopup = (options) => {
    surgeryDialog.open({
      categoryId: options?.category?.id,
      afterUpdateReturn: true,
      onUpdate: onUpdate,
    });
  };

  const getItemByChangedName = (item) => {
    item.name = unusedCode.getNameByUnusedValue(item);
    return item;
  };

  return (
    <>
      <ConfirmModal
        open={confirmDialog.opened}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.onConfirm}
      >
        삭제하시겠습니까? 최종 저장 전에는 반영되지 않습니다.
      </ConfirmModal>
      <AddSurgeryModal
        open={surgeryDialog.opened}
        onClose={surgeryDialog.close}
        options={surgeryDialog}
      />
      <Wrapper ref={ref}>
        <LabelWrapper>
          <Label text="시/수술 카테고리" />
          <Label text="시/수술명" />
        </LabelWrapper>
        <OptionsWrapper>
          {(value.length === 0 ? [defaultValue] : value).map((v, i) => (
            <LabelWrapper key={i}>
              <Label>
                <AutoCompleteSelect
                  placeholder="시/수술 카테고리를 선택하세요."
                  value={v?.category ? getItemByChangedName(v.category) : null}
                  onChange={(v) => onChangeCategory(v, i)}
                  options={[
                    ...value
                      .filter(
                        (f) =>
                          f &&
                          ((!f?.category.visible && v?.id === f?.id) ||
                            (f?.category.isDeleted && v?.id === f?.id))
                      )
                      .map((f) => ({
                        ...f.category,
                        items: {
                          id: f.id,
                          name: f.name,
                          visible: f.visible,
                          isDeleted: f.isDeleted,
                        },
                      })),
                    ...treatmentCategoryList.data,
                  ]}
                  defaultOptions={
                    hasPermission('PAYMENT_CODE')
                      ? [
                          {
                            id: 'default',
                            name: '+ 시/수술 코드 생성',
                            style: { color: '#BBBBBB' },
                            onClick: () => openPaymentCodePopup(v),
                            unselectable: true,
                          },
                        ]
                      : []
                  }
                />
              </Label>
              <Label>
                <SelectWrapper>
                  <AutoCompleteSelect
                    disableClearable
                    placeholder="시/수술명을 선택하세요."
                    value={v ? getItemByChangedName(v) : null}
                    onChange={(v) => onChangeItem(v, i)}
                    options={[
                      ...value
                        .filter(
                          (f) =>
                            f &&
                            ((!f?.visible && v?.id === f?.id) ||
                              (f?.isDeleted && v?.id === f.id))
                        )
                        .map((f) => {
                          if (f) {
                            return {
                              id: f.id,
                              name: f.name,
                              visible: f.visible,
                              isDeleted: f.isDeleted,
                            };
                          }
                          return f;
                        }),
                      ...(treatmentCategoryList.data
                        .filter((o) => o.id == v?.category?.id)[0]
                        ?.items.filter((d) => d.visible) ?? []),
                    ]}
                    defaultOptions={
                      hasPermission('PAYMENT_CODE')
                        ? [
                            {
                              id: 'default',
                              name: '+ 시/수술 코드 생성',
                              style: { color: '#BBBBBB' },
                              onClick: () => openPaymentCodePopup(v),
                              unselectable: true,
                            },
                          ]
                        : []
                    }
                  />
                  {value.length === 0 || value.length - 1 === i ? (
                    <AddButton onClick={addList}>+</AddButton>
                  ) : (
                    <RemoveButton onClick={() => removeList(i)}>-</RemoveButton>
                  )}
                </SelectWrapper>
              </Label>
            </LabelWrapper>
          ))}
        </OptionsWrapper>
      </Wrapper>
    </>
  );
});

SurgerySelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default SurgerySelect;
