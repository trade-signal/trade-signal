<div align="center">

# TradeSignal

**交易信标** - 整合多维度市场数据，提供专业的投资分析工具。

**TradeSignal** - Integrating multi-dimensional market data to deliver professional investment analysis tools.

富贵险中求，也在险中丢；求时十之一，丢时十之九。

_Fortune favors the bold, but risk management is key._

</div>

## 开发环境

使用 docker-compose 启动 postgres:

````bash
docker-compose -p trade-signal -f docker/docker-compose.dev.yml up  -d
````

将 `.env.example` 复制为 `.env`，并填写数据库连接信息(`DATABASE_URL` | `DIRECT_URL` 为必要的):

首次运行，需要生成 prisma 的 schema 并初始化数据库

````bash
npx prisma generate
npx prisma db push
````

安装依赖并启动服务

````bash
npm install && npm run dev
````

## 生产环境

您可以直接运行 `npm run build` 构建生产环境，然后运行 `npm run start` 启动生产环境。

您也可以使用 docker-compose 启动生产环境：

```bash
docker-compose \
  -p trade-signal \
  --env-file .env.production \
  -f docker/docker-compose.prod.yml \
  up -d
```

## 参考资料

* [AkShare](https://github.com/jindaxiang/akshare) - 开源财经数据接口库
* [AkTools](https://github.com/jindaxiang/aktools) - 基于 AkShare 的 HTTP API 库
* [stock](https://github.com/myhhub/stock) - 提供股票数据、指标计算、选股策略、回测和自动交易
