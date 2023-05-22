import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DriveEntityData } from '~/api/resources/driveApi';
import { useReaction } from '~/hooks/useReaction';
import { useDriveContents } from './DriveContentsProvider';

interface DriveItemContextValue {
  entity: DriveEntityData;
  selected: boolean;
  select: (multiselect?: boolean) => void;
  deselect: () => void;
  selectable: boolean;
  multiSelect: boolean;
  reload: () => void;
  drag: (el: HTMLElement) => void;
  isDragging: boolean;
}

const DriveItemContext = createContext<DriveItemContextValue | null>(null);

export const DriveItemProvider = ({
  entityId,
  children,
}: {
  entityId: number;
  children: React.ReactNode;
}) => {
  const {
    selected,
    setSelected,
    entities,
    setMultiSelect,
    multiSelect,
    selectMode,
    selectableIds,
    reloadFile,
    selectedEntities,
  } = useDriveContents();

  const selectedRef = useRef<number[]>([]);

  useReaction(() => {
    selectedRef.current = selected;
  }, [selected]);

  const entity = useMemo(
    () => entities.find((e) => e.id === entityId) as DriveEntityData,
    [entities, entityId]
  );
  const itemSelected = useMemo(
    () => selected.includes(entityId),
    [entityId, selected]
  );

  const selectItem = useCallback(
    (multiSelect?: boolean) => {
      if (multiSelect) {
        setSelected(Array.from(new Set([...selectedRef.current, entityId])));

        if (selectMode === 'default') setMultiSelect(true);
      } else {
        setSelected([entityId]);
      }
    },
    [entityId, selectMode, setMultiSelect, setSelected]
  );
  const deselectItem = useCallback(() => {
    const remains = selectedRef.current.filter((v) => v !== entityId);

    setSelected(remains);
    if (remains.length === 0) {
      if (selectMode === 'default') setMultiSelect(false);
    }
  }, [entityId, selectMode, setMultiSelect, setSelected]);

  const selectable = useMemo(
    () => selectableIds.includes(entity.id),
    [entity.id, selectableIds]
  );

  const reload = useCallback(() => {
    return reloadFile(entityId);
  }, [entityId, reloadFile]);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'DRIVE_ENTITY',
      item: () => {
        if (!itemSelected) {
          selectItem();
        }

        const payload =
          itemSelected && selected.length > 0
            ? {
                files: selectedEntities
                  .filter((e) => e.type === 'FILE')
                  .map((e) => e.id),
                directories: selectedEntities
                  .filter((e) => e.type === 'DIR')
                  .map((e) => e.id),
              }
            : entity.type === 'FILE'
            ? { files: [entityId], directories: [] }
            : { files: [], directories: [entityId] };

        return {
          type: 'penchart-drag',
          ...payload,
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      isDragging: (monitor) => {
        return entity.type === 'DIR'
          ? monitor.getItem().directories.includes(entity.id)
          : monitor.getItem().files.includes(entity.id);
      },
    }),
    [selectedEntities, selected, entity, selectItem]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const value: DriveItemContextValue = useMemo(() => {
    return {
      entity,
      selected: itemSelected,
      select: selectItem,
      deselect: deselectItem,
      selectable,
      multiSelect,
      reload,
      isDragging,
      drag,
    };
  }, [
    entity,
    deselectItem,
    itemSelected,
    multiSelect,
    reload,
    selectItem,
    selectable,
    isDragging,
    drag,
  ]);

  return (
    <DriveItemContext.Provider value={value}>
      {children}
    </DriveItemContext.Provider>
  );
};

export const useDriveItem = () => {
  return useContext(DriveItemContext) as DriveItemContextValue;
};

export const withDriveItem = <T,>(Comp: React.FunctionComponent<T>) => {
  const MemoizedComp: any = React.memo(Comp);
  return ({ entityId, ...props }: { entityId: number } & T) => {
    return (
      <DriveItemProvider entityId={entityId}>
        <MemoizedComp {...props} />
      </DriveItemProvider>
    );
  };
};
