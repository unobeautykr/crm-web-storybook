import { useState, useEffect } from 'react';
import { useApi } from '~/components/providers/ApiProvider';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';

import { readFileMime } from '~/utils/fileUtil';

const useSavePenChart = ({ formData, updateLoadingType }) => {
  const { hasPermission } = { hasPermission: () => {} };
  const sb = useSnackbarContext();

  const [localFiles, setLocalFiles] = useState([]);
  const [localDeleteFiles, setLocalDeleteFiles] = useState([]);

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState();

  const { imageApi, fileApi } = useApi();

  const onEdit = (value, data) => {
    if (value.id) {
      //기존에 저장되어있던 이미지를 수정하는 경우
      const locals = localFiles.find((f) => f.id === value.id);
      if (locals) {
        setLocalFiles((list) => {
          const index = list.findIndex((f) => f.id === value.id);
          if (index) {
            list[index] = {
              parentId: value.parentId,
              id: value.id,
              name: value.name,
              file: data,
            };
            return [...list];
          } else {
            return [
              {
                parentId: value.parentId,
                id: value.id,
                name: value.name,
                file: data,
              },
            ];
          }
        });
      } else {
        let update = [...localFiles];
        update.push({
          parentId: value.parentId,
          id: value.id,
          name: value.name,
          file: data,
        });
        setLocalFiles(update);
      }
    } else {
      //파일 추가 후 수정한 경우 (id가 없음)
      const index = localFiles.findIndex((v) => v.name === value.name);
      const update = {
        parentId: value.parentId,
        name: value.name,
        file: data,
      };
      if (index >= 0) {
        setLocalFiles((list) => {
          list[index] = update;
          return [...list];
        });
      }
    }
  };

  const onDelete = (v) => {
    if (v.id) {
      if (!hasPermission('PENCHART_DELETE')) {
        sb.alert('펜차트의 삭제 권한이 없습니다. 관리자에게 문의하세요.');
        return;
      }

      //저장파일을 삭제한경우 -> localDeleteFiles에 id 추가
      //저장파일인 경우 -> id, image, parentId, type 가지고 있음
      const fileFindIndex = localFiles.findIndex(
        (f) => f.id === v.id && f.parentId === v.parentId
      );
      if (fileFindIndex > -1) {
        //저장파일인데 수정내역이 있으면 localFiles에서도 제거
        let update = [...localFiles];
        update.splice(fileFindIndex, 1);
        setLocalFiles(update);
      }
      const file = { id: v.id, parentId: v.parentId };
      let update = [...localDeleteFiles];
      update.push(file);
      setLocalDeleteFiles(update);
    } else {
      //로컬파일을 삭제한경우 -> 로컬파일에서만 제거
      //로컬 추가만 한 파일인 경우 -> file, name, parentId 가지고 있음
      //로컬 추가 후 수정한 파일인 경우 -> file, name, parentId 가지고 있음
      const fileIndex = localFiles.findIndex(
        (f) => f.name === v.name && f.parentId === v.parentId
      );
      if (fileIndex > -1) {
        let update = [...localFiles];
        update.splice(fileIndex, 1);
        setLocalFiles(update);
      }
    }
  };

  const resetFileList = () => {
    setFiles([]);
    setFolders([]);
    setLocalFiles([]);
    setLocalDeleteFiles([]);
    updateLoadingType(null);
  };

  const createImages = async (imageFiles) => {
    updateLoadingType('create_file');
    return await Promise.all(
      imageFiles.map(async (file) => {
        const mime = await readFileMime(file.file);
        const ext = mime.split('/')[1];
        const { imageId } = await imageApi.uploadImage(file.file, ext);

        return {
          name: file.name,
          imageId: imageId,
          fileId: file.id,
        };
      })
    );
  };

  const createFileDraftIds = async (files) => {
    const localImages = await createImages(files);
    const ids = await Promise.all([
      ...localImages.map(async (img) => {
        const res = await fileApi.createFileDraft({
          name: img.name,
          imageId: img.imageId,
        });

        return { fileId: img.fileId, fileDraftId: res.data.id };
      }),
    ]);

    return ids;
  };

  const onSavePenChart = async () => {
    //서버에 저장된 파일들은,
    //수정되지 않았는지 localFiles에서 체크 /
    //삭제되지 않았는지 localDeleteFiles에서 체크 후
    //수정/삭제 되지 않은 값으로 datas 구성

    // 이미 서버에 저장된 파일들은 id만 넘기면 됨
    // 로컬이미지들은 리사이징 및 파일을 서버에 저장 후 id 생성해야 함
    if (localFiles.length === 0 && localDeleteFiles.length === 0) {
      return false;
    } else {
      let datas = [];

      //저장되어있던 파일들 중 삭제한 값이 있는 경우
      if (localDeleteFiles.length > 0) {
        datas.push(
          ...localDeleteFiles.map((v) => ({
            action: 'DELETE',
            data: {
              parentId: v.parentId,
              fileId: v.id,
            },
          }))
        );
      }

      // 추가한 파일
      let createFiles = localFiles.filter((f) => f.id === undefined);
      if (createFiles.length > 0) {
        const ids = await createFileDraftIds(createFiles);
        datas.push(
          ...createFiles.map((v, i) => ({
            action: 'CREATE',
            data: {
              parentId: v.parentId,
              parentUuid: v.parentId ? String(v.parentId) : 'ROOT',
              fileDraftId: ids[i].fileDraftId,
            },
          }))
        );
      }

      // 수정한 파일
      let updateFiles = localFiles.filter((f) => f.id !== undefined);
      if (updateFiles.length > 0) {
        const ids = await createFileDraftIds(updateFiles);
        datas.push(
          ...updateFiles.map((v) => ({
            action: 'UPDATE',
            data: {
              parentId: v.parentId,
              parentUuid: v.parentId ? String(v.parentId) : 'ROOT',
              fileId: v.id,
              fileDraftId: ids.find((f) => f.fileId === v.id).fileDraftId,
            },
          }))
        );
      }

      return datas;
    }
  };

  useEffect(() => {
    resetFileList();
  }, [formData]);

  return {
    files,
    setFiles,
    folders,
    setFolders,
    localFiles,
    setLocalFiles,
    localDeleteFiles,
    setLocalDeleteFiles,
    resetFileList,
    onEdit,
    onDelete,
    onSavePenChart,
  };
};

export default useSavePenChart;
