"use client";

import { Paper, rem, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";

const StockIndex = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stock-index"],
    queryFn: () => clientGet("/api/stock-index/list", {})
  });

  return (
    <Paper>
      <Title order={2} size={rem(32)}>
        指数
      </Title>
    </Paper>
  );
};

export default StockIndex;
