import { useState } from "react"
import Icon from "@/components/ui/icon"

const steps = [
  { num: 1, icon: "WifiOff", title: "Изолируйте устройство", text: "Немедленно отключите интернет и Wi-Fi. Это остановит распространение угрозы и утечку данных." },
  { num: 2, icon: "KeyRound", title: "Смените пароли", text: "С другого безопасного устройства смените пароли к почте, банкам, соцсетям. Начните с почты — она важнее всего." },
  { num: 3, icon: "CreditCard", title: "Заблокируйте банковские карты", text: "Позвоните на горячую линию банка или заблокируйте карты через приложение. Не ждите — действуйте сейчас." },
  { num: 4, icon: "FileText", title: "Зафиксируйте произошедшее", text: "Сделайте скриншоты подозрительных сообщений, писем, транзакций. Это понадобится для обращения в полицию." },
  { num: 5, icon: "Phone", title: "Обратитесь в поддержку", text: "Свяжитесь с техподдержкой взломанных сервисов и правоохранительными органами." },
]

const contacts = [
  { name: "Сбербанк", icon: "Building2", number: "900", desc: "Горячая линия" },
  { name: "Тинькофф", icon: "Building2", number: "8-800-555-75-75", desc: "Горячая линия" },
  { name: "Альфа-Банк", icon: "Building2", number: "8-800-200-00-00", desc: "Горячая линия" },
  { name: "ВТБ", icon: "Building2", number: "8-800-100-24-24", desc: "Горячая линия" },
  { name: "МВД / Киберполиция", icon: "ShieldAlert", number: "102", desc: "Сообщить о киберпреступлении" },
  { name: "Роскомнадзор", icon: "Flag", number: "8-800-222-88-00", desc: "Жалоба на мошеннический сайт" },
]

const onlineLinks = [
  { name: "Google — безопасность аккаунта", url: "https://myaccount.google.com/security", icon: "Globe" },
  { name: "ВКонтакте — настройки безопасности", url: "https://vk.com/settings?act=security", icon: "Globe" },
  { name: "Госуслуги — личный кабинет", url: "https://gosuslugi.ru/profile/personal", icon: "Globe" },
]

export default function SOSTab() {
  const [showSteps, setShowSteps] = useState(false)

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SOS</h1>
        <p className="text-white/50 text-sm mt-1">Экстренная помощь при кибератаке</p>
      </div>

      {/* SOS button */}
      <button
        onClick={() => setShowSteps(true)}
        className="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold py-5 rounded-2xl transition-all flex flex-col items-center gap-2 shadow-lg shadow-red-900/40"
      >
        <Icon name="AlertTriangle" size={32} />
        <span className="text-lg">Меня взломали / У меня вирус</span>
        <span className="text-xs text-red-200 font-normal">Нажмите, чтобы узнать что делать</span>
      </button>

      {/* Steps */}
      {showSteps && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <Icon name="Zap" size={15} />
            Действуйте прямо сейчас — шаг за шагом:
          </p>
          {steps.map((step) => (
            <div key={step.num} className="bg-white/5 border border-white/8 rounded-2xl p-4 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                  {step.num}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name={step.icon} size={14} className="text-white/50" fallback="AlertCircle" />
                  <p className="font-semibold text-sm">{step.title}</p>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Important contacts */}
      <div className="space-y-3">
        <p className="text-xs text-white/40 uppercase tracking-wider">Важные контакты</p>
        {contacts.map((c) => (
          <a
            key={c.name}
            href={`tel:${c.number}`}
            className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/8 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Icon name={c.icon} size={17} className="text-red-400" fallback="Phone" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-white/40">{c.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-[#e91e8c]">
              <Icon name="Phone" size={14} />
              <span className="text-sm font-mono">{c.number}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Online links */}
      <div className="space-y-3">
        <p className="text-xs text-white/40 uppercase tracking-wider">Управление аккаунтами</p>
        {onlineLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/8 transition"
          >
            <Icon name="Globe" size={16} className="text-[#e91e8c]" />
            <p className="text-sm flex-1">{link.name}</p>
            <Icon name="ExternalLink" size={14} className="text-white/30" />
          </a>
        ))}
      </div>
    </div>
  )
}