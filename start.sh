#!/bin/sh

# 运行数据库迁移
npx prisma migrate deploy

# 启动应用
exec pm2-runtime start ecosystem.config.cjs 
