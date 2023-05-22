import { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import { useLoadPenchartModal } from '~/components/modals/LoadPenchartModal';
import { useApi } from '~/components/providers/ApiProvider';
import { PenchartType } from '~/core/PenchartType';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { PenchartAddFileButton } from '~/components/common/PenchartAddFileButton';
import { PenchartOpenSampleChartButton } from '~/components/common/PenchartOpenSampleChartButton';
import { useSelectImages } from '~/hooks/useSelectImages';

const Wrapper = styled.div``;

const AddButton = ({ currentFolder, setLocalFiles }) => {
  const { clinic } = { clinic: {} };
  const sb = useSnackbarContext();
  const ref = useRef();
  const inputFile = useRef(null);
  const loadPenchartModal = useLoadPenchartModal();
  const { driveApi, fileApi } = useApi();
  const { select } = useSelectImages();

  const openCreateFile = () => {
    inputFile.current.click();
  };

  const openPenChartSample = async () => {
    const res = await driveApi.getClinicDrive(clinic.id);
    const driveId = res.data.id;

    loadPenchartModal.open({
      driveId: driveId,
      selectableTypes: [PenchartType.file],
      onComplete: async (entityIds) => {
        const files = await Promise.all(
          entityIds.map(async (id) => {
            const res = await fileApi.getFile(id);
            const blob = await (await fetch(res.data.image.originalUrl)).blob();
            return new File([blob], res.data.name);
          })
        );

        setLocalFiles((list) => [
          ...list,
          ...files.map((v) => ({
            file: v,
            name: v.name,
            parentId: currentFolder.id,
          })),
        ]);
        sb.success('차트 불러오기가 완료되었습니다.');
      },
    });
  };

  return (
    <Wrapper ref={ref}>
      <input
        ref={inputFile}
        type="file"
        accept=".png, .jpg, .jpeg"
        multiple="multiple"
        onChange={async (e) => {
          try {
            const images = await select(Array.from(e.target.files));

            if (!images) return;

            setLocalFiles((files) => [
              ...files,
              ...images.map((v) => ({
                file: v.file,
                name: v.file.name,
                parentId: currentFolder.id,
              })),
            ]);
          } catch (e) {
            e.target.value = null;
            throw e;
          }
        }}
        hidden
      />
      <Box
        sx={{
          display: 'flex',
          gap: '5px',
        }}
      >
        <PenchartAddFileButton onClick={openCreateFile} />
        <PenchartOpenSampleChartButton onClick={openPenChartSample} />
      </Box>
    </Wrapper>
  );
};

AddButton.propTypes = {
  currentFolder: PropTypes.object,
  setLocalFiles: PropTypes.func,
};

export default AddButton;
