"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, Button } from "@mantine/core";
import { get } from "@/shared/request";

import StockScreenerMultiSelect from "./StockScreenerMultiSelect";
import StockScreenerSelect from "./StockScreenerSelect";
import {
  getInitialFilters,
  StockFilters,
  useStockContext
} from "./StockContext";
import {
  StockMarketValue,
  StockMarketValueConfig,
  StockPeRatio,
  StockPeRatioConfig,
  StockPriceRange,
  StockPriceRangeConfig
} from "./StockScreenerConfig";

const StockScreener = () => {
  const { filters, setFilters } = useStockContext();

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const [industryData, setIndustryData] = useState<string[]>([]);
  const [conceptData, setConceptData] = useState<string[]>([]);
  const [styleData, setStyleData] = useState<string[]>([]);

  const getFilter = async () => {
    const response = await get("/api/stock/filter", {});

    if (response.success) {
      setIndustryData(response.data.industries);
      setConceptData(response.data.concepts);
      setStyleData(response.data.styles);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>股票筛选器</Title>

      <Group>
        <StockScreenerMultiSelect
          title="行业"
          value={filters.industries}
          data={industryData}
          onChange={industries => handleFilterChange({ industries })}
          clearable
          searchable
          nothingFoundMessage="未找到相关行业"
        />

        <StockScreenerMultiSelect
          title="概念"
          value={filters.concepts}
          data={conceptData}
          onChange={concepts => handleFilterChange({ concepts })}
          clearable
          searchable
          nothingFoundMessage="未找到相关概念"
        />

        <StockScreenerMultiSelect
          title="风格"
          value={filters.styles}
          data={styleData}
          onChange={styles => handleFilterChange({ styles })}
          clearable
          searchable
          nothingFoundMessage="未找到相关风格"
        />

        <StockScreenerSelect
          title="最新价"
          value={filters.newPrice}
          data={StockPriceRangeConfig}
          clearable
          onChange={price =>
            handleFilterChange({ newPrice: price as StockPriceRange })
          }
        />

        <StockScreenerSelect
          title="总市值"
          value={filters.totalMarketValue}
          data={StockMarketValueConfig}
          clearable
          onChange={totalMarketValue =>
            handleFilterChange({
              totalMarketValue: totalMarketValue as StockMarketValue
            })
          }
        />

        <StockScreenerSelect
          title="市盈率TTM"
          value={filters.peRatio}
          data={StockPeRatioConfig}
          clearable
          onChange={peRatio =>
            handleFilterChange({ peRatio: peRatio as StockPeRatio })
          }
        />

        <Button
          variant="subtle"
          onClick={() => handleFilterChange(getInitialFilters())}
        >
          重置所有
        </Button>
      </Group>
    </Stack>
  );
};

export default StockScreener;
