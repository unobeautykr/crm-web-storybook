import { useDrop } from 'react-dnd';

export const usePenchartDrop = (
  entityId: number,
  { onDrop }: { onDrop: (files: number[], directories: []) => void }
) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['DRIVE_ENTITY'],
      drop: (item: any) => {
        if (item?.type === 'penchart-drag' && onDrop) {
          onDrop(item.files, item.directories);
        }
      },
      canDrop: (item) => {
        return (
          item?.type === 'penchart-drag' && !item.directories.includes(entityId)
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  return {
    isOver,
    drop,
  };
};
