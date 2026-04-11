import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import BottomNav from "@/components/BottomNav"
import ScannerTab from "@/components/tabs/ScannerTab"
import SecurityTab from "@/components/tabs/SecurityTab"
import KnowledgeTab from "@/components/tabs/KnowledgeTab"
import ChecklistTab from "@/components/tabs/ChecklistTab"
import SOSTab from "@/components/tabs/SOSTab"
import SettingsTab from "@/components/tabs/SettingsTab"
import Icon from "@/components/ui/icon"
import { useTheme } from "@/hooks/useTheme"

type Tab = 'scanner' | 'security' | 'knowledge' | 'checklist' | 'sos' | 'settings'

const darkBg = '#0d1424'
const lightBg = '#f0f4ff'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('scanner')
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const [elderMode, setElderMode] = useState(() => {
    try { return localStorage.getItem('cybershield_elder') === '1' } catch { return false }
  })

  const toggleElderMode = () => {
    setElderMode(v => {
      const next = !v
      localStorage.setItem('cybershield_elder', next ? '1' : '0')
      return next
    })
  }

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showApkMenu, setShowApkMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showIosBanner, setShowIosBanner] = useState(false)

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) { setInstalled(true); return }

    const dismissed = localStorage.getItem('pwa_banner_dismissed')
    if (dismissed) return

    if (isIos && isSafari) {
      setTimeout(() => setShowIosBanner(true), 1500)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa_banner_dismissed', '1')
  }

  const tabProps = { isDark, elderMode }

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        background: isDark ? darkBg : lightBg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        color: isDark ? '#f0f4ff' : '#0d1424',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* APK download button */}
      {!installed && (
        <div
          className="fixed top-4 z-50"
          style={{ left: 'min(calc(50% - 215px + 16px), 16px)' }}
        >
          <button
            onClick={() => setShowApkMenu(v => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
            }}
            title="Скачать приложение"
          >
            <Icon name="Download" size={18} />
          </button>
          {showApkMenu && (
            <div
              className="absolute top-11 left-0 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl min-w-[180px]"
              style={{
                background: isDark ? '#1a2035' : '#ffffff',
                border: '1px solid rgba(233,30,140,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              <p className="text-xs font-semibold opacity-50 px-1">Скачать приложение</p>
              <div
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🍎</span>
                  <p className="text-xs font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>iPhone / iPad</p>
                </div>
                {[
                  { icon: '1️⃣', text: 'Открой сайт в Safari' },
                  { icon: '2️⃣', text: 'Нажми кнопку «Поделиться» ↑' },
                  { icon: '3️⃣', text: '«На экран «Домой»»' },
                ].map((step) => (
                  <div key={step.icon} className="flex items-center gap-2">
                    <span className="text-sm">{step.icon}</span>
                    <p className="text-xs opacity-60">{step.text}</p>
                  </div>
                ))}
              </div>
              <a
                href="/cybershild.apk"
                download="КиберЩит.apk"
                onClick={() => setShowApkMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, #e91e8c, #c4177a)', color: '#fff' }}
              >
                <Icon name="Smartphone" size={15} />
                Скачать APK для Android
              </a>
              <div className="flex flex-col items-center gap-1 pt-1">
                <p className="text-xs opacity-40 self-start px-1">QR-код для перехода</p>
                <div className="rounded-xl overflow-hidden p-1.5" style={{ background: '#fff' }}>
                  <QRCodeSVG
                    value={window.location.origin + '/'}
                    size={140}
                    fgColor="#e91e8c"
                    bgColor="#ffffff"
                    level="M"
                  />
                </div>
                <p className="text-[10px] opacity-30 text-center">Наведи камеру телефона</p>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'КиберЩит', url: window.location.origin + '/' })
                    } else {
                      navigator.clipboard.writeText(window.location.origin + '/')
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 mt-1"
                  style={{ background: isDark ? 'rgba(233,30,140,0.15)' : 'rgba(233,30,140,0.1)', color: '#e91e8c' }}
                >
                  <Icon name={copied ? "Check" : "Share2"} size={15} />
                  {copied ? 'Скопировано!' : 'Поделиться'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* iOS Safari Install Banner */}
      {showIosBanner && !installed && (
        <div
          className="fixed bottom-20 left-1/2 z-50 w-full transition-all duration-500"
          style={{ maxWidth: 430, transform: 'translateX(-50%)' }}
        >
          <div
            className="mx-3 rounded-2xl p-4 shadow-2xl relative"
            style={{
              background: isDark ? '#1a2035' : '#ffffff',
              border: '1px solid rgba(233,30,140,0.3)',
              boxShadow: '0 8px 32px rgba(233,30,140,0.2)',
            }}
          >
            <button
              onClick={() => { setShowIosBanner(false); localStorage.setItem('pwa_banner_dismissed', '1') }}
              className="absolute top-3 right-3 opacity-40 hover:opacity-70 transition-opacity"
            >
              <Icon name="X" size={16} />
            </button>
            <p className="text-sm font-bold mb-3" style={{ color: '#e91e8c' }}>Установи как приложение 🍎</p>
            <div className="flex flex-col gap-2">
              {[
                { icon: '1️⃣', text: 'Нажми кнопку «Поделиться» внизу Safari ↓' },
                { icon: '2️⃣', text: 'Прокрути вниз и выбери «На экран «Домой»»' },
                { icon: '3️⃣', text: 'Нажми «Добавить» — готово!' },
              ].map((step) => (
                <div key={step.icon} className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">{step.icon}</span>
                  <p className="text-sm opacity-70">{step.text}</p>
                </div>
              ))}
            </div>
            <div
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rotate-45"
              style={{
                background: isDark ? '#1a2035' : '#ffffff',
                border: '1px solid rgba(233,30,140,0.3)',
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* PWA Install Banner */}
      {showBanner && !installed && (
        <div
          className="fixed top-0 left-1/2 z-50 w-full transition-all duration-300"
          style={{ maxWidth: 430, transform: 'translateX(-50%)' }}
        >
          <div
            className="mx-3 mt-3 rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
            style={{
              background: isDark ? '#1a2035' : '#ffffff',
              border: '1px solid rgba(233,30,140,0.3)',
              boxShadow: '0 8px 32px rgba(233,30,140,0.2)',
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #c4177a)' }}
            >
              <Icon name="Shield" size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Установить КиберЩит</p>
              <p className="text-xs opacity-50 mt-0.5">Добавьте на главный экран — работает без интернета</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                style={{ background: '#e91e8c' }}
              >
                Установить
              </button>
              <a
                href="/cybershild.apk"
                download="КиберЩит.apk"
                className="text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition-all"
                style={{ background: 'rgba(233,30,140,0.18)', border: '1px solid rgba(233,30,140,0.4)' }}
                title="Скачать APK"
              >
                <Icon name="Download" size={13} />
                APK
              </a>
              <button
                onClick={handleDismiss}
                className="w-8 h-8 rounded-xl flex items-center justify-center opacity-30 hover:opacity-60 transition-all"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                <Icon name="X" size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 80,
          paddingTop: showBanner ? 76 : 0,
          transition: 'padding-top 0.3s',
        }}
      >
        {activeTab === 'scanner' && <ScannerTab {...tabProps} />}
        {activeTab === 'security' && <SecurityTab {...tabProps} />}
        {activeTab === 'knowledge' && <KnowledgeTab {...tabProps} />}
        {activeTab === 'checklist' && <ChecklistTab {...tabProps} />}
        {activeTab === 'sos' && <SOSTab {...tabProps} />}
        {activeTab === 'settings' && (
          <SettingsTab
            {...tabProps}
            theme={theme}
            onToggleTheme={toggle}
            elderMode={elderMode}
            onToggleElderMode={toggleElderMode}
          />
        )}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} isDark={isDark} />
    </div>
  )
}