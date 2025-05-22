import { IconSearch } from "@tabler/icons-react";
import { Spotlight } from "@mantine/spotlight";
import { rem } from "@mantine/core";

import { useSpotlightSearch } from "@/app/hooks/useSpotlightSearch";

const SpotlightModal = () => {
  const { search, setSearch, actions } = useSpotlightSearch();

  return (
    <Spotlight
      actions={actions}
      nothingFound="未找到相关内容"
      scrollable
      searchProps={{
        size: "sm",
        leftSection: (
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        ),
        placeholder: "请输入股票代码或名称",
        value: search,
        onChange: e => setSearch(e.target.value)
      }}
    />
  );
};

export default SpotlightModal;
