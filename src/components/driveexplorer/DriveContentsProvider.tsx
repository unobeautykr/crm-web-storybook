import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useApiFetch } from '~/hooks/useApiFetch';
import { useReaction } from '~/hooks/useReaction';
import { useApi } from '~/components/providers/ApiProvider';
import { useDriveExplorer } from './DriveExplorerProvider';
import moment from 'moment';
import {
  DirectoryData,
  DriveEntityData,
  FileData,
} from '~/api/resources/driveApi';
import { useImmer } from 'use-immer';
import { useControlled } from '@mui/material';

interface DriveContentsContextValue {
  selected: number[];
  setSelected: (v: number[]) => void;
  selectableTypes?: string[];
  entities: DriveEntityData[];
  visibleEntities: DriveEntityData[];
  selectedEntities: DriveEntityData[];
  selectAll: () => void;
  deselectAll: () => void;
  isSelectedAll: boolean;
  multiSelect: boolean;
  setMultiSelect: (v: boolean) => void;
  selectMode: string;
  selectableIds: number[];
  sorts: string;
  setSorts: (sorts: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  loading: boolean;
  refresh: () => void;
  reloadFile: (fileId: number) => void;
  setCustomQueryCondition: (cond: any) => void;
}

const DriveContentsContext = createContext<DriveContentsContextValue | null>(
  null
);

const sortData = (driveData: Array<any>, sorts: string) => {
  const [sortProperty, direction] = sorts.split(' ');
  const data = [...driveData];

  switch (sortProperty) {
    case 'id':
      data.sort(
        (a, b) => parseFloat(a[sortProperty]) - parseFloat(b[sortProperty])
      );
      break;

    case 'name':
      data.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      break;

    case 'createdAt':
    case 'updatedAt':
      data.sort(
        (a, b) =>
          moment(b[sortProperty]).valueOf() - moment(a[sortProperty]).valueOf()
      );
      break;

    default:
      break;
  }

  if (direction === 'asc') data.reverse();
  return data;
};

export const DriveContentsProvider = ({
  selected: selectedProp,
  onSelectedChange,
  selectableTypes,
  selectMode = 'default',
  hideBroken = false,
  children,
}: {
  selected?: number[];
  onSelectedChange?: (v: number[]) => void;
  selectableTypes?: string[];
  selectMode?: string;
  hideBroken?: boolean;
  children: ReactNode;
}) => {
  const { currentDir } = useDriveExplorer();
  const [multiSelect, setMultiSelect] = useState(selectMode === 'multiselect');
  const [sorts, setSorts] = useState('createdAt desc');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [customQueryCondition, setCustomQueryCondition] = useState();

  const { current: defaultSelectedValue } = useRef([]);

  const [selected, setSelectedState] = useControlled({
    controlled: selectedProp,
    default: defaultSelectedValue,
    name: 'DriveContentsProvider',
  });

  const { driveApi, fileApi } = useApi();

  const driveEntityListParams = useMemo(
    () => ({
      parentId: currentDir,
      limit: 9999,
    }),
    [currentDir]
  );

  const { data, mutate, loading } = useApiFetch<any>(
    customQueryCondition ? [customQueryCondition] : [driveEntityListParams],
    driveApi.driveEntityList
  );

  const [entityData, setEntityData] = useImmer<DriveEntityData[]>([]);

  useReaction(() => {
    if (!data) {
      setEntityData(() => []);
      return;
    }

    setEntityData(() => data.data);
  }, [data]);

  const entities = useMemo(() => {
    if (!entityData) return [];

    let folderData = [
      ...entityData.filter((f) => f.type === 'DIR'),
    ] as DirectoryData[];
    let fileData = [
      ...entityData.filter((f) => f.type === 'FILE'),
    ] as FileData[];

    if (hideBroken) {
      fileData = fileData.filter((d) => d.image.thumbnailStatus !== 'FAILED');
    }

    if (sorts) {
      folderData = sortData(folderData, sorts);
      fileData = sortData(fileData, sorts);
    }

    return [...folderData, ...fileData];
  }, [entityData, hideBroken, sorts]);

  const reloadFile = useCallback(
    async (fileId: any) => {
      const res = await fileApi.getFile(fileId);
      const fileData = res.data;

      setEntityData((v) => {
        const index = v.findIndex((e) => e.id === fileId);
        if (index === -1) return;
        (v[index] as FileData).image = fileData.image;
      });
    },
    [fileApi, setEntityData]
  );

  const thumbnailIntervals = useRef<{ [index: number]: any }>({});

  const startLoadThumbnail = useCallback(
    (fileId: number) => {
      if (thumbnailIntervals.current[fileId]) return;

      thumbnailIntervals.current[fileId] = setInterval(() => {
        reloadFile(fileId);
      }, 1000);
    },
    [reloadFile]
  );

  const stopLoadThumbnail = useCallback((fileId: number) => {
    if (!thumbnailIntervals.current[fileId]) return;

    clearInterval(thumbnailIntervals.current[fileId]);
    delete thumbnailIntervals.current[fileId];
  }, []);

  useEffect(() => {
    const targetFiles = entities.filter((e) => e.type === 'FILE') as FileData[];

    for (const f of targetFiles) {
      if (!f.image.thumbnailUrl) {
        startLoadThumbnail(f.id);
      }

      if (f.image.thumbnailUrl || f.image.thumbnailStatus === 'FAILED') {
        stopLoadThumbnail(f.id);
      }
    }

    for (const k of Object.keys(thumbnailIntervals.current)) {
      const fileId = Number(k);
      if (entities.every((e) => e.id !== fileId)) {
        stopLoadThumbnail(fileId);
      }
    }
  }, [entities, reloadFile, startLoadThumbnail, stopLoadThumbnail]);

  useEffect(() => {
    const intervals = thumbnailIntervals.current;
    return () => {
      for (const k of Object.keys(intervals)) {
        stopLoadThumbnail(Number(k));
      }
    };
  }, [stopLoadThumbnail]);

  const selectableIds = useMemo(
    () =>
      entities
        .filter((e) => !selectableTypes || selectableTypes.includes(e.type))
        .map((e) => e.id),
    [entities, selectableTypes]
  );

  useReaction(() => {
    setSelectedState([]);
  }, [currentDir]);

  useEffect(() => {
    onSelectedChange?.([]);
  }, [currentDir, onSelectedChange]);

  const effectiveSelected = useMemo(
    () => selected.filter((id) => selectableIds.includes(id)),
    [selectableIds, selected]
  );

  const setSelected = useCallback(
    (value: any) => {
      onSelectedChange?.(value);
      setSelectedState(value);
    },
    [onSelectedChange, setSelectedState]
  );

  const selectAll = useCallback(() => {
    setSelected([...selectableIds]);

    if (selectMode === 'default') setMultiSelect(true);
  }, [selectMode, selectableIds, setSelected]);

  const deselectAll = useCallback(() => {
    setSelected([]);
    if (selectMode === 'default') setMultiSelect(false);
  }, [selectMode, setSelected]);

  const isSelectedAll = useMemo(
    () =>
      selectableIds.length > 0 &&
      selectableIds.every((id) => effectiveSelected.includes(id)),
    [selectableIds, effectiveSelected]
  );

  const selectedEntities = useMemo(
    () => entities.filter((e) => effectiveSelected.includes(e.id)),
    [entities, effectiveSelected]
  );

  const visibleEntities = useMemo(() => {
    let items = entities;
    if (searchKeyword && searchKeyword.trim().length > 0) {
      const trimmed = searchKeyword.trim();
      items = items.filter((e) => e.name.includes(trimmed));
    }

    return items;
  }, [entities, searchKeyword]);

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const value: DriveContentsContextValue = useMemo(
    () => ({
      selected: effectiveSelected,
      setSelected,
      selectableTypes,
      entities,
      visibleEntities,
      selectedEntities,
      selectAll,
      deselectAll,
      isSelectedAll,
      multiSelect,
      setMultiSelect,
      selectMode,
      selectableIds,
      sorts,
      setSorts,
      searchKeyword,
      setSearchKeyword,
      loading,
      refresh,
      reloadFile,
      setCustomQueryCondition,
    }),
    [
      effectiveSelected,
      setSelected,
      selectableTypes,
      entities,
      visibleEntities,
      selectedEntities,
      selectAll,
      deselectAll,
      isSelectedAll,
      multiSelect,
      setMultiSelect,
      selectMode,
      selectableIds,
      sorts,
      setSorts,
      searchKeyword,
      setSearchKeyword,
      loading,
      refresh,
      reloadFile,
      setCustomQueryCondition,
    ]
  );

  return (
    <DriveContentsContext.Provider value={value}>
      {children}
    </DriveContentsContext.Provider>
  );
};

export const useDriveContents = () => {
  return useContext(DriveContentsContext) as DriveContentsContextValue;
};
