import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { FileData } from '~/api/resources/driveApi';
import { useReaction } from '~/hooks/useReaction';
import { BrokenFileIcon } from '~/icons/BrokenFile';
import { useDriveItem } from './DriveItemProvider';
import { ItemView } from './ItemView';

const Thumbnail = ({
  thumbnailUrl,
  broken,
}: {
  thumbnailUrl?: string;
  broken?: boolean;
}) => {
  if (broken) return <BrokenFileIcon />;

  if (!thumbnailUrl) return <CircularProgress />;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: `url(${thumbnailUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f1f1f1',
      }}
    />
  );
};

export const FileItem = () => {
  const { entity, ...props } = useDriveItem();
  const file = entity as FileData;

  const [image, setImage] = useState(file.image);

  const broken = image.thumbnailStatus === 'FAILED';

  useReaction(() => {
    setImage(file.image);
  }, [file]);

  return (
    <ItemView
      {...props}
      thumbnail={
        <Thumbnail thumbnailUrl={image.thumbnailUrl} broken={broken} />
      }
      name={file.name}
    />
  );
};
