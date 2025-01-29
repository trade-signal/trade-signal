"use client";

import { FC } from "react";

interface PageProps {
  type: string;
}

const MarketListClient: FC<PageProps> = ({ type }) => {
  console.log(type);

  return <div>MarketList</div>;
};

export default MarketListClient;
