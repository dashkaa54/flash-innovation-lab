import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const MASTER_KEY = "cybershield_master_hash"
const VAULT_KEY = "cybershield_vault"

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(36)
}

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

  const hasMaster = !!localStorage.getItem(MASTER_KEY)
  const [masterUnlocked, setMasterUnlocked] = useState(false)
  const [masterInput, setMasterInput] = useState("")
  const [masterConfirm, setMasterConfirm] = useState("")
  const [masterError, setMasterError] = useState("")

  const [saved, setSaved] = useState<SavedPassword[]>([])
  const [saveLabel, setSaveLabel] = useState("")
  const [saveLogin, setSaveLogin] = useState("")
  const [savePassword, setSavePassword] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (masterUnlocked) {
      try {
        const raw = localStorage.getItem(VAULT_KEY)
        if (raw) setSaved(JSON.parse(raw))
      } catch { setSaved([]) }
    }
  }, [masterUnlocked])

  useEffect(() => {
    if (masterUnlocked) {
      localStorage.setItem(VAULT_KEY, JSON.stringify(saved))
    }
  }, [saved, masterUnlocked])

  const handleUnlock = () => {
    const stored = localStorage.getItem(MASTER_KEY)
    if (stored === simpleHash(masterInput)) {
      setMasterUnlocked(true)
      setMasterError("")
      setMasterInput("")
    } else {
      setMasterError("Неверный мастер-пароль")
    }
  }

  const handleSetMaster = () => {
    if (masterInput.length < 4) { setMasterError("Минимум 4 символа"); return }
    if (masterInput !== masterConfirm) { setMasterError("Пароли не совпадают"); return }
    localStorage.setItem(MASTER_KEY, simpleHash(masterInput))
    setMasterUnlocked(true)
    setMasterInput("")
    setMasterConfirm("")
    setMasterError("")
  }

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

  const filteredSaved = saved.filter((p) =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.login.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Цвета по теме
  const textMain = isDark ? '#f0f4ff' : '#0d1424'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const textLight = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  const card = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)'
  const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const toggleOff = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
  const emptyBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: textMain }}>Безопасность</h1>
        <p className="text-sm mt-1" style={{ color: textMuted }}>Проверьте и создайте надёжные пароли</p>
      </div>

      {/* Password Checker */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: card, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center gap-2 mb-1">
          <Icon name="KeyRound" size={18} className="text-[#e91e8c]" />
          <p className="font-semibold" style={{ color: textMain }}>Проверка пароля</p>
        </div>
        <div className="relative">
          <input
            type={showCheck ? "text" : "password"}
            value={checkPwd}
            onChange={(e) => setCheckPwd(e.target.value)}
            placeholder="Введите свой пароль"
            className={inputClass}
            style={{ background: inputBg, border: inputBorder, color: textMain }}
          />
          <button onClick={() => setShowCheck(!showCheck)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60" style={{ color: textMain }}>
            <Icon name={showCheck ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
        {checkPwd && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : ""}`}
                  style={{ background: i <= strength.level ? undefined : divider }} />
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
                  <li key={i} className="text-xs flex items-center gap-1.5" style={{ color: textMuted }}>
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
      <div className="rounded-2xl p-4 space-y-4" style={{ background: card, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center gap-2">
          <Icon name="Wand2" size={18} className="text-[#e91e8c]" />
          <p className="font-semibold" style={{ color: textMain }}>Генератор паролей</p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span style={{ color: textMuted }}>Длина</span>
            <span className="font-mono font-semibold" style={{ color: textMain }}>{pwdLength}</span>
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
                className="w-10 h-5 rounded-full transition-all relative flex-shrink-0"
                style={{ background: opt.value ? '#e91e8c' : toggleOff }}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${opt.value ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm" style={{ color: textMuted }}>{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={handleGenerate}
          className="w-full text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          style={{ background: '#e91e8c' }}>
          <Icon name="RefreshCw" size={16} />
          Сгенерировать
        </button>

        {generated && (
          <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
            <p className="font-mono text-sm flex-1 break-all" style={{ color: '#10b981' }}>{generated}</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => handleCopy(generated)} className="hover:opacity-80 transition p-1" style={{ color: textMuted }}>
                <Icon name={copied ? "Check" : "Copy"} size={18} />
              </button>
              <button onClick={openSaveForm} className="hover:text-[#e91e8c] transition p-1" style={{ color: textMuted }}>
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
              className={inputClass}
              style={{ background: inputBg, border: inputBorder, color: textMain }}
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 text-white text-sm py-2 rounded-lg transition font-semibold" style={{ background: '#10b981' }}>Сохранить</button>
              <button onClick={() => setShowSaveForm(false)} className="flex-1 text-sm py-2 rounded-lg transition font-semibold" style={{ background: inputBg, color: textMuted }}>Отмена</button>
            </div>
          </div>
        )}
      </div>

      {/* Мои пароли */}
      <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'hsla(328,80%,50%,0.15)' }}>
              <Icon name="Lock" size={18} style={{ color: '#e91e8c' }} />
            </div>
            <span className="font-semibold" style={{ color: textMain }}>Мои пароли</span>
          </div>
          {masterUnlocked && (
            <button onClick={openSaveForm}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'hsla(328,80%,50%,0.15)', color: '#e91e8c' }}>
              <Icon name="Plus" size={18} />
            </button>
          )}
        </div>

        {/* Мастер-пароль */}
        {!masterUnlocked && (
          <div className="px-4 pb-5 pt-2 flex flex-col items-center gap-4" style={{ borderTop: `1px solid ${divider}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(233,30,140,0.1)' }}>
              <Icon name="ShieldCheck" size={26} style={{ color: '#e91e8c' }} />
            </div>
            {!hasMaster ? (
              <>
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color: textMain }}>Создайте мастер-пароль</p>
                  <p className="text-xs mt-1" style={{ color: textMuted }}>Он защитит все ваши пароли</p>
                </div>
                <div className="w-full space-y-2">
                  <input type="password" value={masterInput}
                    onChange={(e) => { setMasterInput(e.target.value); setMasterError("") }}
                    placeholder="Придумайте мастер-пароль"
                    className={inputClass}
                    style={{ background: inputBg, border: inputBorder, color: textMain }}
                  />
                  <input type="password" value={masterConfirm}
                    onChange={(e) => { setMasterConfirm(e.target.value); setMasterError("") }}
                    placeholder="Повторите пароль"
                    onKeyDown={(e) => e.key === "Enter" && handleSetMaster()}
                    className={inputClass}
                    style={{ background: inputBg, border: inputBorder, color: textMain }}
                  />
                  {masterError && <p className="text-xs text-red-400">{masterError}</p>}
                  <button onClick={handleSetMaster}
                    className="w-full text-white text-sm py-3 rounded-xl font-semibold transition"
                    style={{ background: '#e91e8c' }}>
                    Создать и войти
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color: textMain }}>Введите мастер-пароль</p>
                  <p className="text-xs mt-1" style={{ color: textMuted }}>Для доступа к хранилищу</p>
                </div>
                <div className="w-full space-y-2">
                  <input type="password" value={masterInput}
                    onChange={(e) => { setMasterInput(e.target.value); setMasterError("") }}
                    placeholder="Мастер-пароль"
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    className={inputClass}
                    style={{ background: inputBg, border: inputBorder, color: textMain }}
                  />
                  {masterError && <p className="text-xs text-red-400">{masterError}</p>}
                  <button onClick={handleUnlock}
                    className="w-full text-white text-sm py-3 rounded-xl font-semibold transition"
                    style={{ background: '#e91e8c' }}>
                    Открыть хранилище
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {masterUnlocked && showSaveForm && (
          <div className="px-4 pb-4 space-y-3 pt-4" style={{ borderTop: `1px solid ${divider}` }}>
            <p className="font-semibold text-sm" style={{ color: textMain }}>Добавить новый пароль</p>
            <input value={saveLabel} onChange={(e) => setSaveLabel(e.target.value)}
              placeholder="Название сервиса"
              className={inputClass}
              style={{ background: inputBg, border: inputBorder, color: textMain }}
            />
            <input value={saveLogin} onChange={(e) => setSaveLogin(e.target.value)}
              placeholder="Логин или email"
              className={inputClass}
              style={{ background: inputBg, border: inputBorder, color: textMain }}
            />
            <input value={savePassword} onChange={(e) => setSavePassword(e.target.value)}
              placeholder="Пароль"
              className={`${inputClass} font-mono`}
              style={{ background: inputBg, border: inputBorder, color: textMain }}
            />
            <div className="flex gap-3 pt-1">
              <button onClick={handleSave}
                className="flex-1 text-white text-sm py-3 rounded-xl transition font-semibold"
                style={{ background: '#e91e8c' }}>
                Сохранить
              </button>
              <button onClick={() => { setShowSaveForm(false); setSaveLabel(''); setSaveLogin(''); setSavePassword('') }}
                className="flex-1 text-sm py-3 rounded-xl transition font-semibold"
                style={{ background: inputBg, color: textMuted }}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {masterUnlocked && saved.length === 0 && !showSaveForm && (
          <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ borderTop: `1px solid ${divider}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: emptyBg }}>
              <Icon name="Lock" size={26} style={{ color: textLight }} />
            </div>
            <p className="text-sm" style={{ color: textLight }}>Здесь будут сохранённые пароли</p>
          </div>
        )}

        {masterUnlocked && saved.length > 0 && (
          <div style={{ borderTop: `1px solid ${divider}` }}>
            <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${divider}` }}>
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textLight }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по паролям..."
                  className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none transition"
                  style={{ background: inputBg, border: inputBorder, color: textMain }}
                />
              </div>
            </div>
            {filteredSaved.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: textLight }}>Ничего не найдено</p>
            ) : (
              filteredSaved.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: inputBg }}>
                    <Icon name="KeyRound" size={14} style={{ color: textLight }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: textMain }}>{p.label}</p>
                    {p.login && <p className="text-xs truncate" style={{ color: textMuted }}>{p.login}</p>}
                    <p className="font-mono text-xs truncate" style={{ color: textMuted }}>{p.hidden ? "••••••••••••" : p.password}</p>
                  </div>
                  <button onClick={() => toggleHidden(p.id)} className="hover:opacity-80 transition p-1" style={{ color: textLight }}>
                    <Icon name={p.hidden ? "Eye" : "EyeOff"} size={15} />
                  </button>
                  <button onClick={() => handleCopy(p.password)} className="hover:opacity-80 transition p-1" style={{ color: textLight }}>
                    <Icon name="Copy" size={15} />
                  </button>
                  <button onClick={() => removeSaved(p.id)} className="hover:text-red-400 transition p-1" style={{ color: textLight }}>
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
