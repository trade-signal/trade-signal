# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# 1. 依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ git

WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建应用
COPY .env.production.sample .env.production
RUN npm run build

# 3. 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 只在运行阶段安装 PM2
RUN npm install -g pm2

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
COPY --from=builder /app/cron ./cron

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 确保 Prisma 客户端在生产环境可用
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

# 使用 PM2 启动应用
CMD ["pm2-runtime", "start", "ecosystem.config.js"]