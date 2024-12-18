import { Column } from "@/app/stock/StockTable";
import { Button, Group, Text } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

const DataTableColumnSortCell = ({
  column,
  orderBy,
  order
}: {
  column: Column;
  orderBy?: string;
  order?: string;
}) => {
  return (
    <Group gap={2} style={{ cursor: "pointer", flexWrap: "nowrap" }}>
      <Text fw="normal" size="sm" style={{ whiteSpace: "nowrap" }}>
        {column.title}
      </Text>
      {column.sortable && orderBy === column.key && (
        <Button variant="transparent" size="compact-xs" pr={0} mr={0}>
          {order === "asc" ? (
            <IconSortAscending size={18} />
          ) : (
            <IconSortDescending size={18} />
          )}
        </Button>
      )}
    </Group>
  );
};

export default DataTableColumnSortCell;
