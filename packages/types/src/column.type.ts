export type ColumnAlign = "left" | "center" | "right";

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  // @ts-ignore
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  align?: ColumnAlign;
}

export interface SortProps {
  orderBy?: string;
  order?: string;
  onSort: (key: string) => void;
}

export interface SearchProps {
  search?: string;
  onSearch: (value: string) => void;
}

export interface LoadingProps {
  firstLoading: boolean;
  loading: boolean;
}
