#!/usr/bin/env bash
# 途鲸传媒官网 宝塔一键部署脚本
set -e

cd "$(dirname "$0")"
echo "==> 项目目录: $(pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "[!] 未检测到 Node.js。请先在宝塔【软件商店】安装 Node.js 版本管理器并安装 Node 18+，然后重跑本脚本。"
  exit 1
fi
echo "[√] node: $(node -v), npm: $(npm -v)"

if [ ! -f .env ]; then
  cp .env.example .env
  SECRET=$(node -e "console(require('crypto').randomBytes(32).toString('hex'))")
  sed -i "s#AUTH_SECRET=.*#AUTH_SECRET=\"$SECRET\"#" .env
  echo "[√] 已生成 .env（含随机会话密钥）"
fi

echo "==> 安装依赖..."
npm install --no-audit --no-fund

echo "==> 初始化数据库..."
npx prisma db push
npx tsx prisma/seed.ts

echo "==> 生产构建..."
npm run build

echo "==> 用 PM2 启动..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete tujing-web 2>/dev/null || true
  PORT=3000 pm2 start "npm run start" --name tujing-web
  pm2 save
  echo "[√] 已通过 PM2 启动，访问端口 3000"
else
  echo "[!] 未安装 pm2。可执行: npm i -g pm2 后重新运行本脚本。"
fi

echo ""
echo "==============================================="
echo " 部署完成！"
echo " 后台: http://127.0.0.1:3000/admin  (admin / admin123456)"
echo " 下一步：在宝塔【网站】添加站点 zzzz.baby，并设置反向代理到 http://127.0.0.1:3000"
echo "==============================================="
