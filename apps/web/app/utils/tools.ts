import { MRT_ColumnFiltersState, MRT_SortingState } from "mantine-react-table";

export const parseCommaSeparatedParam = (
  searchParams: URLSearchParams,
  paramName: string
) => {
  const params = searchParams.get(paramName);
  if (!params) return [];
  return params.split(",").filter(item => item.trim());
};

export const generateWhereClause = <T>(
  parsedColumnFilters: MRT_ColumnFiltersState,
  globalFilter: string,
  globalFilterFields: (keyof T)[] // 全局过滤字段
) => {
  let where: Record<string, any> = {};

  if (parsedColumnFilters.length) {
    parsedColumnFilters.forEach(filter => {
      const { id, value } = filter;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          where[id.toString()] = {
            in: value.map(v => v.toString())
          };
        }
      } else if (value) {
        where[id.toString()] = {
          contains: value.toString()
        };
      }
    });
  }

  if (globalFilter) {
    where.OR = globalFilterFields.map(field => ({
      [field]: { contains: globalFilter }
    }));
  }

  return where;
};

export const generateOrderByClause = <T>(
  parsedSorting: MRT_SortingState,
  defaultOrderField: keyof T,
  defaultOrder: "asc" | "desc" = "asc"
) => {
  let orderBy: Record<string, any> = {};

  if (parsedSorting.length) {
    parsedSorting.forEach(sort => {
      const { id, desc } = sort;
      orderBy[id.toString()] = desc ? "desc" : "asc";
    });
  } else {
    orderBy[defaultOrderField.toString()] = defaultOrder;
  }

  return orderBy;
};
