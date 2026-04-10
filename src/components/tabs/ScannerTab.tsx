import { useState } from "react"
import Icon from "@/components/ui/icon"

type ScanResult = "safe" | "danger" | "warning" | null

interface HistoryItem {
  url: string
  result: ScanResult
  time: string
}

function analyzeUrl(url: string): { result: ScanResult; reasons: string[] } {
  const reasons: string[] = []
  let danger = 0
  let warnings = 0

  const lower = url.toLowerCase().trim()

  if (!lower.startsWith("https://")) {
    reasons.push("Нет защищённого соединения HTTPS")
    warnings++
  }

  const phishingKeywords = ["sberbank.co", "gosuslugi.net", "vtb-bank", "tinkoff-online", "sber-pay", "alfabank.cc", "paypal.ru"]
  for (const kw of phishingKeywords) {
    if (lower.includes(kw)) {
      reasons.push(`Домен похож на известный банк/сервис (${kw})`)
      danger++
    }
  }

  const suspiciousPatterns = ["free", "bonus", "prize", "win", "lucky", "login-secure", "verify-account", "update-info"]
  for (const p of suspiciousPatterns) {
    if (lower.includes(p)) {
      reasons.push(`Подозрительное слово в адресе: «${p}»`)
      warnings++
    }
  }

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
    reasons.push("Адрес ведёт на IP-адрес вместо домена")
    danger++
  }

  if ((lower.match(/\./g) || []).length > 4) {
    reasons.push("Слишком много поддоменов — признак маскировки")
    warnings++
  }

  if (danger > 0) return { result: "danger", reasons }
  if (warnings > 0) return { result: "warning", reasons }
  return { result: "safe", reasons: ["Протокол HTTPS присутствует", "Домен выглядит безопасно", "Подозрительных паттернов не обнаружено"] }
}

const resultConfig = {
  safe: {
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: "ShieldCheck",
    iconColor: "text-emerald-400",
    title: "Безопасно!",
    sub: "Можно переходить по ссылке",
  },
  danger: {
    bg: "bg-red-500/10 border-red-500/30",
    icon: "ShieldX",
    iconColor: "text-red-400",
    title: "Опасно!",
    sub: "Это фишинговый / вредоносный сайт",
  },
  warning: {
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: "ShieldAlert",
    iconColor: "text-yellow-400",
    title: "Подозрительно",
    sub: "Будьте осторожны перед переходом",
  },
}

export default function ScannerTab() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<ScanResult>(null)
  const [reasons, setReasons] = useState<string[]>([])
  const [showReasons, setShowReasons] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const handleScan = () => {
    if (!url.trim()) return
    setLoading(true)
    setShowReasons(false)
    setTimeout(() => {
      const analysis = analyzeUrl(url)
      setResult(analysis.result)
      setReasons(analysis.reasons)
      setHistory((prev) => [
        { url: url.trim(), result: analysis.result, time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) },
        ...prev.slice(0, 4),
      ])
      setLoading(false)
    }, 1200)
  }

  const cfg = result ? resultConfig[result] : null

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Проверка ссылок</h1>
        <p className="text-white/50 text-sm mt-1">Вставьте ссылку из SMS, почты или мессенджера</p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="Link" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setResult(null) }}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="https://example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#1a6fff]/60 transition"
          />
        </div>
        <button
          onClick={handleScan}
          disabled={!url.trim() || loading}
          className="w-full bg-[#1a6fff] hover:bg-[#1558e0] disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Анализирую...
            </>
          ) : (
            <>
              <Icon name="ScanSearch" size={18} />
              Проверить
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {cfg && result && (
        <div className={`border rounded-2xl p-4 space-y-3 ${cfg.bg}`}>
          <div className="flex items-center gap-3">
            <Icon name={cfg.icon} size={28} className={cfg.iconColor} fallback="Shield" />
            <div>
              <p className="font-bold text-base">{cfg.title}</p>
              <p className="text-white/60 text-sm">{cfg.sub}</p>
            </div>
          </div>
          <button
            onClick={() => setShowReasons(!showReasons)}
            className="text-xs text-white/50 hover:text-white/80 transition flex items-center gap-1"
          >
            <Icon name="Info" size={13} />
            Почему это {result === "safe" ? "безопасно" : "опасно"}?
            <Icon name={showReasons ? "ChevronUp" : "ChevronDown"} size={13} />
          </button>
          {showReasons && (
            <ul className="space-y-1.5">
              {reasons.map((r, i) => (
                <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                  <Icon name={result === "safe" ? "Check" : "X"} size={12} className={result === "safe" ? "text-emerald-400 mt-0.5" : "text-red-400 mt-0.5"} />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">История проверок</p>
          <div className="space-y-2">
            {history.map((item, i) => {
              const c = resultConfig[item.result!]
              return (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                  <Icon name={c.icon} size={16} className={c.iconColor} fallback="Shield" />
                  <p className="text-sm text-white/70 flex-1 truncate">{item.url}</p>
                  <span className="text-xs text-white/30">{item.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
