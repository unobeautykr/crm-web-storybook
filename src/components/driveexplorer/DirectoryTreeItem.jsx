import { TreeItem, treeItemClasses } from '@mui/lab';
import { collapseClasses } from '@mui/material';
import { DefaultContent } from './TreeItemContent/DefaultContent';
import { DroppableContent } from './TreeItemContent/DroppableContent';

export const DirectoryTreeItem = ({ node, onDrop }) => {
  return (
    <TreeItem
      nodeId={node.id.toString()}
      label={node.parentId ? node.name : '전체'}
      ContentComponent={onDrop ? DroppableContent : DefaultContent}
      ContentProps={{
        onDropEntity: onDrop,
      }}
      sx={{
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 0,
        },
        [`& .${collapseClasses.wrapperInner}`]: {
          minWidth: 'fit-content',
        },
      }}
    >
      {node.children?.map((childNode) => (
        <DirectoryTreeItem
          key={childNode.id}
          node={childNode}
          onDrop={onDrop}
        />
      )) ?? null}
    </TreeItem>
  );
};
