#------------------------------------------------------------------
# Base: 设置基础镜像和系统环境
#------------------------------------------------------------------
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# 设置编译环境变量
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

#------------------------------------------------------------------
# Dependencies: 安装项目依赖
#------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# 复制 package.json 文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/core/package.json ./apps/core/package.json

# 安装依赖
RUN \
  if [ -f pnpm-lock.yaml ]; then \
  pnpm install --frozen-lockfile --shamefully-hoist && \
  pnpm add -Dw @rollup/rollup-linux-x64-gnu @swc/core-linux-x64-gnu; \
  elif [ -f yarn.lock ]; then \
  yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
  npm ci; \
  else \
  echo "Lockfile not found." && exit 1; \
  fi

#------------------------------------------------------------------
# Prisma: 生成 Prisma 客户端
#------------------------------------------------------------------
FROM deps AS prisma-builder
WORKDIR /app

# 复制 prisma 目录
COPY prisma ./prisma

# 生成 Prisma 客户端
RUN npx prisma generate && \
  mkdir -p /app/node_modules/.prisma && \
  find /app -name ".prisma" -type d -exec cp -r {} /app/node_modules/ \;

#------------------------------------------------------------------
# Packages: 构建 packages 模块
#------------------------------------------------------------------
FROM deps AS packages-builder
WORKDIR /app

# 复制 packages 目录
COPY packages ./packages

# 构建 packages 模块
RUN pnpm packages:build

# 移动 packages 目录到 node_modules 目录
RUN find /app -name "node_modules" -type d -exec mv {} /app/node_modules/ \;

#------------------------------------------------------------------
# Build Web: 构建 Next.js 应用
#------------------------------------------------------------------
FROM deps AS web-builder
WORKDIR /app

# 确保复制整个 node_modules 目录
COPY --from=prisma-builder /app/node_modules ./node_modules
COPY . .
RUN pnpm build:web

#------------------------------------------------------------------
# Build Core: 构建 Nest.js 应用
#------------------------------------------------------------------
FROM deps AS core-builder
WORKDIR /app

COPY --from=prisma-builder /app/node_modules ./node_modules
COPY . .
RUN pnpm build:core

#------------------------------------------------------------------
# Production Web: Next.js 生产环境
#------------------------------------------------------------------
FROM base AS web
WORKDIR /app
ENV NODE_ENV production

# 复制构建产物和完整的 node_modules
COPY --from=web-builder /app/node_modules ./node_modules
COPY --from=web-builder /app/apps/web/public ./apps/web/public
COPY --from=web-builder /app/apps/web/.next/standalone ./
COPY --from=web-builder /app/apps/web/.next/static ./apps/web/.next/static

# 设置权限
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
ENV PORT 3000

CMD ["node", "apps/web/server.js"]

#------------------------------------------------------------------
# Production Core: Nest.js 生产环境
#------------------------------------------------------------------
FROM base AS core
WORKDIR /app
ENV NODE_ENV production

# 复制构建产物和完整的 node_modules
COPY --from=core-builder /app/node_modules ./node_modules
COPY --from=core-builder /app/apps/core/package.json ./package.json
COPY --from=core-builder /app/apps/core/dist ./apps/core/dist

# 设置权限
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000
ENV PORT 4000

CMD ["node", "apps/core/dist/main"]