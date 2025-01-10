import { useEffect } from "react";
import { useIntersection } from "@mantine/hooks";
import { Table } from "@mantine/core";

const TableContainer = ({
  height,
  children,
  onLoadMore
}: {
  height?: string;
  children: React.ReactNode;
  onLoadMore: () => void;
}) => {
  const { ref, entry } = useIntersection({
    threshold: 0.5
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoadMore();
    }
  }, [entry?.isIntersecting]);

  return (
    <Table.ScrollContainer
      pos="relative"
      minWidth={500}
      style={{
        height: height || "calc(100vh - 240px)",
        width: "100%",
        overflow: "auto",
        borderBottom:
          "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))"
      }}
    >
      <Table stickyHeader highlightOnHover verticalSpacing="xs">
        {children}
      </Table>
      <div ref={ref} style={{ height: "20px" }} />
    </Table.ScrollContainer>
  );
};

export default TableContainer;
