import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFetch } from 'use-http';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import update from 'immutability-helper';
import { observer } from 'mobx-react';
import { useToast } from '~/hooks/useToast';
import { buildUrl } from '~/utils/url';

import { NormalModal } from './common/NormalModal';
import Label from '~/components/Label2';
import TextInput from '~/components/TextInput2';
import Button from '~/components/Button2';
import { EditButton } from '~/components/EditButton';
import { DataTable } from '~/components/DataTable/DataTable';

const Body = styled.div`
  width: 480px;
  min-height: 520px;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 16px;
  width: 100%;
  height: 30px;
  column-gap: 6px;
  margin-bottom: 16px;
`;

const EditWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  column-gap: 8px;
`;

const EditButtonWrapper = styled.div`
  display: flex;
  column-gap: inherit;
  button {
    width: 50px;
    height: 100%;
    border: 1px solid;
    font-size: 12px;
    padding: 0;
  }
`;

const AddCategoryModal = ({ open, onClose, onCategoryCreated }) => {
  const toast = useToast();
  const [categoryList, setCategoryList] = useState([]);
  const [editHistory, setEditHistory] = useState([]);
  const [createInputValue, setCreateInputValue] = useState('');

  const { loading, data } = useFetch(
    buildUrl('/treatment_items/categories', {
      limit: 1000,
      orderBy: 'createdAt desc',
    }),
    []
  );
  const { post, put, response } = useFetch('/treatment_items/categories');

  useEffect(() => {
    setCategoryList(data?.data);
  }, [data]);

  const validator = useCallback(
    (name, edit) => {
      if (!name.length) {
        if (edit) toast.error('수정할 카테고리명을 입력하세요.');
        else toast.error('추가할 카테고리명을 입력하세요.');
        return false;
      }

      //중복 체크 시 공백제거 하여 비교
      const checkName = categoryList.filter(
        (v) => (v.name || '').replace(' ', '') === (name || '').replace(' ', '')
      );
      if (checkName.length) {
        toast.error('중복된 카테고리가 있습니다.');
        return false;
      }
      return true;
    },
    [categoryList]
  );

  const createCategory = async () => {
    if (validator(createInputValue)) {
      await post({
        name: createInputValue,
        visible: true,
      });

      if (response.ok) {
        toast.success('생성되었습니다.');
        close();
        onCategoryCreated();
      } else {
        if (response.status === 409) {
          toast.error('중복된 카테고리가 있습니다.');
        }
      }
    }
  };

  const editName = async (id) => {
    const value = editHistory.find((v) => v.id === id).name;
    if (!value) {
      removeEditHistory(id);
      toast.success('업데이트되었습니다.');
      return;
    }

    if (validator(value, true)) {
      await put(`/${id}`, {
        id: id,
        name: value,
      });
      if (response.ok) {
        setCategoryList((list) => {
          return list.map((v) => {
            if (v.id === id) {
              if (value) v.name = value;
            }
            return v;
          });
        });
        removeEditHistory(id);
        toast.success('업데이트되었습니다.');
      } else {
        if (response.status === 409) {
          toast.error('중복된 카테고리가 있습니다.');
        }
      }
    }
  };

  const updateEditHistory = (obj) => {
    setEditHistory((list) => {
      const editIdx = list.findIndex((v) => v.id === obj.id);
      if (editIdx === -1) {
        return update(list, { $push: [obj] });
      } else {
        return update(list, { [editIdx]: { $merge: obj } });
      }
    });
  };

  const removeEditHistory = (id) => {
    setEditHistory((list) => list.filter((v) => v.id !== id));
  };

  const schema = useMemo(
    () => ({
      columns: [
        {
          id: '',
          name: '',
          value: (item) => (
            <EditButton onClick={() => updateEditHistory({ id: item.id })} />
          ),
        },
        {
          id: 'treatmentCount',
          name: '카테고리명',
          grow: true,
          value: (item) =>
            editHistory.find((v) => v.id === item.id) ? (
              <EditWrapper>
                <TextInput
                  defaultValue={item.name}
                  onChange={(v) => updateEditHistory({ id: item.id, name: v })}
                />
                <EditButtonWrapper>
                  <Button
                    type="primary"
                    styled="outline"
                    onClick={() => editName(item.id)}
                  >
                    완료
                  </Button>
                  <Button
                    type="alert"
                    styled="outline"
                    onClick={() => removeEditHistory(item.id)}
                  >
                    취소
                  </Button>
                </EditButtonWrapper>
              </EditWrapper>
            ) : (
              item.name
            ),
        },
      ],
    }),
    [editHistory]
  );

  return (
    <NormalModal title="카테고리 추가" open={open} onClose={() => onClose()}>
      <Body>
        <Label text="카테고리" isRequire>
          <SearchWrapper>
            <TextInput
              value={createInputValue}
              onChange={setCreateInputValue}
              placeholder="추가할 카테고리명을 입력하세요."
              isRequire
            />
            <Button onClick={() => createCategory()}>저장</Button>
          </SearchWrapper>
        </Label>
        <DataTable
          styleType={'chart'}
          loading={loading}
          data={categoryList ?? []}
          schema={schema}
        />
      </Body>
    </NormalModal>
  );
};

AddCategoryModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCategoryCreated: PropTypes.func,
};

export default observer(AddCategoryModal);
