#------------------------------------------------------------------
# Base: 设置基础镜像和系统环境
#------------------------------------------------------------------
FROM node:20 AS base

# 安装 pnpm
RUN npm install -g pnpm

# 设置编译环境变量
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非 root 用户
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

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
RUN pnpm install --frozen-lockfile

#------------------------------------------------------------------
# Builder: 构建所有包
#------------------------------------------------------------------
FROM deps AS builder
WORKDIR /app

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建所有包
RUN pnpm build

#------------------------------------------------------------------
# Web: Next.js 生产环境
#------------------------------------------------------------------
FROM base AS web
WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# 设置权限
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "apps/web/server.js"]

#------------------------------------------------------------------
# Core: Nest.js 生产环境
#------------------------------------------------------------------
FROM base AS core
WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core/dist ./apps/core/dist
COPY --from=builder /app/apps/core/package.json ./apps/core/package.json

# 设置权限
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000
ENV PORT 4000
ENV NODE_ENV production

CMD ["node", "apps/core/dist/main"]