import { useState } from "react"
import Icon from "@/components/ui/icon"

const categories = [
  {
    id: "basics",
    icon: "Cpu",
    label: "Основы",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    articles: [
      {
        title: "Что такое фишинг?",
        preview: "Как мошенники маскируются под банки и сервисы",
        content: [
          { type: "text", text: "Фишинг — это когда злоумышленники создают поддельные сайты или письма, которые выглядят как настоящие. Цель — украсть ваш пароль, номер карты или личные данные." },
          { type: "title", text: "Как распознать фишинговое письмо?" },
          { type: "list", items: ["Адрес отправителя похож на настоящий, но с ошибкой (sber@sberbank.co)", "Вас срочно просят «подтвердить данные»", "Ссылка ведёт не туда, куда обещает", "Письмо с угрозой заблокировать счёт", "Логотип или дизайн выглядит немного не так"] },
          { type: "text", text: "Если сомневаетесь — не кликайте. Зайдите на сайт банка напрямую через браузер." },
        ],
      },
      {
        title: "Что такое вирус?",
        preview: "Виды вредоносных программ и как они попадают на устройство",
        content: [
          { type: "text", text: "Компьютерный вирус — программа, которая без вашего ведома выполняет вредные действия: крадёт данные, блокирует экран, рассылает спам." },
          { type: "title", text: "Основные виды:" },
          { type: "list", items: ["Троян — маскируется под полезную программу", "Шифровальщик — блокирует файлы и требует выкуп", "Шпион — незаметно следит за вами", "Рекламный вирус — заполняет экран рекламой"] },
          { type: "text", text: "Главная защита: не скачивайте файлы из непроверенных источников и установите антивирус." },
        ],
      },
    ],
  },
  {
    id: "social",
    icon: "Users",
    label: "Соцсети",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    articles: [
      {
        title: "Безопасность в соцсетях",
        preview: "Что нельзя публиковать и как защитить аккаунт",
        content: [
          { type: "title", text: "Не публикуйте:" },
          { type: "list", items: ["Фото документов и банковских карт", "Домашний адрес и геолокацию", "Информацию об отпуске (это сигнал для воров)", "Сведения о крупных покупках"] },
          { type: "title", text: "Защитите аккаунт:" },
          { type: "list", items: ["Включите двухфакторную аутентификацию", "Используйте уникальный пароль", "Проверьте, кто имеет доступ к вашему аккаунту", "Не доверяйте сообщениям «от друзей» с просьбой дать деньги"] },
        ],
      },
    ],
  },
  {
    id: "shopping",
    icon: "ShoppingCart",
    label: "Покупки",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    articles: [
      {
        title: "Безопасные онлайн-покупки",
        preview: "Как не потерять деньги при оплате в интернете",
        content: [
          { type: "title", text: "Перед оплатой проверьте:" },
          { type: "list", items: ["Наличие HTTPS в адресе сайта", "Отзывы о магазине в Google", "Реквизиты компании в разделе «О нас»", "Не слишком ли низкая цена (признак мошенничества)"] },
          { type: "title", text: "Советы:" },
          { type: "list", items: ["Заведите отдельную карту для онлайн-покупок с небольшим лимитом", "Никогда не вводите CVV на подозрительных сайтах", "Используйте виртуальные карты"] },
        ],
      },
    ],
  },
  {
    id: "devices",
    icon: "Smartphone",
    label: "Устройства",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    articles: [
      {
        title: "Защита смартфона и ПК",
        preview: "Базовые правила безопасности для ваших устройств",
        content: [
          { type: "title", text: "Смартфон:" },
          { type: "list", items: ["Устанавливайте приложения только из официальных магазинов", "Не подключайтесь к незнакомым Wi-Fi без VPN", "Регулярно обновляйте систему", "Включите шифрование данных"] },
          { type: "title", text: "Компьютер:" },
          { type: "list", items: ["Установите антивирус и обновляйте его", "Делайте резервные копии важных файлов", "Не оставляйте компьютер разблокированным", "Будьте осторожны с USB-флешками от незнакомых людей"] },
        ],
      },
    ],
  },
  {
    id: "fraud",
    icon: "PhoneCall",
    label: "Мошенничество",
    color: "text-red-400",
    bg: "bg-red-500/10",
    articles: [
      {
        title: "Звонки от «банка» и «полиции»",
        preview: "Как не попасться на телефонных мошенников",
        content: [
          { type: "text", text: "Телефонное мошенничество — один из самых распространённых видов обмана. Злоумышленники представляются сотрудниками банка, полиции или ФСБ, чтобы выманить деньги или данные." },
          { type: "title", text: "Типичные сценарии:" },
          { type: "list", items: ["«Ваша карта заблокирована, срочно назовите CVV»", "«С вашего счёта пытаются снять деньги, переведите на безопасный счёт»", "«Вы подозреваетесь в преступлении, нужен залог»", "«Ваш родственник попал в аварию, нужны деньги»"] },
          { type: "title", text: "Главные правила:" },
          { type: "list", items: ["Настоящий банк никогда не просит CVV и пин-код по телефону", "Немедленно кладите трубку и перезвоните в банк по номеру на карте", "Не переводите деньги на «безопасные счета» — их не существует", "Предупредите пожилых родственников — они чаще становятся жертвами"] },
        ],
      },
      {
        title: "Мошенничество в интернете",
        preview: "Фейковые магазины, лотереи и схемы обмана",
        content: [
          { type: "title", text: "Популярные схемы:" },
          { type: "list", items: ["Фейковые интернет-магазины с очень низкими ценами", "«Вы выиграли приз» — просят оплатить доставку", "Поддельные объявления на Авито и Циан", "Инвестиции с гарантированной доходностью 300%"] },
          { type: "title", text: "Как проверить продавца:" },
          { type: "list", items: ["Ищите отзывы о магазине в Google", "Проверьте дату регистрации домена (whois.domaintools.com)", "Не платите по реквизитам физлица за товар из магазина", "Используйте оплату с защитой покупателя"] },
        ],
      },
    ],
  },
  {
    id: "kids",
    icon: "Baby",
    label: "Дети",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    articles: [
      {
        title: "Дети в интернете",
        preview: "Как защитить ребёнка от угроз онлайн",
        content: [
          { type: "text", text: "Дети — самая уязвимая аудитория в интернете. Они не всегда понимают, что делиться личными данными опасно, и могут стать жертвой мошенников или буллинга." },
          { type: "title", text: "Главные угрозы:" },
          { type: "list", items: ["Незнакомцы, притворяющиеся сверстниками", "Кибербуллинг и травля в соцсетях", "Вредоносный контент и нежелательная реклама", "Внутриигровые покупки и мошенники в играх"] },
          { type: "title", text: "Что сделать родителям:" },
          { type: "list", items: ["Установите родительский контроль на устройствах", "Объясните, что нельзя сообщать адрес, школу и телефон", "Настройте приватность аккаунтов в соцсетях", "Разговаривайте с ребёнком о безопасности без запретов"] },
        ],
      },
    ],
  },
  {
    id: "vpn",
    icon: "Globe",
    label: "VPN",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    articles: [
      {
        title: "Что такое VPN и зачем он нужен",
        preview: "Как VPN защищает ваши данные и конфиденциальность",
        content: [
          { type: "text", text: "VPN (Virtual Private Network) — это зашифрованный туннель между вашим устройством и интернетом. Он скрывает ваш реальный IP-адрес и защищает данные от перехвата." },
          { type: "title", text: "Когда VPN необходим:" },
          { type: "list", items: ["При подключении к публичному Wi-Fi (кафе, аэропорт)", "Для защиты личных данных от слежки", "При работе с конфиденциальными документами", "При использовании незащищённых сетей"] },
          { type: "title", text: "Как выбрать VPN:" },
          { type: "list", items: ["Выбирайте платные сервисы — бесплатные часто продают ваши данные", "Проверьте политику «no-logs» (не хранят логи)", "Надёжные варианты: ProtonVPN, Mullvad, ExpressVPN", "Не используйте неизвестные VPN из App Store"] },
        ],
      },
    ],
  },
  {
    id: "backup",
    icon: "HardDrive",
    label: "Резервные копии",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    articles: [
      {
        title: "Как не потерять данные навсегда",
        preview: "Простые правила резервного копирования",
        content: [
          { type: "text", text: "Каждый год миллионы людей теряют важные файлы — фото, документы, рабочие данные. Причины: поломка устройства, вирус-шифровальщик, случайное удаление." },
          { type: "title", text: "Правило 3-2-1:" },
          { type: "list", items: ["3 копии данных", "2 на разных носителях (компьютер + флешка)", "1 в облаке (Google Диск, Яндекс Диск, iCloud)"] },
          { type: "title", text: "Что резервировать в первую очередь:" },
          { type: "list", items: ["Фотографии и видео (невосстановимы)", "Важные документы (паспорт, договоры)", "Пароли и коды доступа", "Рабочие файлы и проекты"] },
          { type: "title", text: "Инструменты:" },
          { type: "list", items: ["Google Фото — автоматический бэкап фото с телефона", "Яндекс Диск — 10 ГБ бесплатно", "Windows Backup — встроенный инструмент ПК", "Time Machine — для пользователей Mac"] },
        ],
      },
    ],
  },
]

type Article = (typeof categories)[0]["articles"][0]

export default function KnowledgeTab() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)

  const category = categories.find((c) => c.id === activeCategory)

  if (activeArticle) {
    return (
      <div className="px-5 py-6 space-y-4">
        <button onClick={() => setActiveArticle(null)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition">
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>
        <h1 className="text-xl font-bold">{activeArticle.title}</h1>
        <div className="space-y-4">
          {activeArticle.content.map((block, i) => {
            if (block.type === "title") return <p key={i} className="font-semibold text-white mt-2">{block.text}</p>
            if (block.type === "text") return <p key={i} className="text-white/70 text-sm leading-relaxed">{block.text}</p>
            if (block.type === "list") return (
              <ul key={i} className="space-y-2">
                {(block.items as string[]).map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                    <Icon name="CheckCircle" size={14} className="text-[#e91e8c] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )
            return null
          })}
        </div>
      </div>
    )
  }

  if (category) {
    return (
      <div className="px-5 py-6 space-y-4">
        <button onClick={() => setActiveCategory(null)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition">
          <Icon name="ArrowLeft" size={16} />
          Все категории
        </button>
        <h1 className="text-xl font-bold">{category.label}</h1>
        <div className="space-y-3">
          {category.articles.map((article, i) => (
            <button key={i} onClick={() => setActiveArticle(article)}
              className="w-full bg-white/5 border border-white/8 rounded-2xl p-4 text-left hover:bg-white/8 transition">
              <p className="font-semibold text-sm">{article.title}</p>
              <p className="text-white/50 text-xs mt-1">{article.preview}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">База знаний</h1>
        <p className="text-white/50 text-sm mt-1">Короткие статьи о кибербезопасности</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className="bg-white/5 border border-white/8 rounded-2xl p-4 text-left hover:bg-white/8 transition space-y-2">
            <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center`}>
              <Icon name={cat.icon} size={18} className={cat.color} fallback="BookOpen" />
            </div>
            <p className="font-semibold text-sm">{cat.label}</p>
            <p className="text-white/40 text-xs">{cat.articles.length} {cat.articles.length === 1 ? "статья" : "статьи"}</p>
          </button>
        ))}
      </div>
    </div>
  )
}