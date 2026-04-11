import Icon from "@/components/ui/icon"
import { Article } from "./knowledgeData"

type Props = {
  article: Article
  onBack: () => void
}

export default function ArticleView({ article, onBack }: Props) {
  return (
    <div className="px-5 py-6 space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition">
        <Icon name="ArrowLeft" size={16} />
        Назад
      </button>
      <h1 className="text-xl font-bold">{article.title}</h1>
      <div className="space-y-4">
        {article.content.map((block, i) => {
          if (block.type === "title") return <p key={i} className="font-semibold text-white mt-2">{block.text}</p>
          if (block.type === "text") return <p key={i} className="text-white/70 text-sm leading-relaxed">{block.text}</p>
          if (block.type === "list") return (
            <ul key={i} className="space-y-2">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                  <Icon name="CheckCircle" size={14} className="text-[#e91e8c] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )
          return null
        })}
      </div>
    </div>
  )
}
