import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const initialTasks = [
  { id: 1, text: "Создать сложный пароль для почты", detail: "Минимум 12 символов с цифрами и спецсимволами", icon: "Mail" },
  { id: 2, text: "Включить двухфакторную аутентификацию", detail: "В ВКонтакте, Telegram, Google и других сервисах", icon: "ShieldCheck" },
  { id: 3, text: "Установить антивирус на устройство", detail: "Kaspersky, Dr.Web или встроенный Windows Defender", icon: "Shield" },
  { id: 4, text: "Сделать резервную копию важных фото", detail: "Загрузите в облако — Google Фото, Яндекс Диск", icon: "Cloud" },
  { id: 5, text: "Проверить настройки приватности в соцсетях", detail: "Скройте номер телефона и дату рождения от чужих", icon: "Lock" },
  { id: 6, text: "Обновить операционную систему", detail: "Устаревшие версии содержат уязвимости", icon: "RefreshCw" },
  { id: 7, text: "Проверить список приложений с доступом к геолокации", detail: "Оставьте только те, которым действительно нужен доступ", icon: "MapPin" },
]

const CHECKLIST_KEY = "cybershield_checklist"

export default function ChecklistTab({ isDark = true }: { isDark?: boolean }) {
  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY)
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>()
    } catch { return new Set<number>() }
  })
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...checked]))
  }, [checked])

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const done = checked.size
  const total = initialTasks.length
  const progress = Math.round((done / total) * 100)

  const getMessage = () => {
    if (done === 0) return "Начните с первого пункта — это займёт 5 минут"
    if (done < 3) return "Хорошее начало! Продолжайте"
    if (done < total) return "Вы на верном пути к защите!"
    return "Отлично! Вы под надёжной защитой 🛡️"
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Чек-лист</h1>
        <p className="text-white/50 text-sm mt-1">Привычки, которые защитят вас в интернете</p>
      </div>

      {/* Progress */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Прогресс защиты</p>
          <span className="text-2xl font-bold text-[#e91e8c]">{done}<span className="text-white/30 text-base font-normal">/{total}</span></span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#e91e8c] to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/50">{getMessage()}</p>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {initialTasks.map((task) => {
          const isChecked = checked.has(task.id)
          const isExpanded = expanded === task.id
          return (
            <div key={task.id}
              className={`border rounded-2xl transition-all ${isChecked ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/8"}`}>
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : task.id)}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(task.id) }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isChecked ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-white/40"
                  }`}
                >
                  {isChecked && <Icon name="Check" size={12} className="text-white" />}
                </button>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isChecked ? "bg-emerald-500/20" : "bg-white/8"}`}>
                  <Icon name={task.icon} size={15} className={isChecked ? "text-emerald-400" : "text-white/50"} fallback="CheckCircle" />
                </div>
                <p className={`text-sm flex-1 ${isChecked ? "line-through text-white/40" : "text-white"}`}>{task.text}</p>
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-white/30 flex-shrink-0" />
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-xs text-white/50 ml-[4.5rem]">{task.detail}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {done === total && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
          <Icon name="Trophy" size={28} className="text-emerald-400 mx-auto" />
          <p className="font-bold">Все задачи выполнены!</p>
          <p className="text-xs text-white/50">Ваша цифровая безопасность на высшем уровне</p>
        </div>
      )}
    </div>
  )
}