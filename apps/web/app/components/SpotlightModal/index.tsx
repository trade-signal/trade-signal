"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { Spotlight, SpotlightActionData } from "@mantine/spotlight";
import { Group, rem, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { StockScreener } from "@prisma/client";
import { get } from "@trade-signal/shared";

const SpotlightModal = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [actions, setActions] = useState<SpotlightActionData[]>([]);

  const generateActions = (data: StockScreener[]) => {
    return data.map(result => {
      const { name, code, concept, style } = result;

      const shortName = `${name} · ${code}`;
      const description = `${concept} · ${style}`;

      return {
        id: code,
        label: shortName,
        description
      };
    });
  };

  const handleSearch = useDebouncedCallback(async () => {
    const response = await get("/api/search", { keyword: search });

    if (!response.success) return;

    setActions(generateActions(response.data));
  }, 500);

  const handleClick = (action: SpotlightActionData) => {
    router.push(`/products/screener?symbol=${action.id}`);
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <Spotlight.Root scrollable>
      <Spotlight.Search
        placeholder="请输入股票代码或名称"
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftSection={
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        }
      />
      <Spotlight.ActionsList>
        {actions.length > 0 ? (
          actions.map(action => (
            <Spotlight.Action
              key={action.id}
              dimmedSections={false}
              highlightQuery={false}
              onClick={() => handleClick(action)}
              style={{
                backgroundColor: "none"
              }}
            >
              <Group wrap="nowrap" w="100%">
                <div style={{ flex: 1 }}>
                  <Text>{action.label}</Text>

                  {action.description && (
                    <Text opacity={0.6} size="xs">
                      {action.description}
                    </Text>
                  )}
                </div>
              </Group>
            </Spotlight.Action>
          ))
        ) : (
          <Spotlight.Empty>未搜索到相关内容</Spotlight.Empty>
        )}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default SpotlightModal;
