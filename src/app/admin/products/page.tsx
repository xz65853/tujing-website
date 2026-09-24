import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function saveProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const data = {
    name: String(formData.get("name")),
    subtitle: String(formData.get("subtitle") || ""),
    price: Number(formData.get("price")),
    originalPrice: Number(formData.get("originalPrice") || 0) || null,
    duration: String(formData.get("duration") || ""),
    summary: String(formData.get("summary") || ""),
    detail: String(formData.get("detail") || ""),
    features: String(formData.get("features") || ""),
    published: formData.get("published") === "on",
  };
  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
}

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ orderBy: { sort: "asc" } });

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-ink">套餐管理</h1>
      <p className="mt-2 text-sm text-slate-500">小程序内展示的可购买套餐。价格单位：分（29900 = ¥299.00）</p>

      <div className="mt-6 space-y-4">
        {products.map((p) => (
          <form key={p.id} action={saveProduct} className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <input type="hidden" name="id" value={p.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" defaultValue={p.name} placeholder="套餐名" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="subtitle" defaultValue={p.subtitle || ""} placeholder="副标题（如 8条/月）" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="price" type="number" defaultValue={p.price} placeholder="价格（分）" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="originalPrice" type="number" defaultValue={p.originalPrice || ""} placeholder="划线价（分，选填）" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="duration" defaultValue={p.duration || ""} placeholder="交付周期（如 1个月）" className="rounded-lg border border-slate-200 px-3 py-2 sm:col-span-2" />
            </div>
            <input name="summary" defaultValue={p.summary || ""} placeholder="一句话简介" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <textarea name="features" rows={2} defaultValue={safeJson<string[]>(p.features, []).join("\n")} placeholder="包含内容，每行一条" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <textarea name="detail" rows={2} defaultValue={p.detail || ""} placeholder="详情说明" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p.published} /> 小程序上架</label>
              <button className="rounded-full bg-ink px-4 py-1.5 text-white">保存</button>
            </div>
          </form>
        ))}

        <form action={saveProduct} className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm">
          <h2 className="font-semibold text-ink">+ 新增套餐</h2>
          <input name="name" placeholder="套餐名" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <input name="price" type="number" placeholder="价格（分）" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button className="mt-3 rounded-full bg-brand px-4 py-1.5 text-white">添加</button>
        </form>
      </div>
    </div>
  );
}
