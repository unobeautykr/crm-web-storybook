import { PenchartType } from '~/core/PenchartType';
import { DirectoryItem } from './DirectoryItem';
import { useDriveItem, withDriveItem } from './DriveItemProvider';
import { FileItem } from './FileItem';

export const DriveEntityItem = withDriveItem(() => {
  const { entity } = useDriveItem();

  if (entity.type === PenchartType.dir) return <DirectoryItem />;

  if (entity.type === PenchartType.file) return <FileItem />;

  throw new Error(`invalid drive entity type ${entity.type}`);
});
