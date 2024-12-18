import { News } from "@prisma/client";
import { Column } from "../components/tables/DataTable/types";
import { formatDateE } from "../components/tables/DataTable/util";

export const COLUMNS: Column<News>[] = [
  {
    key: "date",
    title: "发布时间",
    width: 200,
    align: "left",
    render: formatDateE
  },
  {
    key: "content",
    title: "内容",
    align: "left"
  },
  {
    key: "source",
    title: "来源",
    align: "left",
    width: 200
  }
];
