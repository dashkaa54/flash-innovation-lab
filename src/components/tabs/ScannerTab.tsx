import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const CHECK_URL_API = "https://functions.poehali.dev/71cad6d1-6731-4b39-b53e-ec6cd87294c3"

type ScanResult = "safe" | "danger" | "warning" | null

interface HistoryItem {
  url: string
  result: ScanResult
  time: string
  date: string
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
  safe: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)", icon: "ShieldCheck", iconColor: "#10b981", title: "Безопасно!", sub: "Можно переходить по ссылке" },
  danger: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", icon: "ShieldX", iconColor: "#ef4444", title: "Опасно!", sub: "Это фишинговый / вредоносный сайт" },
  warning: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.3)", icon: "ShieldAlert", iconColor: "#eab308", title: "Подозрительно", sub: "Будьте осторожны перед переходом" },
}

const STORAGE_KEY = "cybershield_scan_history"

export default function ScannerTab({ isDark = true }: { isDark?: boolean }) {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<ScanResult>(null)
  const [reasons, setReasons] = useState<string[]>([])
  const [showReasons, setShowReasons] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const handleScan = async () => {
    if (!url.trim()) return
    setLoading(true)
    setShowReasons(false)

    const localAnalysis = analyzeUrl(url)
    let finalResult = localAnalysis.result
    let finalReasons = localAnalysis.reasons

    try {
      const resp = await fetch(CHECK_URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data.safe === false && data.threat) {
          finalResult = "danger"
          finalReasons = [`🛡 Google Safe Browsing: ${data.threat}`, ...localAnalysis.reasons]
        } else if (data.safe === true && finalResult !== "danger") {
          if (finalResult === "safe") {
            finalReasons = ["✅ Проверено Google Safe Browsing — угроз не найдено", ...finalReasons]
          }
        }
      }
    } catch {
      // нет сети — используем только локальный анализ
    }

    setResult(finalResult)
    setReasons(finalReasons)
    const now = new Date()
    setHistory((prev) => [
      {
        url: url.trim(),
        result: finalResult,
        time: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        date: now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      },
      ...prev.slice(0, 19),
    ])
    setLoading(false)
  }

  const handleShare = (scanUrl: string, scanResult: ScanResult, scanReasons: string[]) => {
    const label = scanResult === "safe" ? "✅ Безопасно" : scanResult === "danger" ? "🚨 Опасно" : "⚠️ Подозрительно"
    const text = `КиберЩит проверил ссылку:\n${scanUrl}\n\nРезультат: ${label}\n${scanReasons.slice(0, 2).join('\n')}`
    if (navigator.share) {
      navigator.share({ title: 'Результат проверки КиберЩит', text })
    } else {
      navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const cfg = result ? resultConfig[result] : null

  // Цвета по теме
  const textMain = isDark ? '#f0f4ff' : '#0d1424'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const textLight = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
  const historyItemBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  return (
    <div className="px-5 py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textMain }}>Проверка ссылок</h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>Вставьте ссылку из SMS, почты или мессенджера</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg mt-1 font-semibold"
            style={{ background: 'hsla(328,80%,50%,0.12)', color: '#e91e8c' }}
          >
            <Icon name="History" size={13} />
            {history.length}
          </button>
        )}
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="Link" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textLight }} />
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setResult(null) }}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="https://example.com"
            className="w-full rounded-xl pl-9 pr-4 py-3.5 text-sm focus:outline-none transition"
            style={{
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              color: textMain,
            }}
          />
        </div>
        <button
          onClick={handleScan}
          disabled={!url.trim() || loading}
          className="w-full disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          style={{ background: '#e91e8c' }}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Анализирую...</>
          ) : (
            <><Icon name="ScanSearch" size={18} />Проверить</>
          )}
        </button>
      </div>

      {/* Result */}
      {cfg && result && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <div className="flex items-center gap-3">
            <Icon name={cfg.icon} size={28} style={{ color: cfg.iconColor }} fallback="Shield" />
            <div>
              <p className="font-bold text-base" style={{ color: textMain }}>{cfg.title}</p>
              <p className="text-sm" style={{ color: textMuted }}>{cfg.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReasons(!showReasons)}
              className="text-xs flex items-center gap-1 transition hover:opacity-80"
              style={{ color: textMuted }}
            >
              <Icon name="Info" size={13} />
              Почему это {result === "safe" ? "безопасно" : "опасно"}?
              <Icon name={showReasons ? "ChevronUp" : "ChevronDown"} size={13} />
            </button>
            <button
              onClick={() => handleShare(url, result, reasons)}
              className="ml-auto text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-semibold"
              style={{ background: 'rgba(233,30,140,0.12)', color: '#e91e8c' }}
            >
              <Icon name={shared ? "Check" : "Share2"} size={12} />
              {shared ? "Скопировано" : "Поделиться"}
            </button>
          </div>
          {showReasons && (
            <ul className="space-y-1.5">
              {reasons.map((r, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: textMuted }}>
                  <Icon
                    name={result === "safe" ? "Check" : "X"}
                    size={12}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: result === "safe" ? "#10b981" : "#ef4444" }}
                  />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* History */}
      {showHistory && history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textLight }}>История проверок</p>
            <button
              onClick={clearHistory}
              className="text-xs flex items-center gap-1 transition hover:text-red-400"
              style={{ color: textLight }}
            >
              <Icon name="Trash2" size={12} />
              Очистить
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item, i) => {
              const c = resultConfig[item.result!]
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition hover:opacity-80"
                  style={{ background: historyItemBg }}
                  onClick={() => { setUrl(item.url); setResult(null) }}
                >
                  <Icon name={c.icon} size={16} style={{ color: c.iconColor }} fallback="Shield" />
                  <p className="text-sm flex-1 truncate" style={{ color: textMuted }}>{item.url}</p>
                  <span className="text-xs shrink-0" style={{ color: textLight }}>{item.date} {item.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
