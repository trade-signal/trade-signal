import { Table, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Column } from "@/apps/web/app/types/column.type";
import { transformAlign } from "@/packages/shared/renders";

import DataTableColumnSortCell from "./DataTableColumnSortCell";

interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  orderBy?: string;
  order?: string;
  search?: string;
  onSort?: (key: string) => void;
  onSearch?: (value: string) => void;
}

const DataTableHeader = <T extends Record<string, any>>({
  columns,
  orderBy,
  order,
  search,
  onSort,
  onSearch
}: DataTableHeaderProps<T>) => {
  const handleSort = (key: string) => {
    onSort?.(key);
  };

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map(column => (
          <Table.Th
            key={column.key as string}
            fw="normal"
            fz="sm"
            c="#666"
            style={{
              width: column.width,
              cursor: "pointer"
            }}
            onClick={() => handleSort(column.key as string)}
          >
            <Group
              gap={4}
              style={{ justifyContent: transformAlign(column.align) }}
            >
              {column.searchable ? (
                <TextInput
                  size="xs"
                  label={
                    <DataTableColumnSortCell<T>
                      column={column}
                      orderBy={orderBy}
                      order={order}
                    />
                  }
                  variant="filled"
                  placeholder="搜索"
                  rightSection={<IconSearch size={18} />}
                  value={search}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={e => handleSearch(e.target.value)}
                />
              ) : (
                <DataTableColumnSortCell<T>
                  column={column}
                  orderBy={orderBy}
                  order={order}
                />
              )}
            </Group>
          </Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
  );
};

export default DataTableHeader;
