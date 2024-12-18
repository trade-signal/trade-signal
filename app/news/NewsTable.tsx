import { useEffect } from "react";

import {
  LoadingOverlay,
  Table,
  Text,
  Group,
  Button,
  TextInput
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

export interface Column {
  title: string;
  width?: number;
  render?: (value: any) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  align?: "left" | "center" | "right";
}

const NewsTable = () => {
  return <TableContainer></TableContainer>;
};

export default NewsTable;
