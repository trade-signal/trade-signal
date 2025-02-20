import {
  IconDashboard,
  IconFileText,
  IconHome,
  IconSearch
} from "@tabler/icons-react";
import { Spotlight, SpotlightActionData } from "@mantine/spotlight";
import { rem } from "@mantine/core";
import { useRouter } from "next/navigation";

const useActions = () => {
  const router = useRouter();

  const actions: SpotlightActionData[] = [
    {
      id: "stock",
      label: "股票",
      description: "跳转至股票页面",
      onClick: () => router.push("/stock"),
      leftSection: (
        <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      )
    },
    {
      id: "news",
      label: "新闻",
      description: "跳转至新闻页面",
      onClick: () => router.push("/news"),
      leftSection: (
        <IconDashboard
          style={{ width: rem(24), height: rem(24) }}
          stroke={1.5}
        />
      )
    }
  ];

  return actions;
};

const SpotlightModal = () => {
  const actions = useActions();

  return (
    <Spotlight
      actions={actions}
      nothingFound="Nothing found..."
      highlightQuery
      searchProps={{
        leftSection: (
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        ),
        placeholder: "搜索..."
      }}
    />
  );
};

export default SpotlightModal;
