import crypto from "crypto";
import { prisma } from "@/lib/db";
import { code2Session } from "@/lib/wechat";
import { json } from "@/lib/api-helper";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { code, nickName, avatar } = body;
  if (!code) return json({ error: "缺少 code" }, { status: 400 });

  let session: { openid: string; unionid?: string };
  try {
    session = await code2Session(code);
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 400 });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const member = await prisma.member.upsert({
    where: { openid: session.openid },
    update: {
      token,
      ...(nickName ? { nickname: nickName } : {}),
      ...(avatar ? { avatar } : {}),
    },
    create: {
      openid: session.openid,
      unionid: session.unionid,
      nickname: nickName || "微信用户",
      avatar: avatar || "",
      token,
    },
  });

  return json({
    token: member.token,
    member: {
      id: member.id,
      nickname: member.nickname,
      avatar: member.avatar,
      phone: member.phone,
    },
  });
}
