import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import { styled } from '@mui/material/styles';

import { NormalModal } from '~/components/modals/common/NormalModal';
import { Label } from '~/components/Label';
import { TextInput } from '~/components/TextInput';
import { Button } from '~/components/Button';
import QuillTextField from '~/components/quill/QuillTextField';
import { toHexColorHtml } from '~/components/quill/quillUtil';

const Body = styled('div')`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const EditMemoModal = ({ item, category, open, onClose, onMemoCreated }) => {
  const [title, setTitle] = useState(item?.title ?? '');
  const [contents, setContents] = useState(item?.contents ?? '');
  const { post, put, response } = useFetch('/boilerplate_memos');

  const onSave = async () => {
    let data = {
      category: category,
      title: title,
      contents: toHexColorHtml(contents),
      visible: true,
    };
    if (item?.id) {
      data.id = item.id;
      data.order = item.v;
      await put(`/${item.id}`, data);
    } else {
      await post(data);
    }

    if (response.ok) {
      onClose();
      onMemoCreated();
    }
  };

  return (
    <NormalModal
      paperSx={{ width: '534px' }}
      title={item?.id ? '상용구 수정' : '상용구 등록'}
      onClose={onClose}
      open={open}
      footer={
        <>
          <Button color="mix" styled="outline" onClick={onClose}>
            닫기
          </Button>
          <Button disabled={!title && !contents} onClick={onSave}>
            저장
          </Button>
        </>
      }
    >
      <Body>
        <Label text="제목" isRequire>
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="제목을 입력하세요"
          />
        </Label>
        <Label text="내용" isRequire>
          <QuillTextField
            style={{
              maxHeight: '340px',
              overflow: 'auto',
            }}
            value={contents}
            onChange={setContents}
            placeholder="메모를 입력하세요."
          />
        </Label>
      </Body>
    </NormalModal>
  );
};

EditMemoModal.propTypes = {
  item: PropTypes.object,
  category: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onMemoCreated: PropTypes.func,
};

export default EditMemoModal;
