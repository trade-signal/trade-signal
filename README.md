<div align="center">

# TradeSignal

**交易信标** - 提供实时市场数据和分析功能，助您捕捉市场脉动，做出精准投资决策。

**TradeSignal** - Provides real-time market data and analysis features, helping you capture market dynamics and make precise investment decisions.

富贵险中求，也在险中丢；求时十之一，丢时十之九。

_Fortune favors the bold, but risk management is key._

</div>

## 功能特性

* 全方位技术分析：集成 MACD、KDJ、BOLL 等主流技术指标，提供精准市场洞察
* 智能形态识别：自动识别关键市场形态，包括头肩顶、双底、突破形态等
* 多维度选股引擎：结合技术面、基本面、资金面等多维数据，智能筛选优质标的
* 策略定制平台：支持个性化交易策略构建，灵活适配不同风险偏好

## 开发环境

使用 docker-compose 启动 postgres:

````bash
docker-compose -p trade-signal -f docker/docker-compose.dev.yml up  -d
```` 

在根目录下创建 .env 文件，并填写数据库连接信息:

```environment
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
