import { useState } from "react"
import Icon from "@/components/ui/icon"
import { categories, Article } from "./knowledge/knowledgeData"
import ArticleView from "./knowledge/ArticleView"
import CategoryView from "./knowledge/CategoryView"

export default function KnowledgeTab({ isDark: _isDark = true }: { isDark?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [search, setSearch] = useState("")

  const category = categories.find((c) => c.id === activeCategory)

  const searchResults = search.trim().length > 1
    ? categories.flatMap((cat) =>
        cat.articles
          .filter((a) =>
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.preview.toLowerCase().includes(search.toLowerCase())
          )
          .map((a) => ({ article: a, catLabel: cat.label }))
      )
    : []

  if (activeArticle) {
    return (
      <ArticleView
        article={activeArticle}
        onBack={() => setActiveArticle(null)}
      />
    )
  }

  if (category) {
    return (
      <CategoryView
        category={category}
        onBack={() => setActiveCategory(null)}
        onSelectArticle={setActiveArticle}
      />
    )
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">База знаний</h1>
        <p className="text-white/50 text-sm mt-1">Короткие статьи о кибербезопасности</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по статьям..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:opacity-25 focus:outline-none focus:border-[#e91e8c]/60 transition"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60">
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {search.trim().length > 1 ? (
        <div className="space-y-2">
          {searchResults.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-6">Ничего не найдено</p>
          ) : (
            searchResults.map((r, i) => (
              <button key={i} onClick={() => { setActiveArticle(r.article); setSearch("") }}
                className="w-full bg-white/5 border border-white/8 rounded-2xl p-4 text-left hover:bg-white/8 transition">
                <p className="text-[10px] opacity-40 mb-1">{r.catLabel}</p>
                <p className="font-semibold text-sm">{r.article.title}</p>
                <p className="text-white/50 text-xs mt-1">{r.article.preview}</p>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="bg-white/5 border border-white/8 rounded-2xl p-4 text-left hover:bg-white/8 transition space-y-2">
              <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center`}>
                <Icon name={cat.icon} size={18} className={cat.color} fallback="BookOpen" />
              </div>
              <p className="font-semibold text-sm">{cat.label}</p>
              <p className="text-white/40 text-xs">{cat.articles.length} {cat.articles.length === 1 ? "статья" : "статьи"}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
