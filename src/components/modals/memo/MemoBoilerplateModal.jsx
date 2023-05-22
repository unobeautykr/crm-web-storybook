import { useState, useMemo, useEffect } from 'react';
import { useFetch } from 'use-http';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { buildUrl } from '~/utils/url';
import { useDialog } from '~/hooks/useDialog';
import { useToast } from '~/hooks/useToast';
import { DragTable } from '~/components/DataTable/DragTable';
import { EditButton } from '~/components/EditButton';
import Button from '~/components/Button2';
import QuillText from '~/components/quill/QuillText';
import EditMemoModal from './EditMemoModal';
import { NormalModal } from '~/components/modals/common/NormalModal';

const Body = styled('div')`
  width: 624px;
  table {
    overflow: hidden;
  }
`;

const Desc = styled('div')`
  color: #2c62f6;
  font-weight: 500;
  font-size: 12px;
`;

const ButtonWrapper = styled('div')`
  display: flex;
  column-gap: 8px;
  margin: 24px 0 16px;
  > button:first-of-type {
    margin-right: auto;
  }
`;

const MemoBoilerplateModal = ({
  open,
  onClose,
  tabName,
  onUpdate,
  updateMemoBoilerplateList,
}) => {
  const editModal = useDialog();
  const toast = useToast();
  const [list, setList] = useState([]);
  const [checked, setChecked] = useState([]);
  const {
    loading: initLoading,
    get: initGet,
    data,
  } = useFetch(
    buildUrl('boilerplate_memos', {
      limit: 1000,
      orderBy: 'order asc',
      category: tabName,
    }),
    {
      onNewData: (old, updates) => {
        if (updates.data) {
          setList(updates.data);
        }
        return updates?.data;
      },
    },
    []
  );

  const { del, response: deleteResponse } = useFetch(
    '/batch/boilerplate_memos',
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const { put: updateOrder, response: updateResponse } = useFetch(
    '/batch/boilerplate_memos',
    {
      onNewData: (old, updates) => {
        return updates?.data;
      },
    }
  );

  useEffect(() => {
    updateMemoBoilerplateList(list);
  }, [list, updateMemoBoilerplateList]);

  const dragCallback = async (list) => {
    setList(list);
    await updateOrder({
      items: list.map((v, i) => {
        return {
          category: v.category,
          contents: v.contents,
          id: v.id,
          title: v.title,
          visible: v.visible,
          order: i + 1,
        };
      }),
    });
    if (!updateResponse.ok) initGet();
  };

  const openAddModal = () => {
    editModal.open();
  };

  const openEditModal = (item) => {
    editModal.open({
      item,
    });
  };

  const onSave = () => {
    const selectContents = data
      .filter((v) => checked.includes(v.id))
      .map((v) => v.contents);
    onClose();
    onUpdate(selectContents);
  };

  const onClickDelete = async () => {
    if (checked.length === 0) {
      toast.error('삭제할 데이터를 선택하세요.');
      return;
    }

    await del({ ids: checked });
    if (deleteResponse.ok) {
      toast.success('삭제되었습니다.');
      initGet();
    }
  };

  const schema = useMemo(
    () => ({
      columns: [
        {
          id: '',
          name: '',
          component: (attr) => {
            const { item } = attr;
            return <EditButton onClick={() => openEditModal(item)} />;
          },
        },
        {
          id: 'title',
          name: '제목',
          value: (item) => item.title,
          style: {
            width: '180px',
          },
        },
        {
          id: 'contents',
          name: '내용',
          value: (item) => (
            <QuillText
              value={item.contents}
              style={{ textAlign: 'left', width: 'auto' }}
            />
          ),
          style: { minWidth: 'auto' },
          grow: true,
          drag: true,
        },
      ],
    }),
    []
  );

  return (
    <>
      {editModal.opened && (
        <EditMemoModal
          open={editModal.opened}
          onClose={editModal.close}
          item={editModal.item}
          category={tabName}
          onMemoCreated={initGet}
        />
      )}
      <NormalModal title="상용구" open={open} onClose={onClose}>
        <Body>
          <Desc>
            <p>*최상단 5개 항목은 자주 쓰는 상용구로 등록됩니다.</p>
            <p>*표 더블클릭 시 상용구가 적용됩니다.</p>
          </Desc>
          <ButtonWrapper>
            <Button type="mix" styled="outline" onClick={onClickDelete}>
              삭제
            </Button>
            <Button onClick={openAddModal}>+ 상용구 등록</Button>
            <Button
              styled="outline"
              disabled={!checked.length}
              onClick={onSave}
            >
              상용구 적용
            </Button>
          </ButtonWrapper>
          <DragTable
            styleType={'chart'}
            loading={initLoading}
            data={list}
            schema={schema}
            checked={checked}
            onChangeChecked={setChecked}
            onDoubleClickItem={(item) => {
              onUpdate([item.contents]);
              onClose();
            }}
            dragCallback={dragCallback}
          />
        </Body>
      </NormalModal>
    </>
  );
};

MemoBoilerplateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  tabName: PropTypes.string,
  onUpdate: PropTypes.func,
  updateMemoBoilerplateList: PropTypes.func,
};

export default MemoBoilerplateModal;
