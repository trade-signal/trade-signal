# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

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

# 生成 Prisma 客户端并确保正确的权限
RUN mkdir -p node_modules/.prisma
RUN chmod -R 777 node_modules/@prisma node_modules/.prisma
RUN npx prisma generate 

# 构建应用
RUN npm run build 

# 清理构建缓存
RUN rm -rf /root/.npm /root/.cache

# 3. 运行阶段
FROM base AS runner
WORKDIR /app

# 安装 tzdata 包并设置时区
RUN apk add --no-cache openssl tzdata
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV=production
ENV PORT=3000

# 创建非 root 用户并设置适当的权限
RUN addgroup -g 1001 -S nodejs 
RUN adduser -S nextjs -u 1001
RUN npm install -g pm2

# 设置工作目录权限
RUN mkdir -p /app/node_modules/.prisma /app/prisma
RUN chown -R nextjs:nodejs /app

# 添加启动脚本
COPY start.sh .
RUN chmod +x start.sh

# 优化文件复制顺序，将较少变动的文件放在前面
COPY --from=builder /app/public ./public
COPY --from=builder /app/ecosystem.config.cjs ./ecosystem.config.cjs
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.cron ./.cron

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["./start.sh"]