import { useState, useEffect } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { StockScreener } from "@prisma/client";
import { useRouter } from "next/navigation";

import { get } from "@trade-signal/shared";
import { SpotlightActionData } from "@mantine/spotlight";

export const useSpotlightSearch = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [actions, setActions] = useState<SpotlightActionData[]>([]);

  const generateActions = (data: StockScreener[]) => {
    return data.map(result => {
      const { name, code, concept } = result;
      const shortName = `${name} · ${code}`;

      return {
        id: code,
        label: shortName,
        description: concept,
        onClick: () => router.push(`/products/screener?symbol=${code}`)
      };
    });
  };

  const handleSearch = useDebouncedCallback(async () => {
    const response = await get("/api/search", { keyword: search });

    if (!response.success) return;

    setActions(generateActions(response.data));
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [search]);

  return { search, setSearch, handleSearch, actions };
};
