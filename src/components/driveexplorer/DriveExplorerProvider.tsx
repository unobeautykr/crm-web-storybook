import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { DirectoryData } from '~/api/resources/driveApi';
import { PenchartType } from '~/core/PenchartType';
import { useApiFetch } from '~/hooks/useApiFetch';
import { useApi } from '~/components/providers/ApiProvider';
import { Node } from './types';

interface DriveExplorerContextValue {
  directories: DirectoryData[];
  currentDir: number | null;
  setCurrentDir: (id: number | null) => void;
  path: DirectoryData[];
  root: Node;
  refresh: () => void;
  driveId: number;
}

const DriveExplorerContext = createContext<DriveExplorerContextValue | null>(
  null
);

const findPath = (directories: DirectoryData[], directoryId: number | null) => {
  if (!directoryId) return [];

  const path = [];

  const current = directories.find((d) => d.id === directoryId);

  if (!current) throw new Error('current directory is not found');

  path.unshift(current);

  let parent = directories.find((d) => d.id === current.parentId);

  while (parent) {
    const nextParent = parent;
    path.unshift(nextParent);
    parent = directories.find((d) => d.id === nextParent.parentId);
  }

  return path;
};

const buildTree = (directories: DirectoryData[]) => {
  const children: { [index: number]: Node[] } = {};

  const nodes: Node[] = directories.map((d) => ({ ...d }));

  for (const n of nodes) {
    if (!children[n.parentId]) {
      children[n.parentId] = [];
    }

    children[n.parentId].push(n);
  }

  for (const n of nodes) {
    n.children = children[n.id];
    n.children?.sort((a, b) => {
      return Math.sign(
        Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
      );
    });
  }

  const root = nodes.find((n) => !n.parentId);

  if (!root) {
    throw new Error('root does not exist in node list');
  }

  return root;
};

const Provider = ({
  directories,
  mutate,
  children,
  driveId,
}: {
  directories: DirectoryData[];
  mutate: () => void;
  children: ReactNode;
  driveId: number;
}) => {
  const root = useMemo(() => buildTree(directories), [directories]);

  const [targetDirectoryId, setTargetDirectoryId] = useState<number | null>(
    root.id
  );

  const currentDirectoryId: number | null = useMemo(() => {
    if (targetDirectoryId == null) return null;

    return directories.find((d) => d.id === targetDirectoryId)
      ? targetDirectoryId
      : root.id;
  }, [directories, root.id, targetDirectoryId]);

  const path = useMemo(
    () => findPath(directories, currentDirectoryId),
    [currentDirectoryId, directories]
  );

  const value: DriveExplorerContextValue = useMemo(
    () => ({
      directories,
      currentDir: currentDirectoryId,
      setCurrentDir: setTargetDirectoryId,
      path,
      root,
      refresh: mutate,
      driveId,
    }),
    [currentDirectoryId, directories, mutate, path, root, driveId]
  );

  return (
    <DriveExplorerContext.Provider value={value}>
      {children}
    </DriveExplorerContext.Provider>
  );
};

export const DriveExplorerProvider = ({
  driveId,
  children,
}: {
  driveId: number;
  children: ReactNode;
}) => {
  const { driveApi } = useApi();

  const driveEntityListParams = useMemo(
    () => ({ driveId, type: PenchartType.dir, limit: 9999 }),
    [driveId]
  );

  const { data, mutate } = useApiFetch(
    [driveEntityListParams],
    driveApi.driveEntityList
  );

  if (!data) return null;

  return (
    <Provider
      directories={data.data as DirectoryData[]}
      mutate={mutate}
      driveId={driveId}
    >
      {children}
    </Provider>
  );
};

export const useDriveExplorer = () => {
  return useContext(DriveExplorerContext) as DriveExplorerContextValue;
};
