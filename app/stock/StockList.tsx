"use client";

import { useEffect, useState } from "react";
import { get } from "@/shared/request";
import { useStockContext } from "./StockContext";

const StockList = () => {
  const { filters } = useStockContext();

  const [loading, setLoading] = useState(false);
  const [stockList, setStockList] = useState<StockSelection[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0
  });

  const getStockList = async () => {
    if (!filters.page || !filters.pageSize) {
      return;
    }

    setLoading(true);

    const response = await get("/api/stock/list", {
      ...filters,
      industries: filters.industries?.join(","),
      concepts: filters.concepts?.join(",")
    });

    if (response.success) {
      const { data, pagination } = response.data;
      const { page, pageSize, total } = pagination;

      if (page !== 1) {
        setStockList(prev => [...prev, ...data]);
      } else {
        setStockList(data);
      }

      setPagination({ page, pageSize, total });
    }

    setLoading(false);
  };

  useEffect(() => {
    getStockList();
  }, [filters]);

  return <div>StockList</div>;
};

export default StockList;
