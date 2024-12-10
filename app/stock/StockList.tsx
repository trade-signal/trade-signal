"use client";

import { useEffect, useState } from "react";
import { get } from "@/shared/request";

import { StockSelection } from "@prisma/client";
import {
  Button,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { StockFilters, useStockContext } from "./StockContext";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

const StockList = () => {
  const { filters, setFilters } = useStockContext();

  const [visible, { open, close }] = useDisclosure(false);

  const [stockList, setStockList] = useState<StockSelection[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0
  });

  const getStockList = async () => {
    if (!filters.page || !filters.pageSize) {
      return;
    }

    const response = await get("/api/stock/list", {
      ...filters,
      industries: filters.industries?.join(","),
      concepts: filters.concepts?.join(",")
    });

    if (response.success) {
      const { data, pagination } = response;
      const { page, pageSize, total, totalPage } = pagination;

      setStockList(data);
      setPagination({ page, pageSize, total, totalPage });
    }
  };

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  useEffect(() => {
    (async () => {
      open();
      await getStockList();
      close();
    })();
  }, [filters]);

  return (
    <>
      <Table.ScrollContainer
        pos="relative"
        minWidth={500}
        style={{
          height: "calc(100vh - 240px)",
          width: "100%",
          overflow: "auto",
          borderBottom: "1px solid #eee"
        }}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Table stickyHeader verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={100}>股票代码</Table.Th>
              <Table.Th w={120}>股票名称</Table.Th>
              <Table.Th w={100}>行业</Table.Th>
              <Table.Th w={300}>概念</Table.Th>
              <Table.Th w={300}>风格</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {stockList.map((stock, index) => (
              <Table.Tr key={stock.id}>
                <Table.Td>{stock.code}</Table.Td>
                <Table.Td>{stock.name}</Table.Td>
                <Table.Td>{stock.industry}</Table.Td>
                <Table.Td>{stock.concept}</Table.Td>
                <Table.Td>{stock.style}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group>
        <Pagination
          mt="sm"
          color="gray"
          value={pagination.page}
          total={pagination.totalPage}
          onChange={handlePageChange}
        />

        <Group>
          <Text size="xs" mt="md">
            共 {pagination?.total || 0} 条数据
          </Text>
          <Text size="xs" mt="md">
            第 {pagination?.page || 1} 页 共 {pagination?.totalPage || 1} 页
          </Text>
        </Group>
      </Group>
    </>
  );
};

export default StockList;
