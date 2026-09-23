import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "tujing_session";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function pack(adminId: number, role: string, expires: number) {
  const payload = `${adminId}.${role}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function unpack(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [id, role, expires, sig] = parts;
  const payload = `${id}.${role}.${expires}`;
  if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload))) === false) return null;
  if (Number(expires) < Date.now()) return null;
  return { id: Number(id), role };
}

export async function login(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const token = pack(admin.id, admin.role, expires);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires,
  });
  return admin;
}

export function logout() {
  cookies().set(COOKIE, "", { path: "/", expires: new Date(0) });
}

export async function getCurrentAdmin() {
  const token = cookies().get(COOKIE)?.value;
  const data = unpack(token);
  if (!data) return null;
  return prisma.admin.findUnique({ where: { id: data.id } });
}

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export const LEAD_STATUS: Record<string, string> = {
  pending: "待联系",
  contacted: "已联系",
  intention: "意向客户",
  quoted: "已报价",
  deal: "已成交",
  lost: "暂不考虑",
  invalid: "无效",
};
