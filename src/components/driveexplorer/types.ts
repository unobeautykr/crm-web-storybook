export interface Node {
  id: number;
  name: string;
  parentId: number;
  createdAt: string;
  children?: Node[];
}
