import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const initialTasks = [
  { id: 1, text: "Создать сложный пароль для почты", detail: "Минимум 12 символов с цифрами и спецсимволами. Почта — ключ ко всем аккаунтам.", icon: "Mail" },
  { id: 2, text: "Включить двухфакторную аутентификацию", detail: "В ВКонтакте, Telegram, Google и других сервисах. Используйте приложение-аутентификатор.", icon: "ShieldCheck" },
  { id: 3, text: "Включить 2FA на Госуслугах", detail: "Настройки → Безопасность → Вход с подтверждением. Госуслуги дают доступ к паспорту и налогам.", icon: "Building2" },
  { id: 4, text: "Установить антивирус на устройство", detail: "Kaspersky, Dr.Web или встроенный Windows Defender. Обновляйте базы каждую неделю.", icon: "Shield" },
  { id: 5, text: "Сделать резервную копию важных фото", detail: "Загрузите в облако — Google Фото, Яндекс Диск или iCloud. Правило 3-2-1: 3 копии, 2 носителя, 1 в облаке.", icon: "Cloud" },
  { id: 6, text: "Проверить настройки приватности в соцсетях", detail: "Скройте номер телефона и дату рождения от чужих. Закройте профиль от незнакомых.", icon: "Lock" },
  { id: 7, text: "Обновить операционную систему", detail: "Устаревшие версии содержат уязвимости. Включите автообновление чтобы не забывать.", icon: "RefreshCw" },
  { id: 8, text: "Проверить список приложений с доступом к геолокации", detail: "Оставьте только те, которым действительно нужен доступ. Фонарику геолокация не нужна.", icon: "MapPin" },
  { id: 9, text: "Проверить свой email на утечки", detail: "Зайдите на haveibeenpwned.com и введите вашу почту. Если нашли — смените пароль на этом сервисе.", icon: "Search" },
  { id: 10, text: "Настроить «Найти устройство»", detail: "Android: find.google.com | iPhone: Настройки → Apple ID → Локатор. Поможет заблокировать телефон при краже.", icon: "Smartphone" },
  { id: 11, text: "Использовать разные пароли на разных сайтах", detail: "Установите менеджер паролей — Bitwarden (бесплатно) или 1Password. Один мастер-пароль вместо сотни.", icon: "KeyRound" },
  { id: 12, text: "Проверить разрешения приложений (камера, микрофон)", detail: "Настройки → Конфиденциальность. Отзовите доступ у тех, кому он не нужен для работы.", icon: "Camera" },
  { id: 13, text: "Установить PIN или биометрию на телефон", detail: "Без блокировки экрана любой может зайти в ваш телефон. Минимум — 6-значный PIN.", icon: "Fingerprint" },
  { id: 14, text: "Предупредить пожилых родственников о мошенниках", detail: "Расскажите о звонках «из банка», схемах с переводами и фишинговых письмах. Они чаще становятся жертвами.", icon: "Users" },
]

const CHECKLIST_KEY = "cybershield_checklist"

export default function ChecklistTab({ isDark = true, elderMode = false }: { isDark?: boolean; elderMode?: boolean }) {
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
    if (done < 4) return "Хорошее начало! Продолжайте"
    if (done < 8) return "Вы на верном пути к защите!"
    if (done < total) return "Почти готово — осталось совсем немного!"
    return "Отлично! Вы под надёжной защитой"
  }

  const card = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const textMain = isDark ? '#f0f4ff' : '#0d1424'
  const fs = elderMode ? 'text-base' : 'text-sm'
  const fsXs = elderMode ? 'text-sm' : 'text-xs'

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className={`font-bold ${elderMode ? 'text-3xl' : 'text-2xl'}`} style={{ color: textMain }}>Чек-лист</h1>
        <p className={`${fsXs} mt-1`} style={{ color: textMuted }}>Привычки, которые защитят вас в интернете</p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between">
          <p className={`${fs} font-semibold`} style={{ color: textMain }}>Прогресс защиты</p>
          <span className={`font-bold ${elderMode ? 'text-3xl' : 'text-2xl'}`} style={{ color: '#e91e8c' }}>
            {done}<span className={`font-normal ${elderMode ? 'text-lg' : 'text-base'}`} style={{ color: textMuted }}>/{total}</span>
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #e91e8c, #10b981)' }}
          />
        </div>
        <p className={fsXs} style={{ color: textMuted }}>{getMessage()}</p>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {initialTasks.map((task) => {
          const isChecked = checked.has(task.id)
          const isExpanded = expanded === task.id
          return (
            <div key={task.id}
              className="rounded-2xl transition-all"
              style={{
                background: isChecked ? 'rgba(16,185,129,0.06)' : card,
                border: `1px solid ${isChecked ? 'rgba(16,185,129,0.2)' : border}`,
              }}>
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : task.id)}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(task.id) }}
                  className={`${elderMode ? 'w-8 h-8' : 'w-6 h-6'} rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all`}
                  style={isChecked
                    ? { background: '#10b981', borderColor: '#10b981' }
                    : { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                >
                  {isChecked && <Icon name="Check" size={elderMode ? 14 : 12} className="text-white" />}
                </button>
                <div className={`${elderMode ? 'w-10 h-10' : 'w-8 h-8'} rounded-lg flex items-center justify-center flex-shrink-0`}
                  style={{ background: isChecked ? 'rgba(16,185,129,0.15)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <Icon name={task.icon} size={elderMode ? 18 : 15} className={isChecked ? 'text-emerald-400' : ''} style={{ color: isChecked ? undefined : textMuted }} fallback="CheckCircle" />
                </div>
                <p className={`${fs} flex-1`} style={{ color: isChecked ? textMuted : textMain, textDecoration: isChecked ? 'line-through' : 'none' }}>{task.text}</p>
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} style={{ color: textMuted, flexShrink: 0 }} />
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  <p className={`${fsXs} leading-relaxed`} style={{ color: textMuted, marginLeft: elderMode ? '5.5rem' : '4.5rem' }}>{task.detail}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {done === total && (
        <div className="rounded-2xl p-4 text-center space-y-1" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <Icon name="Trophy" size={28} className="text-emerald-400 mx-auto" />
          <p className={`font-bold ${fs}`} style={{ color: textMain }}>Все задачи выполнены!</p>
          <p className={fsXs} style={{ color: textMuted }}>Ваша цифровая безопасность на высшем уровне</p>
        </div>
      )}
    </div>
  )
}
