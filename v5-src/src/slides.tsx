import type { ReactNode, CSSProperties } from "react";
import { motion } from "motion/react";
import { Group, Item, Kicker, H, Sub, Strong, Card, CardTitle, CardText, Bullets, Ask, Win, Chat, Phone, Prompt, Counter, Bars, Steps, Frame, Icon, rise, fromLeft, fromRight, fromDeep, pop } from "@/deck/primitives";
import { cn } from "@/lib/utils";
import { MessageCircle, HelpCircle, BookOpen, Users, FileText, Smartphone, Monitor, Laptop, KeyRound, CreditCard, UserCog, AlertTriangle, ListChecks, Ban, ClipboardList, Building2, Globe, PenLine, CheckCircle2, GitBranch, Timer, Search, Layers, ShieldCheck, BarChart3, Wallet, FolderOpen, Folder, Server, Wrench, Repeat, Lock, Sparkles, Scale, type LucideIcon } from "lucide-react";
import logoOpenAI from "@/assets/logos/openai.svg?raw";
import logoClaude from "@/assets/logos/claude.svg?raw";
import logoGithub from "@/assets/logos/github.svg?raw";
import logoTelegram from "@/assets/logos/telegram.svg?raw";
import logoGemini from "@/assets/logos/googlegemini.svg?raw";
import shotGithub from "@/assets/shots/github-repo.png";
import shotPages from "@/assets/shots/pages-deck.png";
import shotMemory from "@/assets/shots/chatgpt-memory.png";
import shotInstrRow from "@/assets/shots/chatgpt-instructions-row.png";
import shotInstrForm from "@/assets/shots/chatgpt-instructions-form.png";
import shotProject from "@/assets/shots/chatgpt-project.png";
import shotClaudeInstr from "@/assets/shots/claude-instructions.png";
import shotClaudeMemory from "@/assets/shots/claude-memory.png";
import shotClaudeProjects from "@/assets/shots/claude-projects.png";

export type Slide = { mood: "hero" | "section" | "quiet"; notes: string; render: () => ReactNode };

/* ---------- локальные примитивы ---------- */
const Pad = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={"absolute inset-0 px-[110px] pt-[84px] pb-[96px] " + className} style={style}>{children}</div>
);
/* Правило: на уровне заголовка ничего не стоит. Заголовок на всю ширину, ниже две колонки. */
const Two = ({ children, cols = "1fr 1.05fr", className = "" }: { children: ReactNode; cols?: string; className?: string }) => (
  <div className={cn("grid items-start gap-[56px] mt-[40px]", className)} style={{ gridTemplateColumns: cols }}>{children}</div>
);
const Section = ({ n, title, tail, lead, steps }: { n: string; title: string; tail: string; lead?: string; steps?: [string, string][] }) => (
  <Pad className="grid items-start gap-[110px]" style={{ gridTemplateColumns: "1fr 600px" }}>
    <Group delay={.15}>
      <Kicker>{n}</Kicker>
      <H size={104} tail={tail}>{title}</H>
      {lead && <Sub className="mt-[30px] max-w-[640px] text-[25px]">{lead}</Sub>}
    </Group>
    {steps && <Group delay={.5} className="mt-[52px]"><Steps items={steps} /></Group>}
  </Pad>
);
/* Пауза на обсуждение после каждой темы */
const Discuss = ({ q, hints, notes }: { q: string; hints: string[]; notes?: string }) => (
  <Pad className="grid items-center gap-[90px]" style={{ gridTemplateColumns: "1fr 620px" }}>
    <Group delay={.1}>
      <Kicker>Пауза, пять минут</Kicker>
      <H size={104} tail="обсудим">Давайте</H>
      <Sub className="mt-[28px] text-[28px] max-w-[640px]">{q}</Sub>
      {notes && <Sub className="mt-[16px] text-[20px] text-mute max-w-[640px]">{notes}</Sub>}
    </Group>
    <Group delay={.5} className="grid gap-[12px]">
      {hints.map((h, k) => <Card key={k} v={fromRight} className="p-[18px_22px]"><CardText className="text-[21px] text-ink">{h}</CardText></Card>)}
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
/* Скриншот в рамке */
const Shot = ({ src, caption, v = fromRight, className, h = 230 }: { src: string; caption?: string; v?: typeof rise; className?: string; h?: number | string }) => (
  <motion.figure variants={v} className={cn("m-0", className)}>
    <img src={src} alt="" className="block w-full object-cover object-top rounded-[12px] border border-line window" style={{ height: h }} />
    {caption && <figcaption className="mt-[10px] text-[15px] text-mute">{caption}</figcaption>}
  </motion.figure>
);
/* Дерево папок проектов */
const TreeRow = ({ depth = 0, icon, name, meta, hi }: { depth?: number; icon: LucideIcon; name: string; meta?: string; hi?: boolean }) => (
  <Item className={cn("flex items-center gap-[10px] py-[4px] pr-[12px] rounded-[8px] text-[17px]", hi ? "bg-blue/8 text-ink" : "text-body")} style={{ paddingLeft: 14 + depth * 30 }}>
    <Icon icon={icon} size={28} className={hi ? "border-blue/40" : ""} /><span className={hi ? "font-medium" : ""}>{name}</span>{meta && <small className="ml-auto text-[15px] text-mute">{meta}</small>}
  </Item>
);
const Term = ({ children }: { children: ReactNode }) => <span className="text-mute">({children})</span>;

export const slides: Slide[] = [
  /* 1. Титул */
  { mood: "hero", notes: "Пауза 20–30 секунд, пока подключаются. В окне справа печатается коммерческое предложение по одной фразе: это результат сегодняшних настроек. Ничего не читать вслух.", render: () => (
    <Pad className="grid items-center gap-[90px]" style={{ gridTemplateColumns: "1fr 680px" }}>
      <Group delay={.2}>
        <Kicker>Корпоративное обучение работе с ИИ</Kicker>
        <motion.h1 variants={rise} className="font-semibold tracking-[-.045em] leading-[.95] text-[118px] text-ink">ИИ как новый <span className="tail">сотрудник</span></motion.h1>
        <Sub className="mt-[36px] max-w-[700px] text-[26px]">От первого вопроса до собственного агента. Ничего писать не придётся: всё уже написано, мы научимся это настраивать и включать.</Sub>
        <Item className="mt-[34px]"><LogoRow items={[[logoOpenAI, "ChatGPT"], [logoClaude, "Claude"], [logoOpenAI, "Codex"], [logoGemini, "Gemini"], [logoGithub, "GitHub"], [logoTelegram, "Telegram"]]} /></Item>
      </Group>
      <Frame title="Новый чат" meta="Думающая модель, личные инструкции и проект «Закупки» подключены">
        <Chat start={1.4} gap={1.1} msgs={[{ me: true, text: "Напиши поставщику: задержали поставку" }, { text: "Андрей, добрый день. По договору № 14 поставка должна была прийти 14 октября, сегодня 18‑е. Прошу до 12:00 завтра подтвердить дату отгрузки. По п. 6.2 с 19 октября начисляется неустойка 0,1% в день, пока удерживать не будем. Ильдар, управляющий." }]} />
      </Frame>
    </Pad>
  ) },

  /* 2. Обещание */
  { mood: "section", notes: "Главная мысль курса: от чата к собственному агенту. Без расписания встреч: план дальше решим после первого занятия.", render: () => (
    <Pad>
      <Group>
        <Kicker>Чем это закончится</Kicker>
        <motion.h2 variants={rise} className="text-[62px] font-semibold tracking-[-.035em] leading-[1.05] max-w-[1320px] text-ink">К концу курса у каждого из вас будет <span className="grad">собственный ИИ‑агент</span>, который берёт на себя вашу рутину.</motion.h2>
        <Sub className="mt-[22px] text-[27px] max-w-[1000px]">Писать код не придётся: всё уже написано. Мы научимся это настраивать и включать. Сегодня первая ступень.</Sub>
        <div className="grid grid-cols-4 gap-[16px] mt-[64px]">
          {[["Чат", "Вопросы без страха. Вводное, после которого ИИ знает, с кем говорит и как у вас принято."], ["Проект", "Рабочее место: папка, файлы, правила. ИИ помнит задачу, а не только разговор."], ["Агент", "Готовый агент на вашем компьютере. Его не пишут, его включают и дают правила."], ["Ваш агент", "Под вашу задачу, по расписанию, с отчётом в Telegram."]].map(([t, d], k) => (
            <Card key={k} hi={k === 3} v={k % 2 ? rise : fromDeep} className="p-[24px_26px]"><small className="block text-[16px] text-mute tabular-nums mb-[14px]">0{k + 1}</small><CardTitle>{t}</CardTitle><CardText className="text-[19px]">{d}</CardText></Card>
          ))}
        </div>
      </Group>
    </Pad>
  ) },

  /* 3. Правило ноль */
  { mood: "quiet", notes: "Главная мысль по словам Кирилла: не бояться. Показать свой чат «Объясни мне» или завести его в эфире за 30 секунд.", render: () => (
    <Pad>
      <Group>
        <Kicker>Правило номер ноль</Kicker>
        <H tail="Понимание приходит в процессе">Не бойтесь с ним разговаривать.</H>
        <Two cols="1.1fr 1fr" className="mt-[36px] gap-[50px]">
          <div className="grid gap-[10px] [&_h3]:text-[24px] [&_h3]:mb-[6px] [&_p]:text-[19px]">
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={MessageCircle}>Говорите как с человеком</CardTitle><CardText>Не ищите «правильный промпт» <Term>запрос</Term>. Опишите ситуацию словами, как коллеге: что случилось, что нужно, к какому сроку. Переспросите, если непонятно. Это нормально.</CardText></Card>
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={HelpCircle}>Глупых вопросов нет</CardTitle><CardText>«Что такое токен?», «Почему ты так ответил?», «Объясни проще». ИИ не устанет и не осудит. Половина из вас написала в опроснике «нет времени разбираться». Разбираться не нужно, нужно спрашивать.</CardText></Card>
            <Card v={fromLeft} hi className="p-[18px_22px]"><CardTitle icon={BookOpen}>Заведите чат «Объясни мне»</CardTitle><CardText>Отдельный чат для всего непонятного: термин из письма, кнопка в программе, фраза из этой презентации. Через месяц это ваш личный учебник.</CardText></Card>
          </div>
          <Phone className="w-[380px] justify-self-end">
            <Chat compact start={1.1} gap={.8} msgs={[
              { me: true, text: "Слушай, а что значит «контекст»? Мне сказали, что у тебя он большой" },
              { text: "Контекст — это всё, что я вижу прямо сейчас: наш разговор, файлы, которые вы прикрепили, и ваши инструкции. Чем он чище и точнее, тем лучше ответ. Показать на примере вашего письма?" },
              { me: true, text: "Давай. И объясняй мне так всегда, без умных слов" },
              { text: "Запомнил: объяснять просто, без жаргона." }]} />
          </Phone>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 4. Как я работаю */
  { mood: "quiet", notes: "Один обезличенный скриншот рабочего экрана, 20 секунд. Назвать холдинг: рестораны, земля, Дубай. Не говорить, что курс собрали агенты.", render: () => (
    <Pad>
      <Group>
        <Kicker>Как я работаю</Kicker>
        <H tail="и правила вместо повторений">В работе у меня два агента</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[56px]">
          <Card v={fromLeft}><CardTitle icon={Users}>Один пишет, второй спорит</CardTitle><CardText>Первый агент делает работу: тексты, таблицы, код. Второй проверяет и возвращает с замечаниями. Я ставлю задачу и принимаю результат.</CardText></Card>
          <Card><CardTitle icon={FileText}>Правила вместо повторений</CardTitle><CardText>В каждом проекте лежит файл с правилами <Term>AGENTS.md, CLAUDE.md</Term> и паспорт задачи. Агент читает их первым, поэтому мне не нужно объяснять одно и то же каждое утро.</CardText></Card>
          <Card v={fromRight} hi><CardTitle icon={Smartphone}>Пульт в телефоне</CardTitle><CardText>Пишу в Telegram «собери отчёт по выручке за неделю», домашний компьютер делает и присылает файл. Это умеет не программист, а тот, кто правильно настроил.</CardText></Card>
        </div>
        <Item className="mt-[28px]"><LogoRow items={[[logoClaude, "Claude Code"], [logoOpenAI, "Codex"], [logoGithub, "GitHub"], [logoTelegram, "Telegram"]]} /></Item>
      </Group>
    </Pad>
  ) },

  /* 5. Опросник */
  { mood: "quiet", notes: "Данные опросника агрегированы, имён нет. Спросить: у кого iiko или r_keeper, у кого 1С.", render: () => (
    <Pad>
      <Group>
        <Kicker>Что вы написали в опроснике: 23 ответа, без имён</Kicker>
        <H tail="время и формулировки">Вы уже пользуетесь ИИ. Мешают не технологии, а</H>
        <div className="grid mt-[36px] gap-[24px] items-start" style={{ gridTemplateColumns: "1fr 1fr 1.2fr" }}>
          <div className="grid gap-[16px]">
            <Card v={fromLeft} className="p-[22px_24px]">
              <CardTitle icon={UserCog}>Кто вы</CardTitle>
              <div className="grid grid-cols-2 gap-[10px]">
                <div><div className="text-[56px] leading-[.95]"><Counter to={15} /></div><CardText className="text-[18px] mt-[6px]">пользуются каждый день или несколько раз в неделю</CardText></div>
                <div><div className="text-[56px] leading-[.95]"><Counter to={12} delay={.7} /></div><CardText className="text-[18px] mt-[6px]">работают только с телефона</CardText></div>
              </div>
              <CardText className="mt-[10px] text-[19px]">ChatGPT у большинства, у шести ещё Claude. Платный аккаунт у девяти, бесплатный у семи, у троих нет.</CardText>
            </Card>
            <Ask className="mt-0 text-[19px]">У кого iiko, r_keeper или 1С? Напишите в чат: разберём вашу выгрузку</Ask>
          </div>
          <Card className="p-[22px_24px]">
            <CardTitle icon={AlertTriangle}>Что мешает</CardTitle>
            <Bars height={130} className="my-[30px] mb-[44px] mx-[6px]" data={[{ v: 100, val: "11", label: "время" }, { v: 55, val: "6", label: "слова" }, { v: 27, val: "3", label: "доступ", dim: true }, { v: 9, val: "1", label: "данные", dim: true }]} />
            <CardText className="text-[19px]">Про память ИИ впервые слышат пятеро, про своих ассистентов — восемь. Агентов пробовали двое. На вопрос «что такое агент» самый частый ответ: «хочу разобраться».</CardText>
          </Card>
          <Card v={fromRight} hi className="p-[20px_22px] [&_li]:text-[17px] [&_li]:mt-[4px] [&_li]:leading-[1.32]">
            <CardTitle icon={ListChecks}>Что хотите поручить</CardTitle>
            <Bullets items={["Сводки выручки, отчёты руководству, сведение данных из нескольких юрлиц", "Презентации: участки для инвесторов, меню, объекты по шаблону", "Ответы на отзывы и сообщения гостей по скриптам", "Письма поставщикам, разбор коммерческих предложений и цен", "ТТК, себестоимость, подбор рецептур под фуд-кост", "Договоры, бизнес-план и финмодель участка, поиск персонала"]} />
            <CardText className="mt-[10px] text-[17px]">Сегодня: отзывы, КП, выручка. Презентация участка соберётся через час на ваших глазах.</CardText>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 6. Обсуждение 1 */
  { mood: "quiet", notes: "Первая пауза. Разогнать разговор: пусть два‑три человека назовут задачу. Записывать в чат встречи: вернёмся к ним в части про способы.", render: () => (
    <Discuss q="Что из этого списка у вас болит сильнее всего? Назовите одну задачу, которую вы делаете руками каждую неделю." notes="Я записываю. К концу встречи у каждой задачи будет способ, а у вас — домашнее задание из одной строки." hints={["Отчёт, который собирается из нескольких таблиц", "Письмо, которое вы пишете по одному и тому же шаблону", "Документ, который приходится читать целиком ради трёх цифр", "Вопрос, на который вы отвечаете коллегам по десять раз"]} />
  ) },

  /* 7. Раздел: новый сотрудник */
  { mood: "section", notes: "Аналогия: новый сотрудник в команде, не стажёр. У него есть вводное: что за компания, чем занимается, за что он отвечает. ИИ нужно то же самое, один раз.", render: () => (
    <Section n="Часть первая" title="Новый" tail="сотрудник" lead="Когда к вам выходит новый человек, у него есть вводное: что за компания, чем она занимается, за что он отвечает и как здесь принято. ИИ нужно то же самое. Вводное пишется один раз, дальше он учитывает его в каждом ответе." steps={[["Один запрос, два ответа", "3 мин"], ["Что входит во вводное", "3 мин"], ["Вводное пишет сам ИИ", "в настройках, через 10 минут"]]} />
  ) },

  /* 8. До / после */
  { mood: "quiet", notes: "Оба ответа подготовлены заранее. Мысль: без вводного ИИ отвечает «вообще», с вводным учитывает профиль в каждом ответе, сам ищет шаблоны и структуру.", render: () => (
    <Pad>
      <Group>
        <Kicker>Один и тот же запрос</Kicker>
        <H tail="что ИИ знает о вас">Один запрос, два ответа. Разница только в том,</H>
        <div className="grid grid-cols-2 gap-[28px] mt-[48px]">
          <Card v={fromLeft} bad>
            <CardTitle icon={Ban}>Без вводного</CardTitle>
            <Chat start={.9} gap={.6} msgs={[{ me: true, text: "Подготовь коммерческое предложение на поставку продуктов" }, { text: "Коммерческое предложение. Уважаемые партнёры! Компания [название] предлагает поставку продуктов питания высокого качества по конкурентным ценам. Мы гарантируем индивидуальный подход… [Цены] [Условия] [Контакты]" }]} />
            <CardText className="mt-[18px]">Шаблон «для всех»: квадратные скобки, общие слова, ни одной вашей цифры. Так отвечает любой ИИ любому человеку без настроек.</CardText>
          </Card>
          <Card v={fromRight} hi>
            <CardTitle icon={ClipboardList}>С вводным</CardTitle>
            <Chat start={2.3} gap={.6} msgs={[{ me: true, text: "Подготовь коммерческое предложение на поставку продуктов" }, { text: "Собрал КП от сети из трёх ресторанов в Казани по вашему стандарту: таблица «позиция, объём в месяц, цена с НДС отдельно», условия оплаты 50/50, срок ответа. Чего не хватает: ассортимент и объёмы по позициям. Пришлите список, и я заполню таблицу. Три варианта тона в конце." }]} />
            <CardText className="mt-[18px]">Знает, кто вы и как у вас принято, берёт вашу структуру и валюту, спрашивает недостающее вместо выдумки. Настройки профиля учитываются в каждом ответе, не только в этом.</CardText>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 9. Вводное на одну страницу */
  { mood: "quiet", notes: "Главное: компактность. Каждое слово вводного ИИ читает при каждом ответе. Лишнее путает и тратит токены. Поле персонализации ограничено по длине.", render: () => (
    <Pad>
      <Group>
        <Kicker>Что входит во вводное</Kicker>
        <H tail="и помещается в одно поле настроек">Шесть строк, которые читаются перед каждым ответом</H>
        <Two cols="1.15fr 1fr" className="mt-[40px]">
          <div className="grid grid-cols-2 gap-[12px] [&_h3]:text-[22px] [&_h3]:mb-[6px] [&_p]:text-[17px]">
            {[[UserCog, "Кто вы", "«Управляющий сетью из трёх ресторанов в Казани». Имя по желанию."], [Building2, "Компания", "«Холдинг: рестораны, земля под застройку, недвижимость в Дубае». Без цифр, которые нельзя разглашать."], [Globe, "Страна и правила", "«Законы РФ и ОАЭ, рубли и дирхамы, НДС отдельно»."], [PenLine, "Стиль", "«Коротко, на «вы», без восклицаний. Таблица, если данных больше трёх строк»."], [Ban, "Что нельзя", "«Не выдумывай цифры и имена. Не хватает данных — спроси»."], [CheckCircle2, "Хороший результат", "«Письмо на половину экрана. Три варианта на выбор»."]].map(([I, t, d], k) => (
              <Card key={k} v={k % 2 ? fromRight : fromLeft} hi={k === 5} className="p-[16px_20px]"><CardTitle icon={I as LucideIcon}>{t as string}</CardTitle><CardText>{d as string}</CardText></Card>
            ))}
          </div>
          <div className="grid gap-[14px]">
            <Card v={fromRight} className="p-[22px_26px]">
              <CardTitle icon={Scale}>Короче — лучше</CardTitle>
              <CardText className="text-[19px]">Каждое слово вводного ИИ перечитывает перед каждым ответом. Чем больше вводных, тем больше токенов <Term>единица оплаты и объёма текста</Term> и тем легче ему запутаться. Шесть строк, 400–600 знаков: это и помещается в поле настроек, и работает.</CardText>
            </Card>
            <Card v={fromRight} className="p-[22px_26px]">
              <CardTitle icon={Repeat}>Один раз, навсегда</CardTitle>
              <CardText className="text-[19px]">Вводное живёт в настройках аккаунта <Term>ChatGPT: Персонализация, Claude: Profile</Term>. Через десять минут мы впишем его туда одним шагом, и каждый новый чат будет его знать.</CardText>
            </Card>
          </div>
        </Two>
        <Ask>Что вы объясняете каждому новому сотруднику в первый день? Это и есть ваше вводное</Ask>
      </Group>
    </Pad>
  ) },

  /* 10. Раздел: настройки */
  { mood: "section", notes: "Переключиться в браузер с учебным аккаунтом. Возвращаться к слайду после каждой настройки. Названия пунктов меню по состоянию на 18 октября, могут меняться.", render: () => (
    <Section n="Часть вторая, 30 минут живого экрана" title="Семь" tail="настроек" lead="Каждую включаем вместе на учебном аккаунте и возвращаемся к слайду. После седьмой ИИ знает ваш принцип работы." steps={[["Модель", "3 мин"], ["Личные инструкции", "6 мин"], ["Память", "4 мин"], ["Проекты", "4 мин"], ["Гигиена чатов", "2 мин"], ["Где работать", "2 мин"], ["Подписка и ключ API", "4 мин"]]} />
  ) },

  /* 11. Модель */
  { mood: "quiet", notes: "Живой экран: новый чат, меню модели, выбрать думающую. В Claude аналог: выбор модели в том же меню под полем ввода.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 1 из 7 · Модель</Kicker>
        <H tail="а не «Авто»">Выбирайте думающую модель,</H>
        <Two cols="1fr 1.1fr">
          <div className="grid gap-[14px]">
            <Sub>«Авто» сам решает, кому отдать ваш вопрос. Сложный запрос может уйти слабой модели, и вы об этом не узнаете.</Sub>
            <Sub>Думающая <Term>reasoning</Term> модель на несколько секунд медленнее. Зато считает, сверяет и реже выдумывает.</Sub>
            <Sub>Названия моделей меняются каждые пару месяцев. Запомните принцип, а не имя. Переключатель в ChatGPT и в Claude в одном и том же месте: под полем ввода.</Sub>
            <Item className="mt-[6px]"><LogoRow items={[[logoOpenAI, "ChatGPT: меню модели"], [logoClaude, "Claude: меню модели"]]} /></Item>
          </div>
          <Win title="Выбор модели в начале чата" rows={[{ id: "r1", label: "Авто", meta: "сервис выбирает сам", on: true }, { id: "r2", label: "Думающая модель", meta: "рассуждает перед ответом" }, { id: "r3", label: "Быстрая", meta: "короткие ответы" }, { id: "r4", label: "Показать дополнительные модели", meta: "в настройках" }]} steps={[{ sel: "r2", t: 700, on: true, off: true }]} />
        </Two>
      </Group>
    </Pad>
  ) },

  /* 12. Личные инструкции */
  { mood: "quiet", notes: "Живой экран: вставить промпт, ответить на три вопроса вслух, остальное заранее. Показать «до и после» на КП или письме поставщику.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 2 из 7 · Личные инструкции</Kicker>
        <H tail="Вы отвечаете на вопросы">Вводное пишет сам ИИ.</H>
        <Two cols="1fr 1.1fr">
          <div className="grid gap-[14px]">
            <Item className="flex flex-wrap items-center gap-[10px] text-[18px] text-mute">{[[logoOpenAI, "ChatGPT"], ["", "Настройки"], ["", "Персонализация"], ["", "Пользовательские инструкции"]].map(([l, t], k) => <span key={k} className="contents">{k > 0 && <em className="not-italic opacity-60">→</em>}<b className="inline-flex items-center gap-[8px] font-medium text-ink px-[12px] py-[6px] rounded-[9px] bg-white border border-line">{l && <Logo src={l} size={16} />}{t}</b></span>)}</Item>
            <Item className="flex flex-wrap items-center gap-[10px] text-[18px] text-mute">{[[logoClaude, "Claude"], ["", "Settings"], ["", "Profile"], ["", "Preferences"]].map(([l, t], k) => <span key={k} className="contents">{k > 0 && <em className="not-italic opacity-60">→</em>}<b className="inline-flex items-center gap-[8px] font-medium text-ink px-[12px] py-[6px] rounded-[9px] bg-white border border-line">{l && <Logo src={l} size={16} />}{t}</b></span>)}</Item>
            <Sub className="mt-[4px] text-[21px]">Вставляете промпт в обычный чат. Он задаёт десять вопросов, по одному. Итог на 400–600 знаков от первого лица вставляете в поле инструкций. С этой минуты каждый новый чат знает, с кем говорит.</Sub>
            <Prompt v={fromLeft} className="text-[17px] px-[20px] py-[14px]" text="Помоги составить мои личные инструкции для ИИ. Задай мне по одному вопросу: роль, компания, страна и правила, для кого я пишу, стиль ответов, что мне не нужно, как критиковать мои тексты, «ты» или «вы», любимый формат ответа, типовые задачи. Дождись ответа на каждый. Потом собери текст от первого лица на 400–600 знаков, без воды." note="Промпт есть в конспекте после встречи. Переписывать с экрана не нужно." />
          </div>
          <div className="grid gap-[12px]">
            <Shot src={shotInstrForm} h={300} caption="ChatGPT → Настройки → Персонализация → Пользовательские инструкции. Реальный экран, 18 октября 2026" />
            <Shot src={shotClaudeInstr} h={118} caption="Claude → Settings → Account → Instructions for Claude: то же поле, другое название" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 13. Память */
  { mood: "quiet", notes: "Живой экран: Настройки → Персонализация → Память: открыть «Управление памятью», удалить одну строку, показать переключатель «Учитывать историю чатов», открыть временный чат. В Claude: Settings → Memory.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 3 из 7 · Память</Kicker>
        <H tail="вторую нет">У ИИ две памяти. Одну вы видите,</H>
        <Two cols="1.05fr 1fr">
          <div className="grid gap-[12px]">
            <Sub><Strong>Сводка памяти</Strong> <Term>ChatGPT: Персонализация → Память → Управление; Claude: Settings → Memory</Term>. То, что ИИ записал о вас. Можно открыть, прочитать и удалить любую строку.</Sub>
            <Sub><Strong>Включить память</Strong> и <Strong>Учитывать мой стиль письма</Strong> <Term>переключатели там же</Term>. Профиль строится из всех чатов, файлов и подключённых приложений. Посмотреть целиком нельзя, только выключить. Если чаты были про всё подряд, он мешает.</Sub>
            <Sub><Strong>Временный чат</Strong>. Не попадает ни в историю, ни в память. Для разового и чувствительного.</Sub>
            <Item className="mt-[8px] rounded-[12px] px-[18px] py-[14px] border border-warn/40 bg-white text-[18px] leading-[1.4] text-body"><b className="font-semibold text-warn">Сноска.</b> Переписка с ИИ не защищена как тайна переписки. Паспортные данные, договоры с реквизитами и зарплаты в облачный чат не вставляем: обезличиваем («Арендатор А», «объект на улице Б»). Для таких документов есть локальные модели, которые работают на вашем компьютере и ничего не отправляют наружу.</Item>
          </div>
          <div className="grid gap-[12px]">
            <Shot src={shotMemory} h={290} caption="ChatGPT → Настройки → Персонализация: «Включить память», «Сводка памяти → Управление», «Учитывать мой стиль письма». Реальный экран, 18 октября 2026" />
            <Shot src={shotClaudeMemory} h={170} caption="Claude → Settings → Memory: «Search and reference chats», «Generate memory from chats». Те же два переключателя" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 14. Проекты */
  { mood: "quiet", notes: "Живой экран: проводник с папкой «Проекты», внутри подпапки с файлом правил. Открыть один файл правил. В веб-версии показать «Проект» с файлами и инструкцией как простой вариант.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 4 из 7 · Проекты</Kicker>
        <H tail="а не разговор">Проект — это рабочее место: ИИ помнит задачу,</H>
        <Two cols="1fr 1fr">
          <div className="grid gap-[12px]">
            <Sub>В веб-версии <Term>ChatGPT и Claude: «Проекты»</Term> это папка с файлами и инструкцией: любой чат внутри неё видит их без напоминаний. Хватит для писем, отзывов и КП.</Sub>
            <Sub>На компьютере <Term>desktop-приложение, Codex, Claude Code</Term> проект это обычная папка. Заводите одну папку «Проекты», в ней подпапку на каждую тему и в каждой файл правил <Term>AGENTS.md или CLAUDE.md</Term>: что это за задача, как у вас принято, что проверить.</Sub>
            <Sub>Для большой задачи файл правил задаёт этапы: сначала ТЗ, потом дизайн, потом безопасность, потом сборка. На каждом этапе можно звать разную модель: сильную с поиском для ТЗ, модель для кода для сборки.</Sub>
          </div>
          <div className="grid gap-[12px]">
          <div className="grid grid-cols-2 gap-[12px]">
            <Shot src={shotProject} h={128} caption="ChatGPT → Проекты → «Отзывы гостей»: «Чаты» и «Источники»" />
            <Shot src={shotClaudeProjects} h={128} caption="Claude → Projects: материалы, инструкции и чаты в одном месте" />
          </div>
          <Card v={fromRight} className="p-[10px_12px] [&_[data-row]]:py-[6px]">
            <Group delay={.9} className="grid gap-[2px]">
              <TreeRow icon={Folder} name="Проекты" meta="одна папка на всё" />
                            <TreeRow depth={1} icon={FolderOpen} name="отзывы-гостей" />
              <TreeRow depth={2} icon={FileText} name="AGENTS.md" meta="стандарт ответа, компенсации" />
              <TreeRow depth={1} icon={FolderOpen} name="аренда-дубай" />
              <TreeRow depth={2} icon={FileText} name="AGENTS.md" meta="шаблоны писем, английский" />
              <TreeRow depth={1} icon={FolderOpen} name="презентация-участка" />
              <TreeRow depth={2} icon={FileText} name="AGENTS.md" meta="этапы: ТЗ → дизайн → сборка → проверка цифр" hi />
            </Group>
          </Card>
          </div>
        </Two>
        <Ask>Какая задача у вас повторяется каждую неделю? Это ваша первая подпапка</Ask>
      </Group>
    </Pad>
  ) },

  /* 15. Две папки */
  { mood: "quiet", notes: "Живой экран: две пустые папки в проводнике, в «Б» один файл правил. Открыть Codex в каждой, один запрос, запустить. Вернуться к результату через 30 минут.", render: () => (
    <Pad className="pt-[64px]">
      <Group>
        <Kicker className="mb-[14px]">Доказательство: запускаем сейчас, результат через 30 минут</Kicker>
        <H tail="Разница — в одном файле с правилами">Одна задача, две пустые папки.</H>
        <Prompt v={rise} className="mt-[20px] text-[19px] px-[22px] py-[14px]" text="Подготовь HTML-презентацию земельного участка 2,4 га под коттеджный посёлок для инвестора: расположение, коммуникации, экономика, этапы. Данные вымышленные, 8 слайдов." delay={.5} speed={12} />
        <div className="grid grid-cols-2 gap-[28px] mt-[18px] [&_[data-id]]:py-[11px] [&_[data-id]]:text-[19px]">
          <Win v={fromLeft} title="Папка «А»: пустая" rows={[{ id: "a1", label: "Агент читает задачу", meta: "правил нет, берёт свои шаблоны" }, { id: "a2", label: "Через 10 минут: index.html", meta: "8 слайдов, стандартный вид" }]} steps={[{ sel: "a1", t: 3200, on: true }, { sel: "a2", t: 1200, on: true }]} />
          <Win v={fromRight} title="Папка «Б»: внутри мой файл правил" rows={[{ id: "b0", label: "AGENTS.md, одна страница", meta: "мой стиль, структура, что проверить" }, { id: "b1", label: "Агент читает правила, потом задачу", meta: "работает по моим правилам" }, { id: "b2", label: "Через 10 минут: index.html", meta: "мой стиль, моя логика, цифры сверены" }]} steps={[{ sel: "b0", t: 2600, on: true }, { sel: "b1", t: 900, on: true }, { sel: "b2", t: 1200, on: true }]} />
        </div>
        <Sub className="mt-[14px] text-[19px]">Файл правил пишется один раз на тип задачи. Любая папка с ним — ваш настроенный сотрудник.</Sub>
        <Ask className="mt-[10px] text-[19px]">Пока агенты работают: для какой задачи вы написали бы такой файл первым?</Ask>
      </Group>
    </Pad>
  ) },

  /* 16. Гигиена чатов */
  { mood: "quiet", notes: "Показать: новый чат на новую задачу; в проекте итог одного чата передаётся новому коротким резюме. Про токены не углубляться.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 5 из 7 · Гигиена чатов</Kicker>
        <H tail="это не обсуждается">Новая тема — новый чат,</H>
        <div className="grid grid-cols-3 gap-[24px] mt-[48px]">
          <Card v={fromLeft}><CardTitle icon={HelpCircle}>Почему</CardTitle><CardText>При каждом вопросе ИИ перечитывает весь чат <Term>контекст</Term>. Сорок сообщений про аренду, а потом вопрос про меню: он ищет связь, которой нет, и начинает выдумывать. Переполненный контекст — главная причина ложных ответов.</CardText></Card>
          <Card hi><CardTitle icon={Timer}>Задача решена — чат закрыт</CardTitle><CardText>Даже маленькая: прочитать документ, переделать письмо. Сделали, отправили, закрыли. Понадобится снова — найдёте поиском за три секунды. Новая задача всегда с чистого листа.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={GitBranch}>В проекте: итог в новый чат</CardTitle><CardText>Концепт, референсы и споры живут в одном чате. Когда решение принято, попросите короткое резюме и начните новый чат с него. Мусор от отвергнутых идей не поедет дальше.</CardText></Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 17. Где работать */
  { mood: "quiet", notes: "Телефон: быстрые задачи. Веб-версия: документы и глубокая переписка, чаты синхронны с телефоном. Desktop-приложение и Codex: большие задачи, агенты, скрипты. Показать свой телефон или скриншот приложения.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 6 из 7 · Где работать</Kicker>
        <H tail="Аккаунт один, чаты общие">Три окна под разные задачи.</H>
        <div className="grid grid-cols-3 gap-[24px] mt-[48px]">
          <Card v={fromLeft}><CardTitle icon={Smartphone}>Приложение на телефоне</CardTitle><Bullets items={["Быстрые задачи: ответить на отзыв, перевести, разобрать фото документа", "Голосом по дороге", "Все чаты из браузера уже здесь"]} /><CardText className="mt-[16px]">Вводное и проекты работают и тут, поэтому ответы сразу «ваши».</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "ChatGPT"], [logoClaude, "Claude"]]} /></Item></Card>
          <Card hi><CardTitle icon={Monitor}>Веб-версия в браузере</CardTitle><Bullets items={["Документы, таблицы, длинная переписка", "Все настройки, проекты и файлы", "Редактор текста рядом с чатом"]} /><CardText className="mt-[16px]">Основное окно сегодняшней встречи. Новые функции появляются здесь первыми.</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "chatgpt.com"], [logoClaude, "claude.ai"]]} /></Item></Card>
          <Card v={fromRight}><CardTitle icon={Laptop}>Desktop-приложение</CardTitle><Bullets items={["Видит ваши папки и окна, когда вы разрешите", "Здесь живут агенты: Codex, Claude Code", "Большие задачи: разработка, скрипты, автоматизация"]} /><CardText className="mt-[16px]">Отсюда один шаг до собственного агента.</CardText><Item className="mt-[14px]"><LogoRow items={[[logoOpenAI, "Codex"], [logoClaude, "Claude Code"]]} /></Item></Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 18. Подписка и ключ API */
  { mood: "quiet", notes: "Цены и названия тарифов не называть. Что такое API вообще: у 1С и Контур.Диадока тоже есть API. Показать страницу ключей на учебном аккаунте, ключ не раскрывать.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 7 из 7 · Подписка и ключ API</Kicker>
        <H tail="ключ — для программ">Подписка — доступ для человека,</H>
        <div className="grid grid-cols-2 gap-[28px] mt-[48px]">
          <Card v={fromLeft} hi><CardTitle icon={CreditCard}>Подписка</CardTitle><CardText className="text-[19px]">Фиксированная сумма в месяц. Вы сами работаете в чате, приложении и проектах: один аккаунт, один человек. Некоторые агенты <Term>Codex, Claude Code</Term> тоже умеют работать по вашей подписке.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={KeyRound}>Ключ API</CardTitle><CardText className="text-[19px]">API <Term>программный интерфейс</Term> есть у большинства сервисов вокруг вас: 1С, Контур.Диадок, банк. Это вход для программ, а не для людей. Ключ API к ИИ — длинная строка, которую вставляют в скрипт или агента, чтобы программа сама отправляла запросы модели. Оплата за объём текста <Term>токены</Term>.</CardText></Card>
        </div>
        <Two cols="1fr 1fr" className="mt-[24px] items-center">
          <Sub className="text-[21px]">Где взять: в кабинете разработчика <Term>platform.openai.com → API keys; console.anthropic.com → API Keys</Term>. Ключ показывается один раз, пересылать его нельзя: кто знает ключ, тот тратит ваши деньги.</Sub>
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

  /* 19. Обсуждение 2 */
  { mood: "quiet", notes: "Вторая пауза после настроек. Спросить, что удивило, что уже включили на своём телефоне прямо сейчас.", render: () => (
    <Discuss q="Какая из семи настроек удивила? Что вы включите на своём аккаунте сегодня вечером первым делом?" notes="Можно прямо сейчас, с телефона: настройки, персонализация." hints={["Думающая модель вместо «Авто»", "Вводное: кто вы и как у вас принято", "Память: посмотреть, что он уже о вас записал", "Новый чат на новую задачу"]} />
  ) },

  /* 20. Раздел: способы */
  { mood: "section", notes: "Быстро показать, как решаются типовые задачи. Домашнее задание: записать свою задачу одной строкой; на следующем занятии разберём и подготовим под неё инструмент.", render: () => (
    <Section n="Часть третья, 25 минут" title="Пять способов" tail="решать задачи" lead="Быстро покажу, как решается типовое. Ваша работа на сегодня: записать свою задачу одной строкой. К следующему занятию подготовим помощника, который превратит вашу строку в техническое задание, и разберём их вместе." steps={[["Быстрый диалог с телефона", "4 мин"], ["Инструкция плюс документ", "5 мин"], ["Поиск и доступ к данным", "4 мин"], ["Разово считает, регулярно — делает инструмент", "5 мин"], ["ИИ спрашивает первым", "3 мин"]]} />
  ) },

  /* 21. А */
  { mood: "quiet", notes: "Зеркало телефона или ролик 40 секунд. Письмо арендатору — готовым результатом.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ А · Быстрый диалог с телефона</Kicker>
        <H tail="Две минуты, по дороге">Отзыв гостя и письмо арендатору.</H>
        <Two cols="1fr 400px" className="items-start gap-[70px]">
          <div className="grid gap-[14px]">
            <Sub>Фото отзыва или голос вместо текста. Вводное и проект уже знают, кто вы и как у вас принято.</Sub>
            <Sub><Strong>Проверка.</Strong> Нет обещаний, которых нет в правилах. Даты и суммы совпадают с вашими. Одна просьба в конце.</Sub>
            <Sub>Второй пример в конспекте: «Напиши арендатору на английском: договор до 30 ноября, предлагаем продление на год на тех же условиях, ответ до 15 ноября».</Sub>
          </div>
          <Phone className="w-[380px]">
            <Chat compact start={1.2} gap={.8} msgs={[{ me: true, text: "📷 скриншот отзыва" }, { me: true, text: "Отзыв на 3 звезды: вкусно, но счёт ждали 25 минут. Ответь от управляющего, коротко, по нашим правилам" }, { text: "Марина, спасибо за честный отзыв и за «вкусно». Счёт за 25 минут — наша ошибка, разобрали со сменой. Приходите в будни: десерт за наш счёт, скажите администратору «отзыв от 17 октября». Ильдар, управляющий." }, { me: true, text: "Отправляю 👍" }]} />
          </Phone>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 22. Б */
  { mood: "quiet", notes: "Живой экран: вымышленное КП, одно слово «разбери». Показать «не указано». Вторая половина: «подготовь» по той же инструкции.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Б · Инструкция плюс документ</Kicker>
        <H tail="и готовится так же">Коммерческое предложение разбирается одним словом</H>
        <Two cols="1fr 1.15fr">
          <div className="grid gap-[14px]">
            <Prompt text="Разбери приложенное коммерческое предложение. Сначала таблица: позиция, цена, срок, условия оплаты, гарантия. Потом три главных риска для нас как заказчика и три вопроса поставщику. В конце одна рекомендация: брать, торговаться или отказаться. Если данных нет, пиши «не указано», не додумывай." delay={.6} speed={12} note="Инструкция лежит в проекте «Закупки». Та же инструкция наоборот готовит наше КП: «подготовь по стандарту»." />
            <Sub className="text-[20px]">Инструкция пишется один раз. Дальше любой документ разбирается словом «разбери», а своё КП готовится словом «подготовь».</Sub>
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

  /* 23. В */
  { mood: "quiet", notes: "Реальных контрагентов в эфире не проверяем. Суть: правильно сформулированный запрос и честность про доступ: открытые источники, авторизация, ключ API или свой бот.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ В · Поиск и доступ к данным</Kicker>
        <H tail="или как дать ему доступ">Как попросить ИИ найти данные</H>
        <div className="grid grid-cols-3 gap-[24px] mt-[48px]">
          <Card v={fromLeft}><CardTitle icon={Search}>Открытые источники</CardTitle><Bullets items={["Назвать тип источников: официальные сайты, реестры, профильные издания", "Период цифрами: «сентябрь–октябрь 2026», а не «недавно»", "Ссылка и дата на каждое утверждение. Нет ссылки — нет факта"]} /></Card>
          <Card hi><CardTitle icon={Lock}>Закрытые сайты</CardTitle><Bullets items={["Если данные видны только после входа, ИИ их не получит без вас", <>Три пути: вы входите сами и даёте файл; у сервиса есть ключ API; свой бот <Term>агент</Term>, который заходит по вашим правам</>, "Про защиту не забываем: доступ только на чтение, только к нужному"]} /></Card>
          <Card v={fromRight}><CardTitle icon={ShieldCheck}>Проверка</CardTitle><Bullets items={["Открыть две ссылки и прочитать своими глазами", "Дата документа совпадает с тем, что написал ИИ", <>Глубокое исследование <Term>deep research</Term>: отчёт с цитатами за 10–30 минут, формат задать заранее</>]} /></Card>
        </div>
        <Prompt v={rise} className="mt-[28px] text-[20px]" text="Какие требования к вентиляции кухни ресторана действуют в России в 2026 году? Только официальные источники. Для каждого утверждения — дата документа и ссылка." delay={1.2} speed={12} />
      </Group>
    </Pad>
  ) },

  /* 24. Г */
  { mood: "quiet", notes: "Главная мысль колоды: ИИ гибкий. Разовую задачу решает сам, повторяющуюся превращает в инструмент. Кейс таск-менеджера рассказать своими словами, скриншоты добавить, когда будут.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Г · Разово или регулярно</Kicker>
        <H tail="Регулярно — делает инструмент">Разово ИИ считает сам.</H>
        <Two cols="1fr 1fr" className="mt-[32px] [&_h3]:text-[22px] [&_h3]:mb-[6px]">
          <div className="grid gap-[10px]">
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={BarChart3}>Разовая задача</CardTitle><CardText className="text-[17px]">Таблица на 18 строк: «какая точка просела и на сколько, сначала назови формулу». ИИ прочитает, посчитает и объяснит. Одну цифру сверьте руками.</CardText></Card>
            <Card v={fromLeft} hi className="p-[16px_22px]"><CardTitle icon={Wrench}>Повторяющаяся задача</CardTitle><CardText className="text-[17px]">Выгрузка из iiko на тысячи строк каждый понедельник. Просим не «разбери документ», а «сделай инструмент, который разбирает такие документы»: скрипт, маленькое приложение или агента. Дальше работает инструмент, а не вы.</CardText></Card>
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={ClipboardList}>С чего начинается инструмент</CardTitle><CardText className="text-[17px]">С подробного ТЗ <Term>техническое задание</Term> и схемы: что на входе, что на выходе, кто пользуется, что нельзя. ТЗ тоже пишет ИИ, вы отвечаете на вопросы.</CardText></Card>
          </div>
          <Card v={fromRight} className="p-[24px_26px]">
            <CardTitle icon={Sparkles}>Кейс: свой таск-менеджер за неделю</CardTitle>
            <CardText className="text-[19px]">Запрос руководства: внутренний закрытый таск-менеджер, работает только с наших адресов <Term>белые списки</Term>. ИИ написал ТЗ по ответам на вопросы, затем собрал приложение и разместил на домене компании. Неделя вместо месяцев подрядчика.</CardText>
            <div className="grid grid-cols-3 gap-[10px] mt-[18px]">
              {[["1", "ТЗ и схема", "вопросы → документ"], ["2", "Сборка", "агент пишет код по ТЗ"], ["3", "Запуск", "домен компании, доступ по списку"]].map(([n, t, d]) => <div key={n} className="rounded-[10px] px-[14px] py-[12px] bg-paper border border-line"><small className="block text-[14px] text-blue tabular-nums">0{n}</small><b className="block text-[18px] text-ink font-medium mt-[4px]">{t}</b><span className="text-[15px] text-mute">{d}</span></div>)}
            </div>
            <CardText className="mt-[16px] text-[16px] text-mute">Скриншоты интерфейса добавим в конспект.</CardText>
          </Card>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 25. Д */
  { mood: "quiet", notes: "Взять задачу из зала или пример с арендой виллы. Пять вопросов, не больше.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Д · ИИ спрашивает первым</Kicker>
        <H tail="«задай мне вопросы»">Одна фраза заменяет идеальный промпт:</H>
        <Two cols="1fr 1fr" className="mt-[44px] gap-[50px]">
          <Prompt text="Мне нужно объявление об аренде виллы в Дубае на английском. Задай мне 10–15 вопросов, чтобы собрать всё для этой задачи. По одному, дожидайся ответа. Не принимай расплывчатые ответы, уточняй. Когда вопросы закончатся, скажи «готов»." delay={.5} speed={12} note="Потом: «Теперь у тебя есть всё. Сделай задачу. Конкретно, без воды»." />
          <Chat start={3.4} gap={.6} msgs={[{ text: "1. Район и тип виллы: сколько спален, есть ли бассейн и вид?" }, { me: true, text: "Palm Jumeirah, 4 спальни, бассейн, вид на море" }, { text: "2. Срок аренды и цена: годовой контракт или помесячно, сколько чеков?" }, { me: true, text: "Год, 2 чека" }, { text: "3. Для кого объявление: семьи, экспаты-арендаторы, агенты? От этого зависит тон." }]} />
        </Two>
      </Group>
    </Pad>
  ) },

  /* 26. Обсуждение 3 */
  { mood: "quiet", notes: "Третья пауза. Каждый называет задачу, которую записал. Это домашнее задание: одна строка в чат курса.", render: () => (
    <Discuss q="Какую задачу вы записали? Одна строка: что на входе, что должно получиться на выходе." notes="Это и есть домашнее задание. Строку в чат курса сегодня, разбор на следующем занятии." hints={["«Каждый понедельник выгрузка из iiko → сводка по точкам руководству»", "«Отзыв гостя → ответ управляющего по нашим правилам»", "«Договор аренды → реестр сроков и сумм в таблице»", "«КП поставщика → таблица, риски, рекомендация»"]} />
  ) },

  /* 27. Где живёт агент */
  { mood: "quiet", notes: "Агент работает по заранее описанному сценарию и должен где-то жить: арендованный сервер или всегда включённый компьютер. Показать обезличенную переписку с домашним агентом.", render: () => (
    <Pad>
      <Group>
        <Kicker>Что такое агент на самом деле</Kicker>
        <H tail="и где-то живёт">Агент работает по сценарию</H>
        <Two cols="1fr 400px" className="items-start gap-[60px] mt-[32px] [&_h3]:text-[22px] [&_h3]:mb-[6px]">
          <div className="grid gap-[10px]">
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={ClipboardList}>Сценарий, а не магия</CardTitle><CardText className="text-[17px]">Агент — это модель плюс доступ к папкам и программам плюс заранее описанный сценарий: что делать, в каком порядке, что проверить, кому отчитаться. Сценарий пишется один раз и правится словами.</CardText></Card>
            <Card v={fromLeft} hi className="p-[16px_22px]"><CardTitle icon={Server}>Где он живёт</CardTitle><CardText className="text-[17px]">Вечно живущих ИИ «в воздухе» не бывает. Чтобы агент работал без вас, ему нужен постоянно включённый компьютер или арендованный сервер. Пульт к нему — Telegram, память и история — репозиторий на GitHub.</CardText></Card>
            <Card v={fromLeft} className="p-[16px_22px]"><CardTitle icon={ShieldCheck}>Условие</CardTitle><CardText className="text-[17px]">Каждый результат проверяет человек. Агент пишет, что сделал и что не смог. Доступ только к папке проекта, снаружи он ничего не видит.</CardText></Card>
          </div>
          <Phone className="w-[380px]">
            <Chat compact start={1.2} gap={.9} msgs={[{ me: true, text: "Собери реестр договоров аренды из папки «Дубай», срок окончания до конца года, в xlsx" }, { text: "Принял. 37 файлов в папке, читаю…" }, { text: "Готово: 9 договоров заканчиваются до 31 декабря. Два файла не прочитались, они в списке отдельно." }, { text: "реестр-аренда-дубай.xlsx · 11 строк", file: true }, { me: true, text: "Отлично. В пятницу повтори" }]} />
          </Phone>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 28. GitHub и правильные слова */
  { mood: "quiet", notes: "Показать репозиторий этой презентации на GitHub и страницу Pages: сайт без сервера. Термины произносить правильно, чтобы участники потом могли гуглить.", render: () => (
    <Pad>
      <Group>
        <Kicker>Правильные слова</Kicker>
        <H tail="лежит на GitHub">Эта презентация — сайт без сервера. Она</H>
        <Two cols="1.1fr 1fr" className="items-start">
          <div className="grid gap-[12px]">
            <Sub className="text-[21px]"><Strong>Репозиторий</Strong> <Term>repository</Term>: папка проекта с историей всех изменений. Что сделал агент, когда и зачем, видно по шагам, любое изменение можно откатить.</Sub>
            <Sub className="text-[21px]"><Strong>GitHub</Strong>: сервис, где репозитории хранятся и публикуются. Эта колода собрана агентом и опубликована через GitHub Pages: без сервера и без хостинга, адрес открывается у всех.</Sub>
            <Sub className="text-[21px]"><Strong>Skills</Strong> <Term>навыки</Term>: сохранённые процедуры для агента: «делаю пять раз в неделю, значит навык». Лежат в той же папке проекта, подключаются одной строкой.</Sub>
            <Item className="mt-[6px]"><LogoRow items={[[logoGithub, "github.com/Zakrasava/ai-training-deck"], [logoGithub, "GitHub Pages"]]} /></Item>
          </div>
          <div className="grid gap-[12px]">
            <Shot src={shotGithub} caption="Репозиторий этой презентации: файлы, история изменений, 18 октября 2026" />
            <Shot src={shotPages} caption="Опубликованная страница: открывается по адресу у любого участника" />
          </div>
        </Two>
      </Group>
    </Pad>
  ) },

  /* 29. Глоссарий */
  { mood: "quiet", notes: "Не зачитывать. Спросить, какое слово непонятно прямо сейчас. Произносить термины правильно, чтобы потом гуглилось.", render: () => (
    <Pad>
      <Group>
        <Kicker>Словарь</Kicker>
        <H tail="до собственного агента">Двенадцать слов, которых хватит</H>
        <div className="grid grid-cols-4 gap-[14px_18px] mt-[44px]">
          {[["Модель", "«Мозг» сервиса. Думающая (reasoning) считает дольше и точнее."], ["Контекст", "Всё, что модель видит сейчас: чат, файлы, инструкции."], ["Токен", "Единица счёта текста, три‑четыре символа. За них платят по ключу API."], ["Инструкции", "Правила, которые читаются перед каждым ответом: личные и проектные."], ["Проект", "Папка с файлами, правилами и памятью. Рабочее место."], ["Память", "Факты о вас между чатами: сохранённые воспоминания и история чатов."], ["Агент", "Модель плюс доступ к папкам и программам плюс сценарий. Делает шаги сам."], ["Файл правил", "AGENTS.md, CLAUDE.md: что за задача и как у вас принято. Агент читает первым."], ["Ключ API", "Строка для доступа программы к модели. Показывается один раз."], ["Репозиторий", "Папка проекта с историей изменений. Хранится на GitHub."], ["Skills", "Сохранённые процедуры агента: «делаю пять раз в неделю, значит навык»."], ["Локальная модель", "ИИ, который работает на вашем компьютере и ничего не отправляет наружу."]].map(([b, s], k) => (
            <Item key={k} v={pop} className="rounded-[12px] px-[22px] py-[18px] panel"><b className="block text-[23px] font-medium mb-[6px] text-ink">{b}</b><span className="text-[17px] text-body leading-[1.35]">{s}</span></Item>
          ))}
        </div>
      </Group>
    </Pad>
  ) },

  /* 30. Настройте личный аккаунт */
  { mood: "quiet", notes: "Три шага на сегодня. Не говорить «компания»: у кого-то ресторан, у кого-то ИП. Конспект с промптами придёт вечером.", render: () => (
    <Pad>
      <Group>
        <Kicker>Что сделать сегодня</Kicker>
        <H tail="знает ваш принцип работы">Три шага, после которых ИИ</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[56px]">
          <Card v={fromLeft}><CardTitle icon={Wallet}>Аккаунт и модель</CardTitle><CardText>По инструкции из конспекта. Думающая модель по умолчанию. Не получается — пишите в чат курса, разберём.</CardText></Card>
          <Card hi><CardTitle icon={PenLine}>Вводное</CardTitle><CardText>Пройти промпт‑интервью из конспекта, вставить результат в личные инструкции. Задать один рабочий вопрос и сравнить с тем, что было.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={FolderOpen}>Один проект</CardTitle><CardText>На самую частую задачу. Два‑три файла без персональных данных и короткая инструкция. Это будущее рабочее место вашего агента.</CardText></Card>
        </div>
        <Sub className="mt-[40px]">Конспект с промптами и словарём придёт в чат курса сегодня вечером. Туда же одной строкой — ваша задача из обсуждения.</Sub>
      </Group>
    </Pad>
  ) },

  /* 31. Финал */
  { mood: "hero", notes: "Резерв 8 минут. Если вопросов нет, показать обезличенное поручение домашнему агенту и готовый файл. Собрать строки с задачами в чат курса.", render: () => (
    <Pad className="grid place-items-center text-center">
      <Group delay={.3}>
        <motion.h2 variants={rise} className="text-[150px] font-semibold tracking-[-.05em] leading-[1] text-ink">Вопросы</motion.h2>
        <Sub className="mt-[24px] text-[30px] max-w-[1100px]">И одна строка в чат курса: какую задачу вы хотите поручить ИИ первой. С неё начнём следующую встречу.</Sub>
      </Group>
    </Pad>
  ) },
];
