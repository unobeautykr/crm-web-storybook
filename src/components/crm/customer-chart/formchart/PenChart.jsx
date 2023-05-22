import { useState, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { color } from '~/themes/styles';

// import AddButton from './AddButton';
import { EmptiedDeleteIcon } from '~/icons/EmptiedDelete';
import { EditIcon } from '~/icons/Edit';
import { useImageEditorWindow } from '~/hooks/useImageEditorWindow';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { useApi } from '~/components/providers/ApiProvider';
import { Box, Button } from '@mui/material';
import { ReactComponent as SpinnerIcon } from '~/assets/images/icon/common/spinner.svg';
import { Folder } from '@mui/icons-material';
import { ReactComponent as ArrowUpLineSmallIcon } from '@ic/common/ic-arrow-up-line-small-16.svg';
import { BrokenFileIcon } from '~/icons/BrokenFile';

const PrevIcon = styled(ArrowUpLineSmallIcon)`
  transform: rotate(270deg);
`;

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  animation: ${Spin} 1.5s linear infinite;
`;

const ButtonWrapper = styled.div`
  opacity: 0;
  position: absolute;
  display: flex;
  gap: 4px;
  padding: 4px;
  right: 0;
  transition: 0.2s;
  button {
    width: 24px;
    height: 24px;
    background: rgb(58 58 58 / 40%);
    border-radius: 2px;
    svg {
      color: #fff;
      font-size: 12px !important;
    }
  }
`;
const Wrapper = styled.div``;
const Viewer = styled.div`
  width: 470px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;
const FileWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100px;
  &:hover {
    ${ButtonWrapper} {
      opacity: 1;
    }
  }
`;

const ThumbnailWrapper = styled('div')(() => ({
  width: 100,
  height: 72,
  border: `1px solid ${color.common.line}`,
  borderRadius: 4,
  color: color.bluegrey[600],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Thumb = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #edeff1;
  border-radius: 4px;
  background: url(${({ url }) => url});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f1f1f1;
`;

const Name = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TextWrapper = styled.div`
  margin-top: 10px;
`;

const Text = styled.span`
  font-size: 11px;
  ${({ theme }) =>
    css`
      color: ${theme.color.bluegrey[600]};
    `}
`;

const Hr = styled.hr`
  margin: 15px 0px 5px 0px;
  width: 100%;
  background: #dee2ec;
  border: 0;
  height: 1px;
`;

const Path = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;

  > button {
    min-width: auto;
    padding: 2px 4px;
  }
`;

const PrevButton = styled(Button)`
  font-family: Noto Sans KR;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  display: flex;
  align-items: center;
`;

// local file
const File = ({ data, onDelete, onEdit }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const { openLocal } = useImageEditorWindow();
  const sb = useSnackbarContext();
  const { imageApi } = useApi();
  const [broken, setBroken] = useState(false);

  const getThumb = useCallback(
    async (imageId) => {
      const resp = await imageApi.getImage(imageId);
      setImageUrl(resp.data.originalUrl);
      setThumbnailUrl(resp.data.thumbnailUrl);
      setBroken(resp.data.thumbnailStatus === 'FAILED');
    },
    [imageApi]
  );

  useEffect(() => {
    if (!data.image) return;

    if (thumbnailUrl) return;
    if (broken) return;

    const interval = setInterval(async () => {
      await getThumb(data.image.id);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [broken, data, getThumb, thumbnailUrl]);

  useEffect(() => {
    if (data.image) {
      setThumbnailUrl(data.image.thumbnailUrl);
      setImageUrl(data.image.originalUrl);
      setBroken(data.image.thumbnailStatus === 'FAILED');
    } else {
      let reader = new FileReader();
      reader.onload = () => {
        setThumbnailUrl(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(data.file);
    }
  }, [data]);

  const openEditorWindow = () => {
    if (broken) {
      sb.alert('지원하지 않는 이미지 파일입니다.');
      return;
    }

    if (!imageUrl || !thumbnailUrl) {
      sb.alert('이미지 업로드가 아직 완료되지 않았습니다.');
      return;
    }

    openLocal({
      imageUrl: imageUrl,
      name: data.name,
      onSave: onEdit,
    });
  };

  return (
    <FileWrapper onDoubleClick={openEditorWindow}>
      <ButtonWrapper>
        <button onClick={openEditorWindow}>
          <EditIcon />
        </button>
        <button onClick={onDelete}>
          <EmptiedDeleteIcon />
        </button>
      </ButtonWrapper>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: ' center',
          height: 72,
        }}
      >
        {broken && <BrokenFileIcon />}
        {thumbnailUrl && <Thumb url={thumbnailUrl} />}
        {!broken && !thumbnailUrl && (
          <Spinner>
            <SpinnerIcon width={15} />
          </Spinner>
        )}
      </Box>
      <Name>{data.name}</Name>
    </FileWrapper>
  );
};

const FolderThumb = ({ folder, onDoubleClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
      }}
      onDoubleClick={onDoubleClick}
    >
      <ThumbnailWrapper>
        <Folder sx={{ fontSize: 40 }} />
      </ThumbnailWrapper>
      <Name>{folder.name}</Name>
    </Box>
  );
};

const PenChart = ({
  files = [],
  setFiles,
  folders = [],
  setFolders,
  localFiles,
  setLocalFiles,
  localDeleteFiles,
  onEdit,
  onDelete,
  directory,
}) => {
  const { driveApi } = useApi();

  const [currentFolder, setCurrentFolder] = useState({
    id: directory?.id,
    name: directory?.name,
  });
  const [folderHistory, setFolderHistory] = useState([
    { id: directory?.id, name: directory?.name },
  ]);

  const reloadFolder = async (folder, history) => {
    const { id, name } = folder;

    if (!id) return;
    const resp = await driveApi.driveEntityList({
      parentId: id,
      limit: 1000,
    });
    setFiles(resp.data.filter((f) => f.parentId === id && f.type === 'FILE'));
    setFolders(resp.data.filter((f) => f.parentId === id && f.type === 'DIR'));
    setCurrentFolder({
      id: id,
      name: name,
    });
    if (history) {
      setFolderHistory(history);
    }
  };

  useEffect(() => {
    if (directory?.id) {
      reloadFolder({ id: directory.id, name: directory.name });
    }
  }, []);

  const getInfoText = () => {
    if (directory?.id) {
      return `∙ 통합차트 - 펜차트 ‘ ${directory.name} ’ 폴더와 연동되어 있습니다.`;
    } else {
      return `∙ 통합차트 - 펜차트탭에 연동 폴더가 자동 생성됩니다.`;
    }
  };

  const onClickPrev = () => {
    const currentIndex = folderHistory.findIndex(
      (f) => f.id === currentFolder.id
    );
    let history = [...folderHistory];
    history.splice(currentIndex);
    reloadFolder(folderHistory[currentIndex - 1], history);
  };

  return (
    <Wrapper>
      {/* <AddButton currentFolder={currentFolder} setLocalFiles={setLocalFiles} /> */}
      <TextWrapper>
        <Text>{getInfoText()}</Text>
      </TextWrapper>
      {directory?.id !== currentFolder.id && (
        <>
          <Hr />
          <Path>
            <PrevButton onClick={() => onClickPrev()}>
              <PrevIcon />
              이전
            </PrevButton>
            <Box sx={{ fontWeight: 'bold' }}>{currentFolder.name}</Box>
          </Path>
        </>
      )}
      <Viewer>
        {folders.map((v) => (
          <FolderThumb
            key={v.id}
            folder={v}
            onDoubleClick={() => {
              let history = [...folderHistory];
              history.push(v);
              reloadFolder(v, history);
            }}
          />
        ))}
        {[
          ...files.map((v) => {
            const locals = localFiles.find((f) => f.id === v.id);
            if (locals) {
              return {
                parentId: v.parentId,
                id: v.id,
                name: v.name,
                file: locals.file,
              };
            } else {
              return v;
            }
          }),
          ...localFiles.filter(
            (f) =>
              f.parentId === currentFolder.id &&
              (!f.id || files.indexOf((fi) => f.id === fi.id) > -1)
          ),
        ]
          .filter((f) => !localDeleteFiles.find((fi) => f.id === fi.id))
          .map((v) => (
            <File
              data={v}
              key={v}
              onDelete={() => onDelete(v)}
              onEdit={(data) => onEdit(v, data)}
            />
          ))}
      </Viewer>
    </Wrapper>
  );
};

File.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

FolderThumb.propTypes = {
  folder: PropTypes.object,
  onDoubleClick: PropTypes.func,
};

PenChart.propTypes = {
  files: PropTypes.array,
  setFiles: PropTypes.func,
  folders: PropTypes.array,
  setFolders: PropTypes.func,
  localFiles: PropTypes.array,
  setLocalFiles: PropTypes.func,
  localDeleteFiles: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  directory: PropTypes.object,
};

export default PenChart;
