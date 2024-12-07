<div align="center">

# TradeSignal (交易信标)

**交易信标** - 提供实时市场数据和分析功能，助您捕捉市场脉动，做出精准投资决策。

**TradeSignal** - Provides real-time market data and analysis features, helping you capture market dynamics and make precise investment decisions.

富贵险中求，也在险中丢；求时十之一，丢时十之九。

</div>

## 功能特性

TODO

## 开发环境

### 前置依赖

使用 docker-compose 启动依赖服务，aktools、postgres 。

````bash
docker-compose -p chives-box -f docker/docker-compose.dev.yml up  -d
```` 

### 运行项目

安装依赖并启动服务

````bash
npm install && npm run dev
```` 

## 生产环境

TODO

## 参考

* [AkShare](https://github.com/jindaxiang/akshare) - 开源财经数据接口库
* [AkTools](https://github.com/jindaxiang/aktools) - 基于 AkShare 的 HTTP API 库
* [stock](https://github.com/myhhub/stock) - 提供股票数据、指标计算、选股策略、回测和自动交易
