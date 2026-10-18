import type { ReactNode, CSSProperties } from "react";
import { motion } from "motion/react";
import { Group, Item, H, Sub, Strong, Card, CardTitle, CardText, Bullets, Win, Chat, Phone, Prompt, Counter, Bars, Frame, Icon, Ask, rise, fromLeft, fromRight, fromDeep, pop } from "@/deck/primitives";
import { cn } from "@/lib/utils";
import { MessageCircle, HelpCircle, BookOpen, FileText, Smartphone, Monitor, Laptop, KeyRound, CreditCard, UserCog, AlertTriangle, ListChecks, Building2, Globe, PenLine, CheckCircle2, GitBranch, Timer, Search, ShieldCheck, BarChart3, Wallet, FolderOpen, Server, Wrench, Lock, Sparkles, Ban, ClipboardList, Send, type LucideIcon } from "lucide-react";
import logoOpenAI from "@/assets/logos/openai.svg?raw";
import logoClaude from "@/assets/logos/claude.svg?raw";
import logoGithub from "@/assets/logos/github.svg?raw";
import logoTelegram from "@/assets/logos/telegram.svg?raw";
import qrTelegram from "@/assets/qr-telegram.svg?raw";
import shotGithub from "@/assets/shots/github-repo.png";
import shotPages from "@/assets/shots/pages-deck.png";
import shotMemory from "@/assets/shots/chatgpt-memory.png";
import shotInstrForm from "@/assets/shots/chatgpt-instructions-form.png";
import shotProject from "@/assets/shots/chatgpt-project.png";
import shotClaudeInstr from "@/assets/shots/claude-instructions.png";
import shotClaudeMemory from "@/assets/shots/claude-memory.png";
import shotClaudeProjects from "@/assets/shots/claude-projects.png";
import shotModels from "@/assets/shots/chatgpt-models.png";
import shotReasoning from "@/assets/shots/chatgpt-reasoning.png";
import shotInstrFilled from "@/assets/shots/chatgpt-instructions-filled.png";
import shotBefore from "@/assets/shots/chatgpt-answer-before.png";
import shotAfter from "@/assets/shots/chatgpt-answer-after.png";
import shotExplorerProjects from "@/assets/shots/explorer-projects.png";
import shotExplorerDemo from "@/assets/shots/explorer-demo.png";
import shotContext from "@/assets/shots/chatgpt-context.png";

export type Slide = { title: string; mood: "hero" | "section" | "quiet"; notes: string; render: () => ReactNode };

/* Ссылка для QR на финале: заменить на канал курса, когда он будет */
const TELEGRAM_LINK = "t.me/zakrasava";

/* ---------- локальные примитивы ---------- */
const Pad = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={cn("absolute inset-0 px-[110px] pt-[72px] pb-[84px]", className.includes("grid") ? "" : "grid content-center", className)} style={style}>{children}</div>
);
/* Заголовок на всю ширину, ниже две колонки с воздухом */
const Two = ({ children, cols = "1fr 1.05fr", className = "" }: { children: ReactNode; cols?: string; className?: string }) => (
  <div className={cn("grid items-start gap-[60px] mt-[44px]", className)} style={{ gridTemplateColumns: cols }}>{children}</div>
);
/* Шаги блока: вместо точки с подписью — цепочка пилюль, текущая выделена */
const Pills = ({ items, on, marks }: { items: string[]; on: number; marks?: string[] }) => (
  <motion.div variants={rise} className="flex flex-wrap items-center gap-[8px] mb-[26px]">
    {items.map((t, k) => (
      <span key={t} className={cn("inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full text-[16px] border transition-colors", k === on ? "bg-ink text-white border-ink" : "bg-white text-mute border-line")}>
        <b className={cn("font-medium tabular-nums", k === on ? "text-sky" : "")}>{marks ? marks[k] : k + 1}</b>{t}
      </span>
    ))}
  </motion.div>
);
/* Пауза на обсуждение: открытое время, без таймера */
const Discuss = ({ q, hints, notes }: { q: string; hints: string[]; notes?: string }) => (
  <Pad className="grid items-center gap-[90px]" style={{ gridTemplateColumns: "1fr 620px" }}>
    <Group delay={.1}>
      <H size={104} tail="обсудим">Давайте</H>
      <Sub className="mt-[30px] text-[28px] max-w-[640px]">{q}</Sub>
      {notes && <Sub className="mt-[18px] text-[20px] text-mute max-w-[640px]">{notes}</Sub>}
    </Group>
    <Group delay={.5} className="grid gap-[14px]">
      {hints.map((h, k) => <Card key={k} v={fromRight} className="p-[20px_24px]"><CardText className="text-[22px] text-ink">{h}</CardText></Card>)}
    </Group>
  </Pad>
);
/* Монохромный логотип: встроенный SVG, цвет из currentColor */
const svgMono = (raw: string) => raw.replace(/<title>.*?<\/title>/, "").replace(/\sfill="[^"]*"/g, "").replace("<svg", '<svg fill="currentColor"');
const Logo = ({ src, size = 26, className }: { src: string; size?: number; className?: string }) => (
  <i className={cn("inline-grid place-items-center shrink-0 text-ink [&>svg]:w-full [&>svg]:h-full", className)} style={{ width: size, height: size }} aria-hidden dangerouslySetInnerHTML={{ __html: svgMono(src) }} />
);
const LogoRow = ({ items, className }: { items: [string, string][]; className?: string }) => (
  <div className={cn("flex flex-wrap items-center gap-[10px]", className)}>
    {items.map(([src, name]) => <span key={name} className="inline-flex items-center gap-[8px] px-[12px] py-[6px] rounded-[9px] bg-white border border-line text-[16px] text-ink"><Logo src={src} size={18} />{name}</span>)}
  </div>
);
/* Скриншот: подпись сверху как путь в меню, картинка целиком */
const Shot = ({ src, caption, v = fromRight, className, h = 230 }: { src: string; caption?: string; v?: typeof rise; className?: string; h?: number | string }) => (
  <motion.figure variants={v} className={cn("m-0", className)}>
    {caption && <figcaption className="mb-[8px] flex items-center gap-[10px] text-[17px] font-medium text-ink leading-[1.2]"><i className="w-[8px] h-[8px] rounded-[2px] bg-blue shrink-0" />{caption}</figcaption>}
    <span className="relative block rounded-[12px] border border-line window overflow-hidden bg-white" style={{ height: h }}><img src={src} alt="" className="block w-full h-full object-contain" /></span>
  </motion.figure>
);
const Term = ({ children }: { children: ReactNode }) => <span className="text-mute">({children})</span>;
/* Схема потока: узлы всплывают по очереди, стрелки дорисовываются */
const Flow = ({ nodes }: { nodes: { logo?: string; icon?: LucideIcon; title: string; text: string; hi?: boolean }[] }) => (
  <div className="grid items-stretch" style={{ gridTemplateColumns: nodes.map((_, i) => (i ? "40px 1fr" : "1fr")).join(" ") }}>
    {nodes.map((n, i) => (
      <div key={n.title} className="contents">
        {i > 0 && <div className="relative self-center h-[2px] mx-[4px]"><motion.div className="absolute inset-0 bg-blue origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .5 + i * .55, duration: .45, ease: "easeOut" }} /><motion.i className="absolute -right-[2px] -top-[5px] w-0 h-0" style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid #2f63f5" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 + i * .55 }} /></div>}
        <motion.div initial={{ opacity: 0, y: 30, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .3 + i * .55, type: "spring", stiffness: 220, damping: 18 }} className={cn("rounded-[14px] p-[22px_22px_24px]", n.hi ? "panel-hi" : "panel")}>
          <span className="inline-grid place-items-center w-[50px] h-[50px] rounded-[12px] bg-paper border border-line text-blue">{n.logo ? <Logo src={n.logo} size={26} /> : n.icon && <n.icon size={26} strokeWidth={1.75} />}</span>
          <b className="block mt-[16px] text-[23px] font-medium text-ink leading-[1.15]">{n.title}</b>
          <span className="block mt-[8px] text-[18px] text-body leading-[1.35]">{n.text}</span>
        </motion.div>
      </div>
    ))}
  </div>
);
const SETTINGS = ["Модель", "Инструкции", "Память", "Проекты", "Гигиена чатов"];
const WAYS = ["Телефон", "Инструкция плюс документ", "Поиск и доступ", "Разово или регулярно", "ИИ спрашивает первым"];
const LETTERS = ["А", "Б", "В", "Г", "Д"];

export const slides: Slide[] = [
  /* 1. Титул */
  { title: "Титул", mood: "hero", notes: "Пауза 20–30 секунд, пока подключаются. В окне справа печатается письмо поставщику по одной фразе: это результат сегодняшних настроек. Ничего не читать вслух.", render: () => (
    <Pad className="grid items-center gap-[70px]" style={{ gridTemplateColumns: "1fr 580px" }}>
      <Group delay={.2}>
        <H size={100} className="leading-[.98] tracking-[-.045em]" tail="вместо рутины">Свой ИИ‑агент</H>
        <Sub className="mt-[40px] max-w-[700px] text-[26px]">От первого вопроса до агента, который работает по вашим правилам. Ничего писать не придётся: всё уже написано, мы научимся это настраивать и включать.</Sub>
        <Item className="mt-[36px]"><LogoRow items={[[logoOpenAI, "ChatGPT"], [logoClaude, "Claude"], [logoOpenAI, "Codex"], [logoGithub, "GitHub"], [logoTelegram, "Telegram"]]} /></Item>
      </Group>
      <Frame title="Новый чат" meta="Думающая модель, личные инструкции и проект «Закупки» подключены">
        <Chat start={1.4} gap={1.1} msgs={[{ me: true, text: "Напиши поставщику: задержали поставку" }, { text: "Андрей, добрый день. По договору № 14 поставка должна была прийти 14 октября, сегодня 19‑е. Прошу до 12:00 завтра подтвердить дату отгрузки. По п. 6.2 с 20 октября начисляется неустойка 0,1% в день, пока удерживать не будем. Ильдар, управляющий." }]} />
      </Frame>
    </Pad>
  ) },

  /* 2. Опросник */
  { title: "Что вы уже используете: опросник", mood: "quiet", notes: "31 ответ, без имён. Цифры с реального файла опросника от 17 октября.", render: () => (
    <Pad>
      <Group>
        <H tail="Мешают в основном время и формулировки">Вы уже пользуетесь ИИ</H>
        <div className="grid mt-[44px] gap-[24px] items-stretch" style={{ gridTemplateColumns: "1fr 1fr 1.2fr" }}>
          <Card v={fromLeft} className="p-[24px_26px]">
            <CardTitle icon={UserCog}>Кто вы</CardTitle>
            <div className="grid grid-cols-2 gap-[12px] mt-[8px]">
              <div><div className="text-[64px] leading-[.95]"><Counter to={20} /></div><CardText className="text-[17px] mt-[8px]">из 31 пользуются каждый день или несколько раз в неделю</CardText></div>
              <div><div className="text-[64px] leading-[.95]"><Counter to={14} delay={.7} /></div><CardText className="text-[17px] mt-[8px]">будут смотреть занятие только с телефона</CardText></div>
            </div>
            <CardText className="mt-[18px] text-[18px]">Платный аккаунт у двенадцати (девять личных, три корпоративных), бесплатный у десяти, у пятерых аккаунта нет. Мессенджеры почти у всех, Excel, Word и почта у двух третей; iiko или r_keeper у десяти, 1С у пяти.</CardText>
          </Card>
          <Card className="p-[24px_26px]">
            <CardTitle icon={AlertTriangle}>Что мешает</CardTitle>
            <Bars height={120} className="my-[28px] mb-[46px] mx-[6px]" data={[{ v: 100, val: "11", label: "время" }, { v: 45, val: "5", label: "слова" }, { v: 27, val: "3", label: "доступ", dim: true }, { v: 18, val: "2", label: "доверие", dim: true }, { v: 18, val: "2", label: "данные", dim: true }]} />
            <CardText className="text-[18px]">Десять ответили «ничего не мешает». Про память впервые слышат восемь, про свои GPT и навыки — двенадцать. Агентов пробовали трое, слышали двадцать. На вопрос «что такое агент»: «помощник», «не знаю», «хочу разобраться».</CardText>
          </Card>
          <Card v={fromRight} hi className="p-[22px_24px] [&_li]:text-[17px] [&_li]:mt-[5px] [&_li]:leading-[1.32]">
            <CardTitle icon={ListChecks}>Что хотите поручить</CardTitle>
            <Bullets items={["Сводки выручки, отчёты руководству, сведение данных из нескольких юрлиц", "Презентации: участки для инвесторов, меню, объекты по шаблону", "Ответы на отзывы и сообщения гостей по скриптам", "Письма поставщикам, разбор коммерческих предложений и цен", "ТТК, себестоимость, подбор рецептур под фуд-кост", "Договоры, бизнес-план и финмодель участка, поиск персонала"]} />
            <CardText className="mt-[12px] text-[17px]">Сегодня покажем отзывы, КП и выручку. Презентация участка соберётся через час на ваших глазах.</CardText>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 3. Режимы работы */
  { title: "Режимы работы: четыре окна", mood: "quiet", notes: "Телефон: быстрые задачи. Веб-версия: документы и настройки, чаты общие с телефоном. Desktop и Codex: большие задачи, агенты. Расширение браузера: ИИ действует на сайтах. Показать свой телефон.", render: () => (
    <Pad>
      <Group>
        <H tail="Аккаунт один, чаты общие">Четыре окна под разные задачи</H>
        <div className="grid grid-cols-3 gap-[22px] mt-[40px] [&_li]:text-[17px] [&_li]:mt-[6px] [&_h3]:text-[23px] [&_h3]:mb-[10px]">
          <Card v={fromLeft}><CardTitle icon={Smartphone}>Приложение на телефоне</CardTitle><Bullets items={["Быстрые задачи: ответить на отзыв, перевести, разобрать фото документа", "Голосом по дороге", "Все чаты из браузера уже здесь"]} /><CardText className="mt-[14px] text-[17px]">Вводное и проекты работают и тут, поэтому ответы сразу «ваши».</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "ChatGPT"], [logoClaude, "Claude"]]} /></Item></Card>
          <Card hi><CardTitle icon={Monitor}>Веб-версия в браузере</CardTitle><Bullets items={["Документы, таблицы, длинная переписка", "Все настройки, проекты и файлы", "Редактор текста рядом с чатом"]} /><CardText className="mt-[14px] text-[17px]">Основное окно сегодняшней встречи. Новые функции появляются здесь первыми.</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "chatgpt.com"], [logoClaude, "claude.ai"]]} /></Item></Card>
          <Card v={fromRight}><CardTitle icon={Laptop}>Desktop-приложение</CardTitle><Bullets items={["Видит ваши папки и окна, когда вы разрешите", "Здесь живут агенты: Codex, Claude Code", "Большие задачи: разработка, скрипты, автоматизация"]} /><CardText className="mt-[14px] text-[17px]">Отсюда один шаг до собственного агента.</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "Codex"], [logoClaude, "Claude Code"]]} /></Item></Card>
        </div>
        <Card v={fromRight} className="mt-[22px] p-[18px_24px] [&_h3]:text-[23px] [&_h3]:mb-[8px]"><CardTitle icon={Globe}>Расширение для браузера</CardTitle><CardText className="text-[18px]">Claude in Chrome и ChatGPT для Chrome ставятся как обычное расширение <Term>browser extension</Term> и включаются одной кнопкой. ИИ видит открытые вкладки и действует на сайтах за вас: заполняет формы, собирает данные, сравнивает. Так я снимал скриншоты для этой презентации.</CardText><Item className="mt-[12px]"><LogoRow items={[[logoClaude, "Claude in Chrome"], [logoOpenAI, "ChatGPT для Chrome"]]} /></Item></Card>
      </Group>
    </Pad>
  ) },

  /* 4. Подписка и ключ API */
  { title: "Подписка и ключ API", mood: "quiet", notes: "Цены и названия тарифов не называть. Что такое API вообще: у 1С и Контур.Диадока тоже есть API. Если есть доступ, показать страницу ключей, ключ не раскрывать.", render: () => (
    <Pad>
      <Group>
        <H tail="Ключ (API) — для программ">Подписка — доступ для человека</H>
        <div className="grid grid-cols-2 gap-[28px] mt-[44px]">
          <Card v={fromLeft} hi><CardTitle icon={CreditCard}>Подписка</CardTitle><CardText className="text-[20px]">Фиксированная сумма в месяц. Вы сами работаете в чате, приложении и проектах: один аккаунт, один человек. Некоторые агенты <Term>Codex, Claude Code</Term> тоже умеют работать по вашей подписке.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={KeyRound}>Ключ API</CardTitle><CardText className="text-[20px]">API <Term>программный интерфейс</Term> есть у большинства сервисов вокруг вас: 1С, Контур.Диадок, банк. Это вход для программ, а не для людей. Ключ API к ИИ — длинная строка, которую вставляют в скрипт или агента, чтобы программа сама отправляла запросы модели. Оплата за объём текста <Term>токены</Term>.</CardText></Card>
        </div>
        <Two cols="1fr 1fr" className="mt-[28px] items-center gap-[40px]">
          <Sub className="text-[21px]">Где взять: в кабинете разработчика <Term>platform.openai.com → API keys; platform.claude.com → API Keys</Term>. Ключ показывается один раз, пересылать его нельзя: кто знает ключ, тот тратит ваши деньги. Для чата и проектов ключ не нужен, хватает подписки.</Sub>
          <Frame title="API keys" v={fromRight} meta="Учебный аккаунт. Настоящий ключ в эфире не показываем.">
            <div className="grid gap-[8px] text-[16px]">
              {[["Агент отчётов", "sk-…k3Qf", "создан 12 окт"], ["Скрипт КП", "sk-…9hLm", "создан 15 окт"]].map(([n, k, d]) => <div key={n} className="flex items-center justify-between gap-[12px] px-[14px] py-[10px] rounded-[9px] bg-paper border border-line"><span className="text-ink">{n}</span><code className="text-mute">{k}</code><small className="text-mute">{d}</small></div>)}
              <div className="mt-[4px] inline-flex w-max items-center gap-[8px] px-[14px] py-[8px] rounded-[9px] bg-ink text-white">+ Create new secret key</div>
            </div>
          </Frame>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 5. Как это выглядит у меня */
  { title: "Как это выглядит у меня", mood: "quiet", notes: "Один обезличенный скриншот рабочего экрана, 20 секунд. Не говорить, что курс или презентация собраны агентами.", render: () => (
    <Pad>
      <Group>
        <H tail="и правила вместо повторений">В работе у меня два агента</H>
        <div className="mt-[52px]">
          <Flow nodes={[{ icon: UserCog, title: "Я ставлю задачу", text: "одной фразой: в терминале, в чате или из Telegram" }, { logo: logoClaude, title: "Claude Code делает", text: "тексты, таблицы, код, презентации" }, { logo: logoOpenAI, title: "Codex проверяет", text: "спорит и возвращает с замечаниями" }, { logo: logoGithub, title: "GitHub хранит", text: "правила, историю изменений, результат" }, { logo: logoTelegram, title: "Telegram присылает", text: "файл и отчёт: что сделано, что не смог", hi: true }]} />
        </div>
        <div className="grid grid-cols-3 gap-[28px] mt-[44px]">
          <Sub className="text-[20px]"><Strong>Правила вместо повторений.</Strong> В каждой папке файл правил <Term>AGENTS.md или CLAUDE.md</Term>: как у меня принято и что проверить. Агент читает его первым, поэтому я не объясняю одно и то же каждое утро.</Sub>
          <Sub className="text-[20px]"><Strong>Я принимаю результат.</Strong> Не пишу код и не слежу за процессом: ставлю задачу и смотрю, что получилось. Если не так, правлю правила, а не переделываю руками.</Sub>
          <Sub className="text-[20px]"><Strong>Это умеет не программист.</Strong> Всё, что на схеме, уже написано другими. Моя работа — правильно настроить и включить. Этому и учимся.</Sub>
        </div>
      </Group>
    </Pad>
  ) },

  /* 6. Обсуждение 1 */
  { title: "Обсуждение: что болит", mood: "quiet", notes: "Первая пауза, когда картина уже есть. Разогнать разговор: пусть два‑три человека назовут задачу. Записывать в чат встречи: вернёмся к ним в части про способы.", render: () => (
    <Discuss q="Что из списка в опроснике у вас болит сильнее всего? Назовите одну задачу, которую вы делаете руками каждую неделю." notes="Я записываю. К концу встречи у каждой задачи будет способ, а у вас — домашнее задание из одной строки." hints={["Отчёт, который собирается из нескольких таблиц", "Письмо, которое вы пишете по одному и тому же шаблону", "Документ, который приходится читать целиком ради трёх цифр", "Вопрос, на который вы отвечаете коллегам по десять раз"]} />
  ) },

  /* 7. Правило ноль */
  { title: "Правило ноль: не бойтесь разговаривать", mood: "quiet", notes: "Переход к настройкам: сначала правило ноль. Показать свой чат «Объясни мне» или завести его в эфире за 30 секунд.", render: () => (
    <Pad>
      <Group>
        <H tail="Понимание приходит в процессе">Не бойтесь с ним разговаривать</H>
        <Two cols="1fr 1.3fr" className="mt-[40px] gap-[48px]">
          <div className="grid gap-[12px] [&_h3]:text-[22px] [&_h3]:mb-[6px] [&_p]:text-[17px]">
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={MessageCircle}>Говорите как с человеком</CardTitle><CardText>Не ищите «правильный промпт» <Term>запрос</Term>. Опишите ситуацию словами, как коллеге: что случилось, что нужно, к какому сроку. Переспросите, если непонятно. Это нормально.</CardText></Card>
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={HelpCircle}>Глупых вопросов нет</CardTitle><CardText>«Что такое токен?», «Почему ты так ответил?», «Объясни проще». ИИ не устанет и не осудит. Каждый третий из вас написал в опроснике «нет времени разбираться». Разбираться не нужно, нужно спрашивать.</CardText></Card>
            <Card v={fromLeft} hi className="p-[18px_22px]"><CardTitle icon={BookOpen}>Заведите чат «Объясни мне»</CardTitle><CardText>Отдельный чат для всего непонятного: термин из письма, кнопка в программе, фраза из этой презентации. Через месяц это ваш личный учебник.</CardText></Card>
          </div>
          <div className="grid gap-[14px]">
            <Shot src={shotContext} h={360} caption="ChatGPT: «что значит контекст, объясни просто»" />
            <Sub className="text-[19px]">Один вопрос, одно простое объяснение. Так работает чат «Объясни мне»: спросить проще, чем разбираться самому.</Sub>
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 8. До / после */
  { title: "Вводное: один запрос, два ответа", mood: "quiet", notes: "Оба ответа настоящие, сняты 18 октября во временных чатах ChatGPT. Без вводного — шаблон для всех; с вводным — коротко, в нашей структуре, НДС отдельно.", render: () => (
    <Pad>
      <Group>
        <H tail="Разница только в том, что ИИ знает о вас">Один запрос, два ответа</H>
        <Sub className="mt-[22px] text-[22px] max-w-[1200px]">Без вводного ИИ отвечает «вообще», как любому человеку в мире. Вводное — одна страница о том, кто вы и как у вас принято. Пишется один раз, читается перед каждым ответом. С неё начинается любой агент.</Sub>
        <div className="grid grid-cols-2 gap-[32px] mt-[30px]">
          <div>
            <Shot src={shotBefore} h={440} v={fromLeft} caption="Без вводного" />
            <Sub className="mt-[12px] text-[18px]">Шаблон для всех: «[Название компании]», «Уважаемые партнёры!», ассортимент из воздуха. Так отвечает любой ИИ любому человеку без настроек.</Sub>
          </div>
          <div>
            <Shot src={shotAfter} h={440} caption="С вводным: тот же запрос плюс шесть строк о себе" />
            <Sub className="mt-[12px] text-[18px]">От поставщика для сети ресторанов в Казани, таблица «позиция, цена, срок», НДС отдельно, три варианта сотрудничества. Коротко, потому что так просили.</Sub>
          </div>
        </div>
      </Group>
    </Pad>
  ) },

  /* 9. Шесть строк вводного */
  { title: "Шесть строк вводного", mood: "quiet", notes: "Главное: компактность. Каждое слово вводного ИИ читает при каждом ответе. Лишнее путает и тратит токены. Справа настоящее поле ChatGPT с примером.", render: () => (
    <Pad>
      <Group>
        <H tail="и помещаются в одно поле настроек">Шесть строк, которые читаются перед каждым ответом</H>
        <Two cols="1fr 1fr" className="mt-[40px] gap-[60px]">
          <div>
            <ol className="m-0 p-0 list-none">
              {[[UserCog, "Кто вы", "управляющий сетью из трёх ресторанов в Казани, в команде 60 человек"], [Building2, "Компания", "холдинг: рестораны, земля под застройку, недвижимость в Дубае"], [Globe, "Страна и правила", "законы РФ и ОАЭ, рубли и дирхамы, НДС отдельно"], [PenLine, "Стиль", "коротко, на «вы», без восклицаний; таблица, если данных больше трёх строк"], [Ban, "Что нельзя", "не выдумывай цифры и имена; не хватает данных — спроси"], [CheckCircle2, "Хороший результат", "письмо на половину экрана, три варианта на выбор"]].map(([I, t, d], k) => (
                <motion.li key={k} variants={fromLeft} className="grid items-center gap-[14px] py-[9px] border-t border-line" style={{ gridTemplateColumns: "36px 180px 1fr" }}>
                  <Icon icon={I as LucideIcon} size={32} /><b className="text-[20px] font-medium text-ink">{t as string}</b><span className="text-[17px] text-body leading-[1.3]">{d as string}</span>
                </motion.li>
              ))}
              <motion.li variants={fromLeft} className="border-t border-line" />
            </ol>
            <Sub className="mt-[16px] text-[18px]">Короче — лучше. Каждое слово вводного ИИ перечитывает перед каждым ответом: чем длиннее текст, тем легче ему запутаться и тем больше объёма <Term>токенов</Term> уходит впустую. 400–600 знаков помещаются в поле и работают.</Sub>
          </div>
          <Shot src={shotInstrFilled} h={400} caption="ChatGPT → Настройки → Персонализация → Пользовательские инструкции" />
        </Two>
        <Ask className="mt-[12px] text-[19px]">Что из шести строк вы объяснили бы новому коллеге в первый день? Это и есть ваше вводное</Ask>
      </Group>
    </Pad>
  ) },

  /* 10. Модель */
  { title: "Настройка 1: модель и уровень рассуждения", mood: "quiet", notes: "Живой экран: новый чат, под полем ввода меню модели и «Уровень усилий рассуждения». В Claude переключатель там же.", render: () => (
    <Pad>
      <Group>
        <Pills items={SETTINGS} on={0} />
        <H tail="а не то, что стоит по умолчанию">Выбирайте модель и уровень рассуждения</H>
        <Two cols="1fr 1.1fr" className="mt-[40px]">
          <div className="grid gap-[16px]">
            <Sub className="text-[21px]">Два переключателя под полем ввода: какая модель отвечает и сколько она думает <Term>уровень усилий рассуждения, reasoning</Term>. По умолчанию сервис экономит: сложный запрос может уйти слабой модели или быстрому режиму, и вы об этом не узнаете.</Sub>
            <Sub className="text-[21px]">Высокий уровень рассуждения на несколько секунд медленнее. Зато модель считает, сверяет и реже выдумывает. Для писем хватит среднего, для цифр и документов ставьте высокий.</Sub>
            <Sub className="text-[21px]">Названия моделей меняются каждые пару месяцев. Запомните принцип, а не имя. В Claude переключатель там же, под полем ввода.</Sub>
            <Sub className="text-[19px] text-mute">Если в вашем аккаунте этих переключателей нет, это функция платного тарифа. Вводное и новый чат работают везде.</Sub>
            <Item className="mt-[4px]"><LogoRow items={[[logoOpenAI, "ChatGPT"], [logoClaude, "Claude"]]} /></Item>
          </div>
          <div className="grid gap-[16px]">
            <Shot src={shotModels} h={190} caption="ChatGPT: меню моделей под полем ввода" />
            <Shot src={shotReasoning} h={190} caption="Там же: уровень усилий рассуждения" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 11. Личные инструкции */
  { title: "Настройка 2: личные инструкции", mood: "quiet", notes: "Живой экран: вставить промпт, ответить на три вопроса вслух, остальное заранее. Контрольный запрос про КП, сравнить со слайдом «до/после».", render: () => (
    <Pad>
      <Group>
        <Pills items={SETTINGS} on={1} />
        <H tail="Вы отвечаете на вопросы">Вводное пишет сам ИИ</H>
        <Two cols="1fr 1.1fr" className="mt-[40px]">
          <div className="grid gap-[16px]">
            <Sub className="text-[21px]">Вставляете промпт в обычный чат. Он задаёт десять вопросов, по одному. Итог на 400–600 знаков от первого лица вставляете в поле инструкций. С этой минуты каждый новый чат знает, с кем говорит.</Sub>
            <Prompt v={fromLeft} className="text-[17px] px-[20px] py-[14px]" text="Помоги составить мои личные инструкции для ИИ. Задай мне по одному вопросу: роль, компания, страна и правила, для кого я пишу, стиль ответов, что мне не нужно, как критиковать мои тексты, «ты» или «вы», любимый формат ответа, типовые задачи. Дождись ответа на каждый. Потом собери текст от первого лица на 400–600 знаков, без воды." note="Промпт есть в конспекте после встречи. Переписывать с экрана не нужно." />
          </div>
          <div className="grid gap-[14px]">
            <Shot src={shotInstrForm} h={300} caption="ChatGPT → Настройки → Персонализация → Пользовательские инструкции" />
            <Shot src={shotClaudeInstr} h={140} caption="Claude → Settings → Account → Instructions for Claude" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 12. Память */
  { title: "Настройка 3: память", mood: "quiet", notes: "Живой экран: Настройки → Персонализация → Память: «Включить память», «Сводка памяти → Управление», «Учитывать мой стиль письма», временный чат. В Claude: Settings → Memory.", render: () => (
    <Pad>
      <Group>
        <Pills items={SETTINGS} on={2} />
        <H tail="вторую нет">У ИИ две памяти. Одну вы видите,</H>
        <Two cols="1fr 1fr" className="mt-[40px]">
          <div className="grid gap-[14px]">
            <Sub className="text-[20px]"><Strong>Сводка памяти</Strong> <Term>ChatGPT: Персонализация → Память → Управление; Claude: Settings → Memory</Term>. То, что ИИ записал о вас. Можно открыть, прочитать и удалить любую строку.</Sub>
            <Sub className="text-[20px]"><Strong>Включить память</Strong> и <Strong>Учитывать мой стиль письма</Strong> <Term>переключатели там же</Term>. Профиль строится из всех чатов, файлов и подключённых приложений. Посмотреть целиком нельзя, только выключить. Если чаты были про всё подряд, он мешает.</Sub>
            <Sub className="text-[20px]"><Strong>Временный чат</Strong>. Не попадает ни в историю, ни в память: для разового, что не должно остаться в профиле. Но это по‑прежнему облако: персональные данные туда тоже нельзя.</Sub>
            <Item className="mt-[6px] rounded-[12px] px-[18px] py-[14px] border border-warn/40 bg-white text-[17px] leading-[1.4] text-body"><b className="font-semibold text-warn">Сноска.</b> Не считайте переписку с ИИ конфиденциальной. Паспортные данные, договоры с реквизитами и зарплаты в облачный чат не вставляем: обезличиваем («Арендатор А», «объект на улице Б»). Для таких документов есть локальные модели, которые работают на вашем компьютере и ничего не отправляют наружу.</Item>
          </div>
          <div className="grid gap-[14px]">
            <Shot src={shotMemory} h={300} caption="ChatGPT → Настройки → Персонализация → Память" />
            <Shot src={shotClaudeMemory} h={200} caption="Claude → Settings → Memory" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 13. Проекты */
  { title: "Настройка 4: проекты", mood: "quiet", notes: "Живой экран: проводник с папкой «Проекты», внутри подпапки с файлом правил. Открыть один AGENTS.md. В веб-версии показать проект с «Источниками».", render: () => (
    <Pad>
      <Group>
        <Pills items={SETTINGS} on={3} />
        <H tail="ИИ помнит задачу, а не разговор">Проект — это рабочее место</H>
        <Two cols="1fr 1.2fr" className="mt-[36px]">
          <div className="grid gap-[12px] [&_p]:text-[20px]">
            <Sub>В веб-версии <Term>ChatGPT и Claude: «Проекты»</Term> это папка с файлами и инструкцией: любой чат внутри неё видит их без напоминаний. Хватит для писем, отзывов и КП.</Sub>
            <Sub>На компьютере <Term>desktop-приложение, Codex, Claude Code</Term> проект это обычная папка. Заводите одну папку «Проекты», в ней подпапку на каждую тему и в каждой файл правил <Term>AGENTS.md или CLAUDE.md</Term>: что это за задача, как у вас принято, что проверить.</Sub>
            <Sub>Для большой задачи файл правил задаёт этапы: сначала ТЗ, потом дизайн, потом безопасность, потом сборка. На каждом этапе можно звать разную модель: сильную с поиском для ТЗ, модель для кода для сборки.</Sub>
            <Ask className="mt-[6px] text-[18px]">Какая задача у вас повторяется каждую неделю? Это ваша первая подпапка</Ask>
          </div>
          <div className="grid gap-[14px]">
            <div className="grid grid-cols-2 gap-[14px]">
              <Shot src={shotProject} h={230} caption="ChatGPT → Проекты → Отзывы гостей" />
              <Shot src={shotClaudeProjects} h={230} caption="Claude → Projects" />
            </div>
            <Shot src={shotExplorerProjects} h={270} caption="Проводник → Проекты: подпапки по темам, в каждой AGENTS.md" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 14. Две папки */
  { title: "Демо: одна задача, две папки", mood: "quiet", notes: "Живой экран: две папки в проводнике, «А» пустая, в «Б» один файл правил. Открыть Codex в каждой, один запрос, запустить. Вернуться к результату через 25 минут.", render: () => (
    <Pad>
      <Group>
        <H tail="Пустая и с одним файлом правил">Одна задача, две папки</H>
        <div className="grid gap-[24px] mt-[32px] items-start" style={{ gridTemplateColumns: "1fr 560px" }}>
          <div className="grid gap-[14px]">
            <Prompt v={rise} className="text-[19px] px-[22px] py-[16px]" text="Подготовь HTML-презентацию земельного участка 2,4 га под коттеджный посёлок для инвестора: расположение, коммуникации, экономика, этапы. Данные вымышленные, 8 слайдов." delay={.5} speed={12} />
            <Sub className="text-[19px]">Запускаем сейчас, результат через 25 минут. Файл правил пишется один раз на тип задачи. Любая папка с ним работает по вашим правилам.</Sub>
          </div>
          <Shot src={shotExplorerDemo} h={236} caption="Проводник: demo-A и demo-B" />
        </div>
        <div className="grid grid-cols-2 gap-[28px] mt-[22px] [&_[data-id]]:py-[11px] [&_[data-id]]:text-[19px]">
          <Win v={fromLeft} title="Папка «А»: пустая" rows={[{ id: "a1", label: "Агент читает задачу", meta: "правил нет, берёт свои шаблоны" }, { id: "a2", label: "Через 25 минут: index.html", meta: "8 слайдов, стандартный вид" }]} steps={[{ sel: "a1", t: 3200, on: true }, { sel: "a2", t: 1200, on: true }]} />
          <Win v={fromRight} title="Папка «Б»: внутри мой файл правил" rows={[{ id: "b0", label: "AGENTS.md, одна страница", meta: "мой стиль, структура, что проверить" }, { id: "b1", label: "Агент читает правила, потом задачу", meta: "работает по моим правилам" }, { id: "b2", label: "Через 25 минут: index.html", meta: "мой стиль, моя логика, цифры сверены" }]} steps={[{ sel: "b0", t: 2600, on: true }, { sel: "b1", t: 900, on: true }, { sel: "b2", t: 1200, on: true }]} />
        </div>
        <Ask className="mt-[18px] text-[19px]">Пока агенты работают: для какой задачи вы написали бы такой файл первым?</Ask>
      </Group>
    </Pad>
  ) },

  /* 15. Гигиена чатов */
  { title: "Настройка 5: гигиена чатов", mood: "quiet", notes: "Новый чат на новую задачу; в проекте итог одного чата передаётся новому коротким резюме. Про токены не углубляться.", render: () => (
    <Pad>
      <Group>
        <Pills items={SETTINGS} on={4} />
        <H tail="Это не обсуждается">Новая тема — новый чат</H>
        <div className="grid grid-cols-3 gap-[26px] mt-[48px]">
          <Card v={fromLeft}><CardTitle icon={HelpCircle}>Почему</CardTitle><CardText>При каждом вопросе ИИ перечитывает весь чат <Term>контекст</Term>. Сорок сообщений про аренду, а потом вопрос про меню: он ищет связь, которой нет, и начинает выдумывать. Переполненный контекст — одна из главных причин ложных ответов.</CardText></Card>
          <Card hi><CardTitle icon={Timer}>Задача решена — чат закрыт</CardTitle><CardText>Даже маленькая: прочитать документ, переделать письмо. Сделали, отправили, закрыли. Понадобится снова — найдёте поиском за три секунды. Новая задача всегда с чистого листа.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={GitBranch}>В проекте: итог в новый чат</CardTitle><CardText>Концепт, референсы и споры живут в одном чате. Когда решение принято, попросите короткое резюме и начните новый чат с него. Мусор от отвергнутых идей не поедет дальше.</CardText></Card>
        </div>
        <Sub className="mt-[40px] text-[21px] max-w-[1100px]">После пяти настроек ИИ знает ваш принцип работы: какой моделью отвечать, кто вы, что о вас помнить, где лежит задача и когда начинать с чистого листа.</Sub>
      </Group>
    </Pad>
  ) },

  /* 16. Обсуждение 2 */
  { title: "Обсуждение: что удивило", mood: "quiet", notes: "Вторая пауза после настроек. Спросить, что удивило и что включат вечером. Не предлагать настраивать во время эфира: с телефона это уводит из трансляции. На телефоне тот же путь: значок профиля → Персонализация.", render: () => (
    <Discuss q="Какая из пяти настроек удивила? Что вы включите на своём аккаунте сегодня вечером первым делом?" notes="Включать лучше вечером по конспекту, сейчас просто назовите." hints={["Высокий уровень рассуждения вместо того, что по умолчанию", "Вводное: кто вы и как у вас принято", "Память: посмотреть, что он уже о вас записал", "Новый чат на новую задачу"]} />
  ) },

  /* 17. Пять способов */
  { title: "Пять способов решать задачи", mood: "section", notes: "Карта пяти способов на задачах холдинга. Домашнее задание: записать свою задачу одной строкой; к следующему занятию подготовим помощника, который превратит её в ТЗ.", render: () => (
    <Pad>
      <Group>
        <H tail="на задачах из опросника">Пять способов решать задачи</H>
        <div className="grid grid-cols-5 gap-[16px] mt-[44px]">
          {[[Smartphone, "Телефон", "Отзыв гостя, письмо арендатору", "Фото или голос вместо текста, две минуты по дороге"], [FileText, "Инструкция плюс документ", "Коммерческое предложение", "Один раз инструкция, дальше слово «разбери» или «подготовь»"], [Search, "Поиск и доступ", "Норма, рынок, контрагент", "Источники с датами; закрытые сайты только через вас"], [Wrench, "Разово или регулярно", "Выручка по точкам", "Разово считает сам, регулярно делает инструмент"], [MessageCircle, "ИИ спрашивает первым", "Любая новая задача", "«Задай мне вопросы» вместо идеального промпта"]].map(([I, t, ex, d], k) => (
            <Card key={k} v={k % 2 ? rise : fromDeep} hi={k === 3} className="p-[20px_20px_22px]">
              <div className="flex items-center gap-[10px] mb-[14px]"><Icon icon={I as LucideIcon} size={40} /><b className="text-[26px] font-semibold text-ink">{LETTERS[k]}</b></div>
              <b className="block text-[21px] font-medium text-ink leading-[1.15]">{t as string}</b>
              <span className="block mt-[10px] text-[17px] text-blue">{ex as string}</span>
              <span className="block mt-[8px] text-[16px] text-body leading-[1.35]">{d as string}</span>
            </Card>
          ))}
        </div>
        <Sub className="mt-[40px] text-[21px] max-w-[1200px]">Быстро покажу, как решается типовое. Ваша работа на сегодня: записать свою задачу одной строкой. К следующему занятию подготовим помощника, который превратит вашу строку в техническое задание, и разберём их вместе.</Sub>
      </Group>
    </Pad>
  ) },

  /* 18. А */
  { title: "Способ А: быстрый диалог с телефона", mood: "quiet", notes: "Зеркало телефона или ролик 40 секунд. Письмо арендатору — готовым результатом в веб-версии.", render: () => (
    <Pad>
      <Group>
        <Pills items={WAYS} on={0} marks={LETTERS} />
        <H tail="Две минуты, по дороге">Отзыв гостя и письмо арендатору</H>
        <Two cols="1fr 400px" className="items-start gap-[64px] mt-[36px]">
          <div className="grid gap-[14px]">
            <Sub className="text-[20px]">Фото отзыва или голос вместо текста. Вводное и проект уже знают, кто вы и как у вас принято. <Strong>Проверка:</Strong> нет обещаний, которых нет в правилах; даты и суммы совпадают с вашими; одна просьба в конце.</Sub>
            <Frame title="Новый чат · веб-версия" v={fromLeft} meta="Второй пример: письмо арендатору на английском по вводному">
              <Chat compact start={2.2} gap={.9} msgs={[{ me: true, text: "Напиши арендатору на английском: договор до 30 ноября, предлагаем продление на год на тех же условиях, ответ до 15 ноября" }, { text: "Dear Mr. Haddad, your lease ends on 30 November. We offer a 12‑month renewal on the same terms. Please confirm by 15 November so we can prepare the addendum. Kind regards, Ildar, Property Manager." }]} />
            </Frame>
          </div>
          <Phone className="w-[380px]">
            <Chat compact start={1.2} gap={.8} msgs={[{ me: true, text: "📷 скриншот отзыва" }, { me: true, text: "Отзыв на 3 звезды: вкусно, но счёт ждали 25 минут. Ответь от управляющего, коротко, по нашим правилам" }, { text: "Марина, спасибо за честный отзыв и за «вкусно». Счёт за 25 минут — наша ошибка, разобрали со сменой. Приходите в будни: десерт за наш счёт, скажите администратору «отзыв от 17 октября». Ильдар, управляющий." }, { me: true, text: "Проверил по правилам, отправляю" }]} />
          </Phone>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 19. Б */
  { title: "Способ Б: инструкция плюс документ", mood: "quiet", notes: "Живой экран: вымышленное КП, одно слово «разбери». Показать «не указано». Та же инструкция словом «подготовь» делает наше КП.", render: () => (
    <Pad>
      <Group>
        <Pills items={WAYS} on={1} marks={LETTERS} />
        <H tail="и готовится так же">Коммерческое предложение разбирается одним словом</H>
        <Two cols="1fr 1.15fr" className="mt-[36px]">
          <div className="grid gap-[16px]">
            <Prompt text="Разбери приложенное коммерческое предложение. Сначала таблица: позиция, цена, срок, условия оплаты, гарантия. Потом три главных риска для нас как заказчика и три вопроса поставщику. В конце одна рекомендация: брать, торговаться или отказаться. Если данных нет, пиши «не указано», не додумывай." delay={.6} speed={12} note="Инструкция лежит в проекте «Закупки». Парная инструкция готовит наше КП: «подготовь по стандарту»." />
            <Sub className="text-[20px]">Инструкция пишется один раз. Дальше любой документ разбирается словом «разбери», а своё КП готовится словом «подготовь». Та же схема для договора аренды: таблица сроков, сумм и штрафов, три риска, три вопроса. Реквизиты перед загрузкой обезличиваем.</Sub>
          </div>
          <motion.div variants={fromRight} className="relative rounded-[14px] overflow-hidden bg-white border border-line window">
            <div className="px-[18px] py-[14px] text-[17px] text-mute" style={{ borderBottom: "1px solid #dfe3ea" }}>Ответ · КП на оборудование для кухни, 2 страницы</div>
            <div className="p-[22px_24px]">
              <table className="w-full border-collapse text-[19px]">
                <thead><tr>{["Позиция", "Цена", "Срок", "Оплата", "Гарантия"].map(h => <th key={h} className="text-left font-medium text-[15px] text-mute px-[12px] py-[10px]" style={{ borderBottom: "1px solid #dfe3ea" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["Пароконвектомат", "486 000 ₽", "21 день", "50 / 50", "не указано"], ["Холодильный стол", "128 000 ₽", "не указано", "50 / 50", "12 мес."], ["Монтаж", "не указано", "3 дня", "не указано", "—"]].map((r, i) => (
                    <motion.tr key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.6 + i * .3 }}>
                      {r.map((c, j) => <td key={j} className={"px-[12px] py-[10px] " + (c === "не указано" ? "text-warn font-medium" : j ? "text-ink tabular-nums" : "text-body")} style={{ borderBottom: "1px solid #dfe3ea" }}>{c}</td>)}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.7 }} className="text-[19px] text-body mt-[16px]"><Strong>Рекомендация:</Strong> торговаться. Три «не указано» в ключевых полях — запросить до подписания.</motion.p>
            </div>
          </motion.div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 20. В */
  { title: "Способ В: поиск и доступ к данным", mood: "quiet", notes: "Реальных контрагентов в эфире не проверяем. Суть: правильно сформулированный запрос и честность про доступ: открытые источники, авторизация, ключ API или свой бот.", render: () => (
    <Pad>
      <Group>
        <Pills items={WAYS} on={2} marks={LETTERS} />
        <H tail="или как дать ему доступ">Как попросить ИИ найти данные</H>
        <div className="grid grid-cols-3 gap-[26px] mt-[44px]">
          <Card v={fromLeft}><CardTitle icon={Search}>Открытые источники</CardTitle><Bullets items={["Назвать тип источников: официальные сайты, реестры, профильные издания", "Период цифрами: «сентябрь–октябрь 2026», а не «недавно»", "Ссылка и дата на каждое утверждение. Нет ссылки — нет факта"]} /></Card>
          <Card hi><CardTitle icon={Lock}>Закрытые сайты</CardTitle><Bullets items={["Если данные видны только после входа, ИИ их не получит без вас", <>Три пути: вы входите сами и даёте файл; у сервиса есть ключ API; свой бот <Term>агент</Term>, который заходит по вашим правам</>, "Про защиту не забываем: доступ только на чтение, только к нужному"]} /></Card>
          <Card v={fromRight}><CardTitle icon={ShieldCheck}>Проверка</CardTitle><Bullets items={["Открыть две ссылки и прочитать своими глазами", "Дата документа совпадает с тем, что написал ИИ", <>Глубокое исследование <Term>deep research</Term>: отчёт с цитатами за 10–30 минут, формат задать заранее</>]} /></Card>
        </div>
        <Prompt v={rise} className="mt-[32px] text-[20px]" text="Какие требования к вентиляции кухни ресторана действуют в России в 2026 году? Только официальные источники. Для каждого утверждения — дата документа и ссылка." delay={1.2} speed={12} />
      </Group>
    </Pad>
  ) },

  /* 21. Г */
  { title: "Способ Г: разово считает, регулярно делает инструмент", mood: "quiet", notes: "Главная мысль: ИИ гибкий. Разовую задачу решает сам, повторяющуюся превращает в инструмент. Кейс таск-менеджера рассказать своими словами.", render: () => (
    <Pad>
      <Group>
        <Pills items={WAYS} on={3} marks={LETTERS} />
        <H tail="Регулярно — делает инструмент">Разово ИИ считает сам</H>
        <Two cols="1fr 1fr" className="mt-[36px] [&_h3]:text-[22px] [&_h3]:mb-[6px]">
          <div className="grid gap-[12px]">
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={BarChart3}>Разовая задача</CardTitle><CardText className="text-[17px]">Таблица на 18 строк: «какая точка просела и на сколько, сначала назови формулу». ИИ прочитает, посчитает и объяснит. Одну цифру сверьте руками.</CardText></Card>
            <Card v={fromLeft} hi className="p-[16px_22px]"><CardTitle icon={Wrench}>Повторяющаяся задача</CardTitle><CardText className="text-[17px]">Выгрузка из iiko на тысячи строк каждый понедельник. Просим не «разбери документ», а «сделай инструмент, который разбирает такие документы»: скрипт, маленькое приложение или агента. Дальше работает инструмент, а не вы.</CardText></Card>
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={ClipboardList}>С чего начинается инструмент</CardTitle><CardText className="text-[17px]">С подробного ТЗ <Term>техническое задание</Term> и схемы: что на входе, что на выходе, кто пользуется, что нельзя. ТЗ тоже пишет ИИ, вы отвечаете на вопросы.</CardText></Card>
          </div>
          <Card v={fromRight} className="p-[24px_26px]">
            <CardTitle icon={Sparkles}>Кейс: свой таск-менеджер за неделю</CardTitle>
            <CardText className="text-[19px]">Запрос руководства: внутренний закрытый таск-менеджер, работает только с наших адресов <Term>белые списки</Term>. ИИ написал ТЗ по ответам на вопросы, затем собрал приложение и разместил на домене компании. Неделя вместо месяцев подрядчика.</CardText>
            <div className="grid grid-cols-3 gap-[10px] mt-[20px]">
              {[["1", "ТЗ и схема", "вопросы → документ"], ["2", "Сборка", "агент пишет код по ТЗ"], ["3", "Запуск", "домен компании, доступ по списку"]].map(([n, t, d]) => <div key={n} className="rounded-[10px] px-[14px] py-[12px] bg-paper border border-line"><small className="block text-[14px] text-blue tabular-nums">0{n}</small><b className="block text-[18px] text-ink font-medium mt-[4px]">{t}</b><span className="text-[15px] text-mute">{d}</span></div>)}
            </div>
            <CardText className="mt-[18px] text-[16px] text-mute">Скриншоты интерфейса добавим в конспект.</CardText>
          </Card>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 22. Д */
  { title: "Способ Д: ИИ спрашивает первым", mood: "quiet", notes: "Взять задачу из зала или пример с арендой виллы. Три вопроса, не больше.", render: () => (
    <Pad>
      <Group>
        <Pills items={WAYS} on={4} marks={LETTERS} />
        <H tail="«задай мне вопросы»">Одна фраза заменяет идеальный промпт</H>
        <Two cols="1fr 1fr" className="mt-[40px] gap-[50px]">
          <div className="grid gap-[16px]">
            <Prompt text="Мне нужно объявление об аренде виллы в Дубае на английском. Задай мне 10–15 вопросов, чтобы собрать всё для этой задачи. По одному, дожидайся ответа. Не принимай расплывчатые ответы, уточняй. Когда вопросы закончатся, скажи «готов»." delay={.5} speed={12} note="Потом: «Теперь у тебя есть всё. Сделай задачу. Конкретно, без воды»." />
            <Sub className="text-[20px]">Так ИИ сам собирает вводные к задаче: вы отвечаете, а не формулируете. Подходит для любой новой темы, где непонятно, с чего начать.</Sub>
          </div>
          <Frame title="Новый чат" v={fromRight}>
            <Chat start={3.4} gap={.6} msgs={[{ text: "1. Район и тип виллы: сколько спален, есть ли бассейн и вид?" }, { me: true, text: "Palm Jumeirah, 4 спальни, бассейн, вид на море" }, { text: "2. Срок аренды и цена: годовой контракт или помесячно, сколько чеков?" }, { me: true, text: "Год, 2 чека" }, { text: "3. Для кого объявление: семьи, экспаты-арендаторы, агенты? От этого зависит тон." }]} />
          </Frame>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 23. Обсуждение 3 */
  { title: "Обсуждение: ваша задача одной строкой", mood: "quiet", notes: "Третья пауза. Каждый называет задачу, которую записал. Это домашнее задание: одна строка в Telegram.", render: () => (
    <Discuss q="Какую задачу вы записали? Одна строка: что на входе, что должно получиться на выходе." notes="Это и есть домашнее задание. Строку в Telegram сегодня, разбор на следующем занятии." hints={["«Каждый понедельник выгрузка из iiko → сводка по точкам руководству»", "«Отзыв гостя → ответ управляющего по нашим правилам»", "«Договор аренды → реестр сроков и сумм в таблице»", "«КП поставщика → таблица, риски, рекомендация»"]} />
  ) },

  /* 24. Где живёт агент */
  { title: "Что такое агент на самом деле", mood: "quiet", notes: "Агент работает по заранее описанному сценарию и должен где-то жить: арендованный сервер или всегда включённый компьютер. Показать обезличенную переписку с домашним агентом.", render: () => (
    <Pad>
      <Group>
        <H tail="и где-то живёт">Агент работает по сценарию</H>
        <Two cols="1fr 400px" className="items-start gap-[60px] mt-[36px] [&_h3]:text-[22px] [&_h3]:mb-[6px]">
          <div className="grid gap-[12px]">
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={ClipboardList}>Сценарий, а не магия</CardTitle><CardText className="text-[17px]">Агент — это модель плюс доступ к папкам и программам плюс заранее описанный сценарий: что делать, в каком порядке, что проверить, кому отчитаться. Сценарий пишется один раз и правится словами.</CardText></Card>
            <Card v={fromLeft} hi className="p-[18px_22px]"><CardTitle icon={Server}>Где он живёт</CardTitle><CardText className="text-[17px]">Вечно живущих ИИ «в воздухе» не бывает. Чтобы агент работал без вас, ему нужен постоянно включённый компьютер, арендованный сервер или облако самого сервиса <Term>Codex cloud, задачи по расписанию</Term>. Пульт к нему — Telegram, память и история — репозиторий на GitHub.</CardText></Card>
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={ShieldCheck}>Условие</CardTitle><CardText className="text-[17px]">Каждый результат проверяет человек. Агент пишет, что сделал и что не смог. Доступ ограничиваю настройками среды: только папка проекта. Файл правил это инструкция, а не замок.</CardText></Card>
          </div>
          <Phone className="w-[380px]" app="Telegram" model="Агент на домашнем ПК" placeholder="Сообщение">
            <Chat compact start={1.2} gap={.9} msgs={[{ me: true, text: "Собери реестр договоров аренды из папки «Дубай», срок окончания до конца года, в xlsx" }, { text: "Принял. 37 файлов в папке, читаю…" }, { text: "Готово: 9 договоров заканчиваются до 31 декабря. Два файла не прочитались, они в списке отдельно." }, { text: "реестр-аренда-дубай.xlsx · 11 строк", file: true }, { me: true, text: "Отлично. В пятницу повтори" }]} />
          </Phone>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 25. GitHub и правильные слова */
  { title: "GitHub и правильные слова", mood: "quiet", notes: "Показать репозиторий этой презентации на GitHub и страницу Pages: сайт без сервера. Термины произносить правильно, чтобы участники потом могли гуглить.", render: () => (
    <Pad>
      <Group>
        <H tail="Она лежит на GitHub">Эта презентация — сайт без сервера</H>
        <Two cols="1.1fr 1fr" className="items-start mt-[36px]">
          <div className="grid gap-[14px]">
            <Sub className="text-[21px]"><Strong>Репозиторий</Strong> <Term>repository</Term>: папка проекта с историей всех изменений. Что сделал агент, когда и зачем, видно по шагам, любое изменение можно откатить.</Sub>
            <Sub className="text-[21px]"><Strong>GitHub</Strong>: сервис, где репозитории хранятся и публикуются. Эта колода опубликована через GitHub Pages: без сервера и без хостинга, адрес открывается у всех.</Sub>
            <Sub className="text-[21px]"><Strong>Skills</Strong> <Term>навыки</Term>: сохранённые процедуры для агента: «делаю пять раз в неделю, значит навык». Лежат в той же папке проекта, подключаются одной строкой.</Sub>
            <Item className="mt-[6px]"><LogoRow items={[[logoGithub, "github.com/Zakrasava/ai-training-deck"], [logoGithub, "GitHub Pages"]]} /></Item>
          </div>
          <div className="grid gap-[14px]">
            <Shot src={shotGithub} h={250} caption="github.com/Zakrasava/ai-training-deck" />
            <Shot src={shotPages} h={220} caption="GitHub Pages: опубликованная страница" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 26. Глоссарий */
  { title: "Словарь: шестнадцать слов", mood: "quiet", notes: "Не зачитывать. Спросить, какое слово непонятно прямо сейчас. Отдельно назвать «расширение браузера» и «коннектор (MCP)».", render: () => (
    <Pad>
      <Group>
        <H tail="до собственного агента">Шестнадцать слов, которых хватит</H>
        <div className="grid grid-cols-4 gap-[14px_18px] mt-[40px]">
          {[["Модель", "«Мозг» сервиса. Думающая (reasoning) считает дольше и точнее."], ["Контекст", "Всё, что модель видит сейчас: чат, файлы, инструкции."], ["Токен", "Единица счёта текста, кусочек слова; в русском короче. За них платят по ключу API."], ["Инструкции", "Правила, которые читаются перед каждым ответом: личные и проектные."], ["Проект", "Папка с файлами, правилами и памятью. Рабочее место."], ["Память", "Факты о вас между чатами: сводка памяти и история чатов."], ["Агент", "Модель плюс доступ к папкам и программам плюс сценарий. Делает шаги сам."], ["Файл правил", "AGENTS.md, CLAUDE.md: что за задача и как у вас принято. Агент читает первым."], ["Ключ API", "Строка для доступа программы к модели. Показывается один раз."], ["Репозиторий", "Папка проекта с историей изменений. Хранится на GitHub."], ["Skills", "Сохранённые процедуры агента: «делаю пять раз в неделю, значит навык»."], ["Локальная модель", "ИИ, который работает на вашем компьютере и ничего не отправляет наружу."], ["Расширение браузера", "Claude in Chrome, ChatGPT для Chrome: ИИ видит вкладки и действует на сайтах."], ["Коннектор (MCP)", "Подключение ИИ к почте, календарю, диску; 1С в перспективе. Сначала только чтение."], ["Временный чат", "Не попадает в историю и память, но это всё же облако: для разового, не для персональных данных."], ["Deep Research", "Глубокое исследование: десятки запросов и отчёт со ссылками за 10–30 минут."]].map(([b, s], k) => (
            <Item key={k} v={pop} className="rounded-[12px] px-[18px] py-[14px] panel"><b className="block text-[20px] font-medium mb-[4px] text-ink">{b}</b><span className="text-[15px] text-body leading-[1.3]">{s}</span></Item>
          ))}
        </div>
      </Group>
    </Pad>
  ) },

  /* 27. Три шага */
  { title: "Три шага на сегодня", mood: "quiet", notes: "Три шага на сегодня. Не говорить «компания»: у кого-то ресторан, у кого-то ИП. Конспект с промптами придёт вечером.", render: () => (
    <Pad>
      <Group>
        <H tail="знает ваш принцип работы">Три шага, после которых ИИ</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[52px]">
          <Card v={fromLeft}><CardTitle icon={Wallet}>Аккаунт и модель</CardTitle><CardText>По инструкции из конспекта. Высокий уровень рассуждения по умолчанию. Не получается — пишите в Telegram, разберём.</CardText></Card>
          <Card hi><CardTitle icon={PenLine}>Вводное</CardTitle><CardText>Пройти промпт‑интервью из конспекта, вставить результат в личные инструкции. Задать один рабочий вопрос и сравнить с тем, что было.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={FolderOpen}>Один проект</CardTitle><CardText>На самую частую задачу. Два‑три файла без персональных данных и короткая инструкция. Это будущее рабочее место вашего агента.</CardText></Card>
        </div>
        <Sub className="mt-[44px] text-[21px] max-w-[1100px]">Конспект с промптами и словарём придёт сегодня вечером. Туда же одной строкой — ваша задача из обсуждения.</Sub>
      </Group>
    </Pad>
  ) },

  /* 28. Финал */
  { title: "До следующей встречи: QR", mood: "hero", notes: "Финал. QR ведёт в Telegram; ссылку продублировать в чат встречи и сказать «нажмите на неё в чате»: 14 человек смотрят с телефона и QR не отсканируют. Попросить написать одной строкой, какую задачу хотят автоматизировать; ответ каждому разбором в Telegram.", render: () => (
    <Pad className="grid items-center gap-[80px]" style={{ gridTemplateColumns: "1fr 420px" }}>
      <Group delay={.2}>
        <H size={92} tail="напишите одну строку">До следующей встречи</H>
        <Sub className="mt-[34px] text-[26px] max-w-[760px]">Какую задачу вы хотите автоматизировать: что на входе, что должно получиться на выходе. Напишите мне в Telegram сегодня: ссылка продублирована в чате встречи. Я разберу каждую и отвечу в Telegram, самые частые задачи возьмём на следующую встречу.</Sub>
        <div className="grid grid-cols-3 gap-[14px] mt-[36px] max-w-[760px]">
          {[[Send, "Строка в Telegram", "задача, вход, выход"], [FileText, "Конспект вечером", "промпты, словарь, шаги"], [Sparkles, "Следующая встреча", "самые частые задачи"]].map(([I, t, d]) => <div key={t as string} className="rounded-[12px] px-[16px] py-[14px] bg-white border border-line"><Icon icon={I as LucideIcon} size={34} /><b className="block mt-[10px] text-[18px] font-medium text-ink">{t as string}</b><span className="text-[15px] text-mute">{d as string}</span></div>)}
        </div>
      </Group>
      <motion.div variants={fromRight} initial="hidden" animate="show" className="rounded-[20px] p-[26px] bg-white border border-line window text-center">
        <div className="mx-auto w-[300px] h-[300px] [&>svg]:w-full [&>svg]:h-full text-ink" dangerouslySetInnerHTML={{ __html: qrTelegram.replace(/<\?xml[^>]*\?>/, "").replace("<path", '<path fill="#0f172a"') }} />
        <div className="mt-[16px] flex items-center justify-center gap-[10px] text-[20px] text-ink"><Logo src={logoTelegram} size={22} />{TELEGRAM_LINK}</div>
        <div className="mt-[6px] text-[15px] text-mute">Наведите камеру телефона</div>
      </motion.div>
    </Pad>
  ) },
];
