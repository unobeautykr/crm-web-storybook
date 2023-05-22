import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import update from 'immutability-helper';

import { translate } from '~/utils/filters';
import { useDialog } from '~/hooks/useDialog';
import { useToast } from '~/hooks/useToast';
import { buildUrl } from '~/utils/url';

import AddCategoryModal from './AddCategoryModal';
import { WriteTable } from '~/components/DataTable/WriteTable';
import { Checkbox } from '~/components/Checkbox/Checkbox';
import Label from '~/components/Label2';
import NativeSelect, { SmallWrapper } from '~/components/NativeSelect2';
import TextInput from '~/components/TextInput2';
import NumberInput from '~/components/NumberInput';
import PriceInput from '~/components/PriceInput';
import Button from '~/components/Button2';

const Body = styled.div`
  min-height: 520px;
`;

const SaveButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 32px;
  column-gap: 8px;
  margin-bottom: 16px;
  > button {
    min-width: 120px;
    height: 100%;
    padding: 4px 16px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 3px;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 16px;
  width: 70%;
  height: 30px;
  column-gap: 8px;
  margin-bottom: 16px;
`;

const AddButtonWrapper = styled.div`
  margin-top: 8px;
  button {
    width: 100%;
  }
`;

const RemoveButton = styled.button`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  border-radius: 50% !important;
  color: #fff;
  font-weight: bold;
  line-height: 0;
  background: #eb5757;
`;

const InputWrapper = styled.div`
  width: 100%;
  min-width: ${({ width }) => width};
`;

const dayOptions = [
  { id: '1', name: '1일 후' },
  { id: '2', name: '2일 후' },
  { id: '3', name: '3일 후' },
  { id: '4', name: '4일 후' },
  { id: '5', name: '5일 후' },
  { id: '6', name: '6일 후' },
  { id: '7', name: '7일 후' },
  { id: '15', name: '15일 후' },
  { id: '30', name: '1개월 후' },
  { id: '60', name: '2개월 후' },
  { id: '90', name: '3개월 후' },
  { id: '120', name: '4개월 후' },
  { id: '150', name: '5개월 후' },
  { id: '180', name: '6개월 후' },
  { id: '210', name: '7개월 후' },
  { id: '240', name: '8개월 후' },
  { id: '270', name: '9개월 후' },
  { id: '300', name: '10개월 후' },
  { id: '330', name: '11개월 후' },
  { id: '360', name: '12개월 후' },
];

export const AddSurgeryModalContent = ({ options, onClose }) => {
  const { get: getCategoryList, data: categoryList } = useFetch(
    buildUrl('/treatment_items/categories', {
      limit: 1000,
      orderBy: 'order asc',
    }),
    []
  );
  const { post, response } = useFetch('/batch/treatment_items');
  const toast = useToast();
  const categoryDialog = useDialog();

  const [initItem] = useState({
    idx: 0,
    name: '',
    nextDay: 0,
    nextMonth: 0,
    vatExclusivePrice: 0,
    price: 0,
    treatmentCount: 1,
    vatFree: true,
  });
  const [items, setItems] = useState([{ ...initItem }]);
  const [category, setCategory] = useState(options.categoryId);

  const validator = useCallback(() => {
    const errorString = translate('ERROR_MISSING_FIELD');
    if (!category) {
      toast.error(errorString.replace(/%s/, translate('SURGERY_CATEGORIES')));
      return false;
    }

    if (items.find((v) => !v.name)) {
      toast.error(errorString.replace(/%s/, translate('SURGERY_ITEM_NAMES')));
      return false;
    }
    return true;
  }, [category, items, toast]);

  const onChangeItem = (index, updateObj) => {
    setItems((items) => {
      return update(items, { [index]: { $merge: updateObj } });
    });
  };

  const onChangeVatFree = useCallback(
    (index, value) => {
      const match = items[index];
      const updateObj = {
        vatFree: value,
        vatExclusivePrice: value ? match.price : Math.round(match.price / 1.1),
      };

      onChangeItem(index, updateObj);
    },
    [items]
  );

  const onChangePrice = useCallback(
    (index, value) => {
      const match = items[index];
      const updateObj = {
        price: value,
        vatExclusivePrice: match.vatFree ? value : Math.round(value / 1.1),
      };

      onChangeItem(index, updateObj);
    },
    [items]
  );

  const onChangeVatExclusivePrice = useCallback(
    (index, value) => {
      const match = items[index];
      const updateObj = {
        price: match.vatFree ? value : Math.round(value * 1.1),
        vatExclusivePrice: value,
      };

      onChangeItem(index, updateObj);
    },
    [items]
  );
  const addItem = () => {
    setItems((items) => {
      items.unshift(initItem);
      return items.map((v, i) => {
        v.idx = i;
        return { ...v };
      });
    });
  };

  const resetItem = useCallback(() => {
    let update = [initItem];
    setItems(update);
  }, [initItem]);

  const removeItem = (idx) => {
    setItems((items) => {
      return items
        .filter((v) => v.idx !== idx)
        .map((v, i) => {
          v.idx = i;
          return { ...v };
        });
    });
  };

  const onClickSave = useCallback(
    async (categoryList) => {
      let targetCategory = categoryList.data.find((v) => v.id === category);
      if (validator()) {
        let data = {
          items: items.map((v, i) => {
            return {
              categoryId: category,
              name: v.name,
              nextDay: v.nextDay,
              nextMonth: v.nextMonth,
              price: v.price,
              treatmentCount: v.treatmentCount,
              vatExclusivePrice: v.vatExclusivePrice,
              vatFree: v.vatFree,
              visible: v.visible,
              order: targetCategory.items.length + i + 1,
            };
          }),
        };

        await post(data);
        if (response.ok) {
          toast.success('업데이트되었습니다.');
          if (options?.afterUpdateReturn) {
            onClose();
            options.onUpdate(
              response.data.data.ids.map((v, i) => {
                return {
                  category: {
                    id: targetCategory.id,
                    name: targetCategory.name,
                  },
                  id: v,
                  name: items[i].name,
                };
              })
            );
          } else {
            onClose();
            options.onSurgeryCreated();
          }
        } else {
          if (response.status === 409) {
            toast.error('중복된 카테고리가 있습니다.');
          }
        }
      }
    },
    [validator, category, items, post, response, toast, options, onClose]
  );

  const openAddCategoryModal = () => {
    categoryDialog.open();
  };

  const schema = useMemo(
    () => ({
      columns: [
        {
          id: 'name',
          name: '시/수술명',
          grow: true,
          required: true,
          value: (item) => {
            return (
              <TextInput
                value={item.name}
                onChange={(v) => onChangeItem(item.idx, { name: v })}
                placeholder="시/수술명을 입력해주세요."
              />
            );
          },
          style: {
            width: '260px',
          },
        },
        {
          id: 'treatmentCount',
          name: '시/수술횟수',
          required: true,
          value: (item) => {
            return (
              <NumberInput
                value={item.treatmentCount}
                onChange={(v) => onChangeItem(item.idx, { treatmentCount: v })}
                max={30}
                unit="회"
              />
            );
          },
        },
        {
          id: 'nextDay',
          name: '적정시술주기',
          required: true,
          value: (item) => {
            return (
              <SmallWrapper>
                <NativeSelect
                  options={dayOptions}
                  placeholder="없음"
                  value={item.nextDay || item.nextMonth * 30}
                  onChange={(v) =>
                    onChangeItem(
                      item.idx,
                      v
                        ? Number(v) < 30
                          ? { nextDay: Number(v), nextMonth: 0 }
                          : { nextDay: 0, nextMonth: Number(v) / 30 }
                        : { nextDay: 0, nextMonth: 0 }
                    )
                  }
                />
              </SmallWrapper>
            );
          },
        },
        {
          id: 'vatFree',
          name: '과세',
          required: true,
          value: (item) => {
            return (
              <Checkbox
                checked={!item.vatFree}
                onChange={(e) => onChangeVatFree(item.idx, !e.target.checked)}
              />
            );
          },
        },
        {
          id: 'price',
          name: '금액',
          required: true,
          value: (item) => {
            return (
              <InputWrapper>
                <PriceInput
                  value={item.price}
                  onChange={(v) => onChangePrice(item.idx, v)}
                />
              </InputWrapper>
            );
          },
          style: {
            width: '80px',
          },
        },
        {
          id: 'vatExclusivePrice',
          name: 'VAT제외',
          value: (item) => {
            return (
              <InputWrapper>
                <PriceInput
                  value={item.vatExclusivePrice}
                  onChange={(v) => onChangeVatExclusivePrice(item.idx, v)}
                />
              </InputWrapper>
            );
          },
          style: {
            width: '80px',
          },
        },
        {
          column: 'remove',
          value: (item) => {
            return (
              <RemoveButton
                onClick={() =>
                  items.length === 1 ? resetItem() : removeItem(item.idx)
                }
              >
                -
              </RemoveButton>
            );
          },
        },
      ],
    }),
    [
      items,
      onChangePrice,
      onChangeVatExclusivePrice,
      onChangeVatFree,
      resetItem,
    ]
  );

  return (
    <>
      <AddCategoryModal
        open={categoryDialog.opened}
        onClose={categoryDialog.close}
        onCategoryCreated={getCategoryList}
      />
      <Body>
        <SaveButtonWrapper>
          <Button size="l" onClick={() => onClickSave(categoryList)}>
            코드 저장
          </Button>
        </SaveButtonWrapper>
        <Label text="카테고리" isRequire>
          <SearchWrapper>
            <NativeSelect
              value={category}
              onChange={(v) => setCategory(Number(v))}
              options={categoryList?.data}
              placeholder="시/수술 카테고리를 선택해주세요"
              isRequire
            />
            <Button
              type="secondary"
              styled="outline"
              onClick={() => openAddCategoryModal()}
            >
              카테고리 추가
            </Button>
          </SearchWrapper>
        </Label>
        <WriteTable styleType={'chart'} data={items} schema={schema} fixHead />
        <AddButtonWrapper>
          <Button styled="outline" size="s" onClick={addItem}>
            + 입력란 추가
          </Button>
        </AddButtonWrapper>
      </Body>
    </>
  );
};

AddSurgeryModalContent.propTypes = {
  options: PropTypes.object,
  onClose: PropTypes.func,
};
