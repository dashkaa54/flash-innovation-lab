import Icon from "@/components/ui/icon"
import { Article, Category } from "./knowledgeData"

type Props = {
  category: Category
  onBack: () => void
  onSelectArticle: (article: Article) => void
}

export default function CategoryView({ category, onBack, onSelectArticle }: Props) {
  return (
    <div className="px-5 py-6 space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition">
        <Icon name="ArrowLeft" size={16} />
        Все категории
      </button>
      <h1 className="text-xl font-bold">{category.label}</h1>
      <div className="space-y-3">
        {category.articles.map((article, i) => (
          <button key={i} onClick={() => onSelectArticle(article)}
            className="w-full bg-white/5 border border-white/8 rounded-2xl p-4 text-left hover:bg-white/8 transition">
            <p className="font-semibold text-sm">{article.title}</p>
            <p className="text-white/50 text-xs mt-1">{article.preview}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
