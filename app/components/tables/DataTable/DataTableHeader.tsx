import { Table, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import DataTableColumnSortCell from "./DataTableColumnSortCell";
import { Column } from "./types";
import { transformAlign } from "./util";

interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  orderBy?: string;
  order?: string;
  search?: string;
  onSort: (key: string) => void;
  onSearch: (value: string) => void;
}

const DataTableHeader = <T extends Record<string, any>>({
  columns,
  orderBy,
  order,
  search,
  onSort,
  onSearch
}: DataTableHeaderProps<T>) => (
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
          onClick={() => onSort(column.key as string)}
        >
          <Group
            gap={4}
            style={{ justifyContent: transformAlign(column.align) }}
          >
            {column.searchable ? (
              <TextInput
                size="xs"
                label={
                  <DataTableColumnSortCell
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
                onChange={e => onSearch(e.target.value)}
              />
            ) : (
              <DataTableColumnSortCell
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

export default DataTableHeader;
