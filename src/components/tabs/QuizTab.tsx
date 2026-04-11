import { useState } from "react"
import Icon from "@/components/ui/icon"

const questions = [
  {
    id: 1,
    text: "Вы используете один и тот же пароль на нескольких сайтах?",
    risk: "high",
    yesIsRisk: true,
    tip: "Утечка одного сайта = взлом всех аккаунтов. Используйте менеджер паролей.",
  },
  {
    id: 2,
    text: "На вашей почте включена двухфакторная аутентификация (2FA)?",
    risk: "high",
    yesIsRisk: false,
    tip: "Почта без 2FA — главная уязвимость. Включите в настройках безопасности.",
  },
  {
    id: 3,
    text: "Вы иногда подключаетесь к публичному Wi-Fi без VPN?",
    risk: "medium",
    yesIsRisk: true,
    tip: "В публичных сетях трафик легко перехватить. Используйте VPN или мобильный интернет.",
  },
  {
    id: 4,
    text: "Ваш смартфон защищён PIN-кодом или биометрией?",
    risk: "high",
    yesIsRisk: false,
    tip: "Без блокировки экрана любой может получить доступ ко всем вашим данным.",
  },
  {
    id: 5,
    text: "Вы проверяете адрес сайта перед вводом пароля или данных карты?",
    risk: "high",
    yesIsRisk: false,
    tip: "Фишинговые сайты выглядят как настоящие. Всегда смотрите на адресную строку.",
  },
  {
    id: 6,
    text: "Бывало ли что вы открывали ссылки из SMS или email без проверки отправителя?",
    risk: "high",
    yesIsRisk: true,
    tip: "Это главный способ распространения фишинга. Всегда проверяйте отправителя.",
  },
  {
    id: 7,
    text: "У вас есть резервная копия важных данных (фото, документов)?",
    risk: "medium",
    yesIsRisk: false,
    tip: "Без резервной копии вирус-шифровальщик или сломанный телефон = потеря всего.",
  },
  {
    id: 8,
    text: "Вы обновляете операционную систему и приложения регулярно?",
    risk: "medium",
    yesIsRisk: false,
    tip: "Устаревшие версии содержат известные уязвимости, которые активно эксплуатируют.",
  },
  {
    id: 9,
    text: "Вы когда-нибудь называли CVV карты или код из SMS по телефону?",
    risk: "high",
    yesIsRisk: true,
    tip: "Ни один банк никогда не запрашивает эти данные по телефону. Это мошенники.",
  },
  {
    id: 10,
    text: "Вы проверяли, не утекли ли ваши данные в интернет?",
    risk: "medium",
    yesIsRisk: false,
    tip: "Проверьте на haveibeenpwned.com — это бесплатно и займёт 30 секунд.",
  },
]

type Answer = 'yes' | 'no'

function getResult(score: number, total: number) {
  const pct = (score / total) * 100
  if (pct >= 80) return {
    label: "Отличная защита",
    emoji: "🛡️",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    desc: "Вы серьёзно относитесь к безопасности. Продолжайте в том же духе и следите за новыми угрозами.",
  }
  if (pct >= 50) return {
    label: "Средний уровень",
    emoji: "⚠️",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    desc: "Базовая защита есть, но есть уязвимые места. Обратите внимание на советы ниже.",
  }
  return {
    label: "Высокий риск",
    emoji: "🚨",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    desc: "Ваши данные под угрозой. Начните с чек-листа — там есть всё необходимое.",
  }
}

export default function QuizTab({ isDark = true, elderMode = false }: { isDark?: boolean; elderMode?: boolean }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [done, setDone] = useState(false)

  const textMain = isDark ? '#f0f4ff' : '#0d1424'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const card = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const fs = elderMode ? 'text-base' : 'text-sm'
  const fsXs = elderMode ? 'text-sm' : 'text-xs'

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const answer = (a: Answer) => {
    const next = { ...answers, [q.id]: a }
    setAnswers(next)
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      setDone(true)
    }
  }

  const restart = () => {
    setAnswers({})
    setCurrent(0)
    setDone(false)
  }

  // Score: правильные ответы
  const score = questions.reduce((acc, q) => {
    const a = answers[q.id]
    if (!a) return acc
    const correct = q.yesIsRisk ? a === 'no' : a === 'yes'
    return acc + (correct ? 1 : 0)
  }, 0)

  const result = getResult(score, questions.length)

  // Неправильные ответы для советов
  const wrongTips = questions.filter(q => {
    const a = answers[q.id]
    if (!a) return false
    return q.yesIsRisk ? a === 'yes' : a === 'no'
  })

  const share = () => {
    const text = `Прошёл тест «Насколько я уязвим» в КиберЩит:\n${result.emoji} ${result.label} — ${score}/${questions.length} баллов\nПроверь себя: ${window.location.origin}`
    if (navigator.share) {
      navigator.share({ title: 'КиберЩит — тест безопасности', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (done) {
    return (
      <div className="px-5 py-6 space-y-5">
        <div>
          <h1 className={`font-bold ${elderMode ? 'text-3xl' : 'text-2xl'}`} style={{ color: textMain }}>Результат теста</h1>
          <p className={`${fsXs} mt-1`} style={{ color: textMuted }}>{score} из {questions.length} правильных ответов</p>
        </div>

        {/* Result card */}
        <div className="rounded-2xl p-5 text-center space-y-3" style={{ background: result.bg, border: `1px solid ${result.border}` }}>
          <div className={`${elderMode ? 'text-6xl' : 'text-5xl'}`}>{result.emoji}</div>
          <p className={`font-bold ${elderMode ? 'text-2xl' : 'text-xl'}`} style={{ color: result.color }}>{result.label}</p>
          <p className={`${fs} leading-relaxed`} style={{ color: textMuted }}>{result.desc}</p>

          {/* Score bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(score / questions.length) * 100}%`, background: result.color }} />
          </div>
        </div>

        {/* Tips for wrong answers */}
        {wrongTips.length > 0 && (
          <div className="space-y-3">
            <p className={`font-semibold ${fs}`} style={{ color: textMain }}>На что обратить внимание:</p>
            {wrongTips.map(q => (
              <div key={q.id} className="rounded-2xl p-4 flex gap-3" style={{ background: card, border: `1px solid ${border}` }}>
                <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                <p className={`${fsXs} leading-relaxed`} style={{ color: textMuted }}>{q.tip}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={share}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold ${fs} transition-all`}
            style={{ background: 'rgba(233,30,140,0.15)', color: '#e91e8c', border: '1px solid rgba(233,30,140,0.3)' }}>
            <Icon name="Share2" size={16} />
            Поделиться
          </button>
          <button onClick={restart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold ${fs} transition-all`}
            style={{ background: card, color: textMain, border: `1px solid ${border}` }}>
            <Icon name="RefreshCw" size={16} />
            Пройти снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className={`font-bold ${elderMode ? 'text-3xl' : 'text-2xl'}`} style={{ color: textMain }}>Тест</h1>
        <p className={`${fsXs} mt-1`} style={{ color: textMuted }}>Насколько вы уязвимы в интернете?</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className={`${fsXs} font-medium`} style={{ color: textMuted }}>Вопрос {current + 1} из {questions.length}</p>
          <p className={`${fsXs} font-bold`} style={{ color: '#e91e8c' }}>{Math.round(progress)}%</p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-400"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #e91e8c, #c4177a)' }} />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(233,30,140,0.15)' }}>
          <Icon name="HelpCircle" size={20} style={{ color: '#e91e8c' }} />
        </div>
        <p className={`font-semibold leading-snug ${elderMode ? 'text-xl' : 'text-base'}`} style={{ color: textMain }}>{q.text}</p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => answer('yes')}
          className={`py-4 rounded-2xl font-bold ${elderMode ? 'text-lg' : 'text-base'} transition-all active:scale-95`}
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
          Да
        </button>
        <button onClick={() => answer('no')}
          className={`py-4 rounded-2xl font-bold ${elderMode ? 'text-lg' : 'text-base'} transition-all active:scale-95`}
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
          Нет
        </button>
      </div>

      {/* Previous answers dots */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {questions.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i < current
                ? (answers[questions[i].id] ? (questions[i].yesIsRisk ? (answers[questions[i].id] === 'no' ? '#10b981' : '#ef4444') : (answers[questions[i].id] === 'yes' ? '#10b981' : '#ef4444')) : '#6b7280')
                : i === current ? '#e91e8c'
                : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            }} />
        ))}
      </div>
    </div>
  )
}
