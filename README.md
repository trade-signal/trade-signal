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

### 使用 DockerHub 镜像

最简单的方式是直接使用 DockerHub 上的镜像：

```bash
docker run -d -p 3000:3000 \
  --env-file .env.production \
  --name trade-signal \
  yzqzy/trade-signal:latest
```

或者使用环境变量：

```bash
docker run -d -p 3000:3000 \
  -e DATABASE_URL=${DATABASE_URL} \
  -e DIRECT_URL=${DIRECT_URL} \
  -e GITHUB_ID=${GITHUB_ID} \
  -e GITHUB_SECRET=${GITHUB_SECRET} \
  -e GOOGLE_ID=${GOOGLE_ID} \
  -e GOOGLE_SECRET=${GOOGLE_SECRET} \
  -e NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
  -e NEXTAUTH_URL=${NEXTAUTH_URL} \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e POSTGRES_DB=${POSTGRES_DB} \
  --name trade-signal \
  yzqzy/trade-signal:latest
```

### 本地构建（可选）

如果您想自行构建镜像：

```bash
docker build -t trade-signal:latest .
```

然后按上述方式运行容器，将镜像名从 `yzqzy/trade-signal` 改为 `trade-signal` 即可。

您也可以使用 docker-compose：

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
