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

```properties
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL=[Your Supabase Database URL]

# Direct connection to the database. Used for migrations.
DIRECT_URL=[Your Database URL]

# Github OAuth credentials.
GITHUB_ID=[Your Github ID]
GITHUB_SECRET=[Your Github Secret]

# Google OAuth credentials.
GOOGLE_ID=[Your Google ID]
GOOGLE_SECRET=[Your Google Secret]

# NextAuth secret
NEXTAUTH_SECRET=[Your NextAuth Secret]
```

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

### 构建镜像

```bash
docker build -t trade-signal:latest .
```

### 运行容器

```bash
docker run -d -p 3000:3000 \
  --env-file .env.production \
  --name trade-signal \
  trade-signal:latest
```

```bash
docker run -d -p 3000:3000 \
  -e DATABASE_URL=${DATABASE_URL} \
  -e DIRECT_URL=${DIRECT_URL} \
  -e GITHUB_ID=${GITHUB_ID} \
  -e GITHUB_SECRET=${GITHUB_SECRET} \
  -e GOOGLE_ID=${GOOGLE_ID} \
  -e GOOGLE_SECRET=${GOOGLE_SECRET} \
  --name trade-signal \
  trade-signal:latest
```

or

```bash
docker-compose -p trade-signal -f docker/docker-compose.prod.yml up -d
```

## 参考资料

* [AkShare](https://github.com/jindaxiang/akshare) - 开源财经数据接口库
* [AkTools](https://github.com/jindaxiang/aktools) - 基于 AkShare 的 HTTP API 库
* [stock](https://github.com/myhhub/stock) - 提供股票数据、指标计算、选股策略、回测和自动交易
