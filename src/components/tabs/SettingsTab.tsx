import Icon from "@/components/ui/icon"

type Theme = 'dark' | 'light'

interface SettingsTabProps {
  isDark?: boolean
  theme: Theme
  onToggleTheme: () => void
  elderMode: boolean
  onToggleElderMode: () => void
}

export default function SettingsTab({ isDark = true, theme, onToggleTheme, elderMode, onToggleElderMode }: SettingsTabProps) {
  const textMain = isDark ? '#f0f4ff' : '#0d1424'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const card = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'
  const fs = elderMode ? 'text-base' : 'text-sm'
  const fsXs = elderMode ? 'text-sm' : 'text-xs'

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 transition-all duration-300"
      style={{ width: 44, height: 26 }}
    >
      <div className="w-full h-full rounded-full transition-all duration-300"
        style={{ background: value ? '#e91e8c' : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />
      <div className="absolute top-1 transition-all duration-300 w-[18px] h-[18px] rounded-full bg-white shadow"
        style={{ left: value ? 22 : 4 }} />
    </button>
  )

  const Section = ({ title }: { title: string }) => (
    <p className={`${fsXs} font-semibold uppercase tracking-wider px-1 mb-2`} style={{ color: textMuted }}>{title}</p>
  )

  const Row = ({ icon, label, desc, right }: { icon: string; label: string; desc?: string; right: React.ReactNode }) => (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(233,30,140,0.08)' }}>
        <Icon name={icon} size={16} style={{ color: '#e91e8c' }} fallback="Settings" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${fs} font-medium`} style={{ color: textMain }}>{label}</p>
        {desc && <p className={`${fsXs} mt-0.5`} style={{ color: textMuted }}>{desc}</p>}
      </div>
      {right}
    </div>
  )

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className={`font-bold ${elderMode ? 'text-3xl' : 'text-2xl'}`} style={{ color: textMain }}>Настройки</h1>
        <p className={`${fsXs} mt-1`} style={{ color: textMuted }}>Персонализация приложения</p>
      </div>

      {/* Внешний вид */}
      <div>
        <Section title="Внешний вид" />
        <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
          <Row
            icon={theme === 'dark' ? 'Moon' : 'Sun'}
            label="Тёмная тема"
            desc={theme === 'dark' ? 'Включена' : 'Выключена'}
            right={<Toggle value={theme === 'dark'} onToggle={onToggleTheme} />}
          />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(233,30,140,0.08)' }}>
              <Icon name="Type" size={16} style={{ color: '#e91e8c' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${fs} font-medium`} style={{ color: textMain }}>Режим для пожилых</p>
              <p className={`${fsXs} mt-0.5`} style={{ color: textMuted }}>
                {elderMode ? 'Крупный шрифт включён' : 'Увеличенный шрифт и упрощённый вид'}
              </p>
            </div>
            <Toggle value={elderMode} onToggle={onToggleElderMode} />
          </div>
        </div>
      </div>

      {/* Превью режима для пожилых */}
      {elderMode && (
        <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.2)' }}>
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} style={{ color: '#e91e8c' }} />
            <p className="text-base font-semibold" style={{ color: '#e91e8c' }}>Режим для пожилых включён</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
            Увеличен шрифт во всём приложении. Кнопки стали крупнее и удобнее для нажатия.
          </p>
        </div>
      )}

      {/* О приложении */}
      <div>
        <Section title="О приложении" />
        <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(233,30,140,0.08)' }}>
                <Icon name="Shield" size={16} style={{ color: '#e91e8c' }} />
              </div>
              <div>
                <p className={`${fs} font-medium`} style={{ color: textMain }}>КиберЩит</p>
                <p className={`${fsXs}`} style={{ color: textMuted }}>Версия 1.0 · Защита в интернете</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(233,30,140,0.08)' }}>
                <Icon name="Lock" size={16} style={{ color: '#e91e8c' }} />
              </div>
              <div>
                <p className={`${fs} font-medium`} style={{ color: textMain }}>Конфиденциальность</p>
                <p className={`${fsXs}`} style={{ color: textMuted }}>Все данные хранятся только на вашем устройстве</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(233,30,140,0.08)' }}>
                <Icon name="WifiOff" size={16} style={{ color: '#e91e8c' }} />
              </div>
              <div>
                <p className={`${fs} font-medium`} style={{ color: textMain }}>Работает офлайн</p>
                <p className={`${fsXs}`} style={{ color: textMuted }}>Доступно без интернета после первого запуска</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Сброс данных */}
      <div>
        <Section title="Данные" />
        <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:opacity-70"
            onClick={() => {
              if (confirm('Сбросить прогресс чек-листа?')) {
                localStorage.removeItem('cybershield_checklist')
                window.location.reload()
              }
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Icon name="RotateCcw" size={16} style={{ color: '#ef4444' }} />
            </div>
            <div className="text-left">
              <p className={`${fs} font-medium`} style={{ color: '#ef4444' }}>Сбросить чек-лист</p>
              <p className={`${fsXs}`} style={{ color: textMuted }}>Снять все отметки и начать заново</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
