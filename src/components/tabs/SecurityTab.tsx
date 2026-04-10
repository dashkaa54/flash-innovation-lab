import { useState } from "react"
import Icon from "@/components/ui/icon"

function getPasswordStrength(pwd: string): { level: 0 | 1 | 2 | 3; label: string; color: string; tips: string[] } {
  if (!pwd) return { level: 0, label: "", color: "", tips: [] }
  const tips: string[] = []
  let score = 0
  if (pwd.length >= 8) score++; else tips.push("Увеличьте длину до 8+ символов")
  if (pwd.length >= 12) score++; else if (pwd.length >= 8) tips.push("Ещё лучше — 12+ символов")
  if (/[A-Z]/.test(pwd)) score++; else tips.push("Добавьте заглавные буквы")
  if (/[0-9]/.test(pwd)) score++; else tips.push("Добавьте цифры")
  if (/[^A-Za-z0-9]/.test(pwd)) score++; else tips.push("Используйте спецсимволы (!@#$%)")

  if (score <= 2) return { level: 1, label: "Слабый", color: "bg-red-500", tips }
  if (score <= 3) return { level: 2, label: "Средний", color: "bg-yellow-500", tips }
  return { level: 3, label: "Надёжный", color: "bg-emerald-500", tips }
}

function generatePassword(length: number, upper: boolean, nums: boolean, symbols: boolean): string {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const num = "0123456789"
  const sym = "!@#$%^&*()-_=+"
  let chars = lower
  if (upper) chars += up
  if (nums) chars += num
  if (symbols) chars += sym
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

interface SavedPassword {
  id: number
  label: string
  login: string
  password: string
  hidden: boolean
}

export default function SecurityTab({ isDark = true }: { isDark?: boolean }) {
  const [checkPwd, setCheckPwd] = useState("")
  const [showCheck, setShowCheck] = useState(false)
  const strength = getPasswordStrength(checkPwd)

  const [pwdLength, setPwdLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useNums, setUseNums] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [generated, setGenerated] = useState("")
  const [copied, setCopied] = useState(false)

  const [saved, setSaved] = useState<SavedPassword[]>([])
  const [saveLabel, setSaveLabel] = useState("")
  const [saveLogin, setSaveLogin] = useState("")
  const [savePassword, setSavePassword] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const card = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const input = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'

  const filteredSaved = saved.filter((p) =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.login.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleGenerate = () => {
    const pwd = generatePassword(pwdLength, useUpper, useNums, useSymbols)
    setGenerated(pwd)
    setSavePassword(pwd)
    setCopied(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (!saveLabel.trim() || !savePassword.trim()) return
    setSaved((prev) => [...prev, { id: Date.now(), label: saveLabel.trim(), login: saveLogin.trim(), password: savePassword.trim(), hidden: true }])
    setSaveLabel("")
    setSaveLogin("")
    setSavePassword("")
    setShowSaveForm(false)
  }

  const openSaveForm = () => {
    setSavePassword(generated)
    setShowSaveForm(true)
  }

  const toggleHidden = (id: number) => {
    setSaved((prev) => prev.map((p) => p.id === id ? { ...p, hidden: !p.hidden } : p))
  }

  const removeSaved = (id: number) => {
    setSaved((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Безопасность</h1>
        <p className="text-sm mt-1 opacity-50">Проверьте и создайте надёжные пароли</p>
      </div>

      {/* Password Checker */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="flex items-center gap-2 mb-1">
          <Icon name="KeyRound" size={18} className="text-[#e91e8c]" />
          <p className="font-semibold">Проверка пароля</p>
        </div>
        <div className="relative">
          <input
            type={showCheck ? "text" : "password"}
            value={checkPwd}
            onChange={(e) => setCheckPwd(e.target.value)}
            placeholder="Введите свой пароль"
            className="w-full rounded-xl px-4 pr-10 py-3 text-sm placeholder:opacity-25 focus:outline-none transition"
            style={{ background: input, border: inputBorder }}
          />
          <button onClick={() => setShowCheck(!showCheck)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60">
            <Icon name={showCheck ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
        {checkPwd && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : "bg-white/10"}`} />
              ))}
            </div>
            {strength.label && (
              <p className="text-xs font-medium" style={{ color: strength.level === 1 ? "#ef4444" : strength.level === 2 ? "#eab308" : "#10b981" }}>
                {strength.label}
              </p>
            )}
            {strength.tips.length > 0 && (
              <ul className="space-y-1">
                {strength.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-white/50 flex items-center gap-1.5">
                    <Icon name="ArrowRight" size={11} />
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Generator */}
      <div className="rounded-2xl p-4 space-y-4" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <Icon name="Wand2" size={18} className="text-[#e91e8c]" />
          <p className="font-semibold">Генератор паролей</p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Длина</span>
            <span className="text-white font-mono">{pwdLength}</span>
          </div>
          <input type="range" min={8} max={32} value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))}
            className="w-full accent-[#e91e8c]" />
        </div>

        <div className="space-y-2">
          {[
            { label: "Заглавные буквы (A-Z)", value: useUpper, set: setUseUpper },
            { label: "Цифры (0-9)", value: useNums, set: setUseNums },
            { label: "Спецсимволы (!@#$)", value: useSymbols, set: setUseSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => opt.set(!opt.value)}
                className={`w-10 h-5 rounded-full transition-all relative ${opt.value ? "bg-[#e91e8c]" : "bg-white/15"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${opt.value ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-white/70">{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={handleGenerate}
          className="w-full bg-[#e91e8c] hover:bg-[#c4177a] text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
          <Icon name="RefreshCw" size={16} />
          Сгенерировать
        </button>

        {generated && (
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2 border border-white/10">
            <p className="font-mono text-sm text-emerald-300 flex-1 break-all">{generated}</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => handleCopy(generated)} className="text-white/40 hover:text-white transition">
                <Icon name={copied ? "Check" : "Copy"} size={18} />
              </button>
              <button onClick={openSaveForm} className="text-white/40 hover:text-[#e91e8c] transition">
                <Icon name="Save" size={18} />
              </button>
            </div>
          </div>
        )}

        {showSaveForm && (
          <div className="space-y-2">
            <input
              value={saveLabel}
              onChange={(e) => setSaveLabel(e.target.value)}
              placeholder="Название (например: Почта Google)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#1a6fff]/60 transition"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 rounded-lg transition">Сохранить</button>
              <button onClick={() => setShowSaveForm(false)} className="flex-1 bg-white/10 hover:bg-white/15 text-white text-sm py-2 rounded-lg transition">Отмена</button>
            </div>
          </div>
        )}
      </div>

      {/* Мои пароли */}
      <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'hsla(328,80%,50%,0.18)' }}>
              <Icon name="Lock" size={18} style={{ color: '#e91e8c' }} />
            </div>
            <span className="font-semibold">Мои пароли</span>
          </div>
          <button
            onClick={openSaveForm}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'hsla(328,80%,50%,0.18)', color: '#e91e8c' }}
          >
            <Icon name="Plus" size={18} />
          </button>
        </div>

        {showSaveForm && (
          <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-4">
            <p className="font-semibold text-white text-sm">Добавить новый пароль</p>
            <input
              value={saveLabel}
              onChange={(e) => setSaveLabel(e.target.value)}
              placeholder="Название сервиса"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <input
              value={saveLogin}
              onChange={(e) => setSaveLogin(e.target.value)}
              placeholder="Логин или email"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <input
              value={savePassword}
              onChange={(e) => setSavePassword(e.target.value)}
              placeholder="Пароль"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition font-mono"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 text-white text-sm py-3 rounded-xl transition font-semibold"
                style={{ background: '#e91e8c' }}
              >
                Сохранить
              </button>
              <button
                onClick={() => { setShowSaveForm(false); setSaveLabel(''); setSaveLogin(''); setSavePassword('') }}
                className="flex-1 text-white/70 text-sm py-3 rounded-xl transition font-semibold"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {saved.length === 0 && !showSaveForm ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border-t border-white/8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Icon name="Lock" size={26} className="text-white/20" />
            </div>
            <p className="text-sm text-white/30">Здесь будут сохранённые пароли</p>
          </div>
        ) : (
          saved.length > 0 && (
            <div style={{ borderTop: `1px solid ${border}` }}>
              {/* Search */}
              <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="relative">
                  <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по паролям..."
                    className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none transition"
                    style={{ background: input, border: inputBorder }}
                  />
                </div>
              </div>
              <div style={{ divide: border }}>
                {filteredSaved.length === 0 ? (
                  <p className="text-xs opacity-30 text-center py-4">Ничего не найдено</p>
                ) : (
                  filteredSaved.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: input }}>
                        <Icon name="KeyRound" size={14} className="opacity-40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{p.label}</p>
                        {p.login && <p className="text-xs opacity-40 truncate">{p.login}</p>}
                        <p className="font-mono text-xs opacity-40 truncate">{p.hidden ? "••••••••••••" : p.password}</p>
                      </div>
                      <button onClick={() => toggleHidden(p.id)} className="opacity-30 hover:opacity-60 p-1">
                        <Icon name={p.hidden ? "Eye" : "EyeOff"} size={15} />
                      </button>
                      <button onClick={() => handleCopy(p.password)} className="opacity-30 hover:opacity-60 p-1">
                        <Icon name="Copy" size={15} />
                      </button>
                      <button onClick={() => removeSaved(p.id)} className="opacity-30 hover:text-red-400 p-1">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}