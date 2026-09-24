import { NextRequest } from "next/server";
import { prisma } from "./db";

// 从小程序请求头里解析当前用户
export async function getMemberFromRequest(req: NextRequest) {
  const token = req.headers.get("x-token") || "";
  if (!token) return null;
  return prisma.member.findUnique({ where: { token } });
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}
