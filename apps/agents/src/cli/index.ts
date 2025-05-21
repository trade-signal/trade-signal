#!/usr/bin/env node

import { Command } from "commander";
import { MarketAgent } from "../modules/market/market.agent";
import { TechnicalAgent } from "../modules/technical/technical.agent";

const program = new Command();

program
  .name("trade-signal-agents")
  .description("Trade Signal Agents CLI")
  .version("0.0.1");

console.log("Hello, Agents");

// 市场分析命令
program
  .command("analyze-market")
  .description("分析市场数据")
  .requiredOption("-s, --symbol <symbol>", "交易对，例如：BTC/USDT")
  .requiredOption("-t, --timeframe <timeframe>", "时间周期，例如：1h, 4h, 1d")
  .option("-l, --limit <number>", "获取数据条数", "100")
  .action(async options => {
    try {
      const marketAgent = new MarketAgent();
      const result = await marketAgent.analyze({
        symbol: options.symbol,
        timeframe: options.timeframe,
        limit: parseInt(options.limit)
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("分析失败:", error.message);
      process.exit(1);
    }
  });

// 技术分析命令
program
  .command("analyze-technical")
  .description("分析技术指标")
  .requiredOption("-s, --symbol <symbol>", "交易对，例如：BTC/USDT")
  .requiredOption(
    "-i, --indicators <indicators>",
    "技术指标，例如：RSI,MA,MACD"
  )
  .option("-t, --timeframe <timeframe>", "时间周期", "1h")
  .option("-l, --limit <number>", "获取数据条数", "100")
  .action(async options => {
    try {
      const technicalAgent = new TechnicalAgent();
      const result = await technicalAgent.analyze({
        symbol: options.symbol,
        indicators: options.indicators.split(","),
        timeframe: options.timeframe,
        limit: parseInt(options.limit)
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("分析失败:", error.message);
      process.exit(1);
    }
  });

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
