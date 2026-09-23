"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { login as doLogin, logout as doLogout, getCurrentAdmin } from "@/lib/auth";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const admin = await doLogin(username, password);
  if (!admin) return { error: "用户名或密码错误" };
  redirect("/admin");
}

export async function logoutAction() {
  await doLogout();
  redirect("/admin/login");
}

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function addFollowup(formData: FormData) {
  const admin = await requireAdmin();
  const leadId = Number(formData.get("leadId"));
  const content = String(formData.get("content") || "");
  if (!content.trim()) return;
  await prisma.leadFollowup.create({
    data: { leadId, adminId: admin.id, content },
  });
  await prisma.lead.update({ where: { id: leadId }, data: { updatedAt: new Date() } });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function saveCase(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const data = {
    title: String(formData.get("title")),
    slug: String(formData.get("slug")),
    subtitle: String(formData.get("subtitle") || ""),
    industry: String(formData.get("industry") || ""),
    projectType: String(formData.get("projectType") || ""),
    summary: String(formData.get("summary") || ""),
    background: String(formData.get("background") || ""),
    strategy: String(formData.get("strategy") || ""),
    execution: String(formData.get("execution") || ""),
    result: String(formData.get("result") || ""),
    dataVisible: formData.get("dataVisible") === "on",
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") || "draft"),
    sort: Number(formData.get("sort") || 0),
  };
  if (id) {
    await prisma.case.update({ where: { id }, data });
  } else {
    await prisma.case.create({ data });
  }
  redirect("/admin/cases");
}

export async function deleteCase(formData: FormData) {
  await requireAdmin();
  await prisma.case.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/admin/cases");
}

export async function saveService(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.service.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      summary: String(formData.get("summary") || ""),
      description: String(formData.get("description") || ""),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/services");
}

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.article.update({
    where: { id },
    data: {
      title: String(formData.get("title")),
      summary: String(formData.get("summary") || ""),
      content: String(formData.get("content") || ""),
      status: String(formData.get("status") || "draft"),
    },
  });
  revalidatePath("/admin/articles");
}

export async function saveBanner(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.banner.update({
    where: { id },
    data: {
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      buttonText: String(formData.get("buttonText") || ""),
      buttonLink: String(formData.get("buttonLink") || ""),
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/banners");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: {
      companyName: String(formData.get("companyName")),
      slogan: String(formData.get("slogan") || ""),
      description: String(formData.get("description") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      icp: String(formData.get("icp") || ""),
      siteTitle: String(formData.get("siteTitle") || ""),
      siteDesc: String(formData.get("siteDesc") || ""),
      siteKeywords: String(formData.get("siteKeywords") || ""),
    },
  });
  revalidatePath("/", "layout");
}
