import { prisma } from "@/lib/db";
import { saveArticle } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-xl font-bold text-ink">文章管理</h1>
      <div className="mt-6 space-y-4">
        {articles.map((a) => (
          <form key={a.id} action={saveArticle} className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <input type="hidden" name="id" value={a.id} />
            <input name="title" defaultValue={a.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium" />
            <input name="summary" defaultValue={a.summary || ""} placeholder="摘要" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <textarea name="content" rows={4} defaultValue={a.content || ""} placeholder="正文（支持换行）" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <div className="mt-3 flex items-center gap-4">
              <select name="status" defaultValue={a.status} className="rounded-lg border border-slate-200 px-3 py-1.5">
                <option value="draft">草稿</option>
                <option value="published">发布</option>
                <option value="archived">下架</option>
              </select>
              <button className="rounded-full bg-ink px-4 py-1.5 text-white">保存</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
