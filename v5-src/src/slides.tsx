import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Group, Item, Kicker, H, Sub, Strong, Card, CardTitle, CardText, Bullets, Ask, Win, Chat, Phone, Prompt, Counter, Bars, Chips, Bleed, rise, fromLeft, fromRight, fromDeep, pop } from "@/deck/primitives";
import { Cubes } from "@/fx/Cubes";
import { NeuroBack } from "@/fx/Shaders";
import { SilkBack, ThreadsBack, DotGridBack, LaserBack } from "@/fx/Bits";
import { MessageCircle, HelpCircle, BookOpen, Users, FileText, Smartphone, Monitor, Laptop, KeyRound, CreditCard, UserCog, AlertTriangle, ListChecks, Ban, ClipboardList, Building2, Globe, PenLine, CheckCircle2, GitBranch, Timer, Search, Layers, ShieldCheck, BarChart3, Wallet, FolderOpen } from "lucide-react";
import { LiquidSculpture } from "@/sculpture/LiquidSculpture";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";

export type Slide = { mood: "hero" | "section" | "quiet"; notes: string; render: () => ReactNode };

const Pad = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={"absolute inset-0 px-[110px] pt-[88px] pb-[96px] " + className}>{children}</div>
);
const Shade = () => <Bleed style={{ background: "linear-gradient(90deg, rgba(5,7,11,.78), rgba(5,7,11,.35) 50%, rgba(5,7,11,.05))" }} />;
const Section = ({ n, title, tail, lead, cube, children, rot = .35 }: { n: string; title: string; tail: string; lead?: string; cube: string; children?: ReactNode; rot?: number }) => (
  <>
    <Bleed className="opacity-70"><SilkBack rotation={rot} /></Bleed>
    <Shade />
    <Cubes spec={[{ x: -8.8, y: 4, z: -7, size: 2.6, ry: .9, far: true }, { x: -6.5, y: -4.6, z: -9, size: 2, ry: .3, far: true }, { x: 9.6, y: -4.2, z: -8, size: 2.4, ry: -.6, far: true }, { text: cube, x: 4.8, y: .3, size: 4.4, ry: -.3, rx: -.22, big: true }]} />
    <Pad className="grid grid-cols-2 items-center">
      <Group delay={1.1}>
        <Kicker>{n}</Kicker>
        <H size={92}>{title}<span className="tail"> {tail}</span></H>
        {lead && <Sub className="mt-[24px] max-w-[640px] text-[28px] text-fog">{lead}</Sub>}
        {children}
      </Group>
    </Pad>
  </>
);

export const slides: Slide[] = [
  /* 1. Титул */
  { mood: "hero", notes: "Пауза 20–30 секунд, пока подключаются. Поводить мышью по скульптуре: она растекается и собирается обратно. Ничего не читать вслух.", render: () => (
    <>
      <Bleed style={{ background: "radial-gradient(60% 60% at 50% 45%, rgba(13,28,68,.55), rgba(5,7,11,0) 70%)" }} />
      <LiquidSculpture band={{ top: 30, bottom: 600 }} scale={1.0} />
      <div className="absolute left-[110px] right-[110px] bottom-[84px] grid items-end gap-[60px] pointer-events-none" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: .62 }} transition={{ delay: 1.2, duration: .8 }} className="flex items-center gap-[12px] text-[13px] tracking-[.12em] uppercase mb-[18px]"><i className="w-[28px] h-[1px] bg-current opacity-70" />Корпоративное обучение · три встречи</motion.p>
          <h1 className="font-medium tracking-[-.045em] leading-[.92] text-[112px]">
            {["ИИ как новый", "сотрудник"].map((w, k) => (
              <motion.span key={k} initial={{ opacity: 0, y: 40, filter: "blur(14px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: .6 + k * .2, duration: .9, ease: [.22, .61, .2, 1] }} className={"block " + (k === 1 ? "font-extralight italic text-ice" : "")}>{w}</motion.span>
            ))}
          </h1>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: .8 }} className="justify-self-end max-w-[400px] pb-[10px]">
          <p className="text-[19px] leading-[1.5] text-fog">От первого вопроса до собственного агента. Ничего писать не придётся: всё уже написано, мы научимся это включать.</p>
          <p className="mt-[22px] flex items-center gap-[10px] text-[11px] tracking-[.14em] uppercase opacity-50"><i className="w-[6px] h-[6px] rounded-full bg-current animate-pulse" />Проведите по форме</p>
        </motion.div>
      </div>
    </>
  ) },

  /* 2. Обещание */
  { mood: "section", notes: "Главная мысль курса. Кубы — четыре ступени: чат, проект, агент, ваш агент.", render: () => (
    <>
      <Bleed className="opacity-70"><SilkBack rotation={-.4} speed={2.4} /></Bleed>
      <Bleed style={{ background: "linear-gradient(0deg, rgba(5,7,11,.85), rgba(5,7,11,.3) 45%, rgba(5,7,11,0))" }} />
      <Cubes spec={[
        { text: "Чат", x: -5.6, y: 1.2, size: 1.9, ry: .22, rx: -.18 }, { text: "Проект", x: -1.9, y: 1.4, size: 1.9, ry: .08, rx: -.18 },
        { text: "Агент", x: 1.9, y: 1.6, size: 1.9, ry: -.08, rx: -.18 }, { text: "Ваш", x: 5.6, y: 1.9, size: 2.3, ry: -.22, rx: -.18, big: true },
        { x: -9.5, y: 4.2, z: -6, size: 2.6, ry: .8, far: true }, { x: 9.8, y: -3.8, z: -7, size: 3, ry: -.7, far: true }, { x: -8.6, y: -4.4, z: -9, size: 2.2, ry: .4, far: true }]} />
      <div className="absolute left-[110px] right-[110px] bottom-[110px]">
        <Group delay={1.4}>
          <Kicker>Чем закончится курс</Kicker>
          <motion.h2 variants={rise} className="text-[54px] font-extralight tracking-[-.02em] leading-[1.1] max-w-[1200px]">Через три встречи у каждого из вас будет <b className="font-medium grad">собственный ИИ‑агент</b>, который берёт на себя вашу рутину. <span className="text-sky">Писать код не придётся: всё уже написано. Мы научимся это включать.</span></motion.h2>
        </Group>
      </div>
    </>
  ) },

  /* 3. Правило ноль */
  { mood: "quiet", notes: "Главная мысль по словам Кирилла: не бояться. Показать свой чат «Объясни мне» или завести его в эфире за 30 секунд.", render: () => (
    <>
    <Bleed className="opacity-45"><ThreadsBack /></Bleed>
    <Pad>
      <Group>
        <Kicker>Правило номер ноль</Kicker>
        <H tail="Понимание приходит в процессе">Не бойтесь с ним разговаривать.</H>
        <div className="grid mt-[24px] gap-[50px] items-start" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
          <div className="grid gap-[10px] [&_h3]:text-[24px] [&_h3]:mb-[6px] [&_p]:text-[19px]">
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={MessageCircle}>Говорите как с человеком</CardTitle><CardText>Не ищите «правильный промпт». Опишите ситуацию словами, как коллеге: что случилось, что нужно, к какому сроку. Переспросите, если непонятно. Это нормально.</CardText></Card>
            <Card v={fromLeft} className="p-[18px_22px]"><CardTitle icon={HelpCircle}>Глупых вопросов нет</CardTitle><CardText>«Что такое токен?», «Почему ты так ответил?», «Объясни проще». ИИ не устанет и не осудит. Половина из вас написала в опроснике «нет времени разбираться». Разбираться не нужно, нужно спрашивать.</CardText></Card>
            <Card v={fromLeft} hi className="p-[18px_22px]"><CardTitle icon={BookOpen}>Заведите чат «Объясни мне»</CardTitle><CardText>Отдельный чат для всего непонятного: термин из письма, кнопка в программе, фраза из этой презентации. Через месяц это ваш личный учебник.</CardText></Card>
          </div>
          <Phone className="w-[420px] self-start">
            <Chat start={1.1} gap={.8} className="[&>div]:text-[17px] [&>div]:px-[14px] [&>div]:py-[10px]" msgs={[
              { me: true, text: "Слушай, а что значит «контекст»? Мне сказали, что у тебя он большой" },
              { text: "Контекст — это всё, что я вижу прямо сейчас: наш разговор, файлы, которые вы прикрепили, и ваши инструкции. Чем он чище и точнее, тем лучше ответ. Показать на примере вашего письма?" },
              { me: true, text: "Давай. И объясняй мне так всегда, без умных слов" },
              { text: "Запомнил: объяснять просто, без жаргона." }]} />
          </Phone>
        </div>
      </Group>
    </Pad>
    </>
  ) },

  /* 4. Кто ведёт */
  { mood: "quiet", notes: "Один обезличенный скриншот рабочего экрана, 20 секунд. Назвать холдинг: рестораны, земля, Дубай.", render: () => (
    <Pad>
      <Group>
        <Kicker>Откуда это всё</Kicker>
        <H tail="два агента, и этот курс собрали они">У меня нет ассистента. У меня</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[64px]">
          <Card v={fromLeft}><CardTitle icon={Users}>Один пишет, второй спорит</CardTitle><CardText>Первый агент делает работу: тексты, таблицы, код. Второй проверяет и возвращает с замечаниями. Я ставлю задачу и принимаю результат. Презентация, которую вы видите, собрана так.</CardText></Card>
          <Card><CardTitle icon={FileText}>Правила вместо повторений</CardTitle><CardText>В каждом проекте лежит файл с правилами и паспорт задачи. Агент читает их первым. Поэтому мне не нужно объяснять одно и то же каждое утро. Этому научимся на встрече 2.</CardText></Card>
          <Card v={fromRight} hi><CardTitle icon={Smartphone}>Пульт в телефоне</CardTitle><CardText>Пишу в Telegram «собери отчёт по выручке за неделю», домашний компьютер делает и присылает файл. Это встреча 3, и это умеет не программист, а тот, кто правильно настроил.</CardText></Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 5. Опросник */
  { mood: "quiet", notes: "Данные опросника агрегированы, имён нет. Спросить: у кого iiko или r_keeper, у кого 1С.", render: () => (
    <Pad>
      <Group>
        <Kicker>Что вы написали в опроснике · 23 ответа, без имён</Kicker>
        <H tail="время и формулировки">Вы уже пользуетесь ИИ. Мешают не технологии, а</H>
        <div className="grid mt-[30px] gap-[28px] items-start" style={{ gridTemplateColumns: "1fr 1fr 1.2fr" }}>
          <div className="grid gap-[16px]">
            <Card v={fromLeft} className="p-[22px_24px]">
              <CardTitle icon={UserCog}>Кто вы</CardTitle>
              <div className="grid grid-cols-2 gap-[10px]">
                <div><div className="text-[56px] leading-[.95]"><Counter to={15} /></div><CardText className="text-[18px] mt-[6px]">пользуются каждый день или несколько раз в неделю</CardText></div>
                <div><div className="text-[56px] leading-[.95]"><Counter to={12} delay={.7} /></div><CardText className="text-[18px] mt-[6px]">работают только с телефона</CardText></div>
              </div>
              <CardText className="mt-[10px] text-[19px]">ChatGPT у большинства, у шести ещё Claude. Платный аккаунт у девяти, бесплатный у семи, у троих нет.</CardText>
            </Card>
            <Ask className="mt-0 text-[19px]">У кого iiko, r_keeper или 1С? Напишите в чат: на встрече 2 возьмём вашу выгрузку</Ask>
          </div>
          <Card className="p-[22px_24px]">
            <CardTitle icon={AlertTriangle}>Что мешает</CardTitle>
            <Bars height={130} className="my-[30px] mb-[44px] mx-[6px]" data={[{ v: 100, val: "11", label: "время" }, { v: 55, val: "6", label: "слова" }, { v: 27, val: "3", label: "доступ", dim: true }, { v: 9, val: "1", label: "данные", dim: true }]} />
            <CardText className="text-[19px]">Про память ИИ впервые слышат пятеро, про своих ассистентов — восемь. Агентов пробовали двое. На вопрос «что такое агент» самый частый ответ: «хочу разобраться».</CardText>
          </Card>
          <Card v={fromRight} hi className="p-[22px_24px]">
            <CardTitle icon={ListChecks}>Что хотите поручить</CardTitle>
            <Bullets items={["Сводки выручки, отчёты руководству, сведение данных из нескольких юрлиц", "Презентации: участки для инвесторов, меню, объекты по шаблону", "Ответы на отзывы и сообщения гостей по скриптам", "Письма поставщикам, разбор коммерческих предложений и цен", "ТТК, себестоимость, подбор рецептур под фуд-кост", "Договоры, бизнес-план и финмодель участка, поиск персонала"]} />
            <CardText className="mt-[12px] text-[19px]">Всё это будет в курсе. Сегодня: отзывы, КП, выручка. Презентация участка соберётся через час на ваших глазах.</CardText>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 6. Три встречи */
  { mood: "quiet", notes: "Подчеркнуть строку «сможете сами». Это обещание курса.", render: () => (
    <Pad>
      <Group>
        <Kicker>Программа</Kicker>
        <H tail="Каждая заканчивается тем, что вы можете сделать сами">Три встречи — три уровня доверия.</H>
        <div className="grid grid-cols-3 gap-[24px] mt-[64px]">
          {[
            ["Встреча 1 · Стажёр получает досье", "Семь настроек, после которых ИИ знает вашу компанию. Пять способов решать задачи холдинга с телефона и из браузера.", "Сможете сами: настроить аккаунт и получать ответы, которые можно отправлять.", true],
            ["Встреча 2 · Стажёр получает рабочее место", "Проект и ассистент для вашего отдела, повторяемые процедуры, таблицы и отчёты. Подключение почты и календаря. Что такое папка проекта, права и ключ.", "Сможете сами: собрать ассистента с базой знаний, которым пользуются коллеги.", false],
            ["Встреча 3 · Стажёр получает инструменты", "Агент на вашем компьютере разбирает файлы и собирает маленькое приложение по ТЗ, которое вы надиктовали. Готовые агенты по расписанию и из Telegram.", "Сможете сами: поручить агенту задачу, проверить и запустить по расписанию.", false],
          ].map(([t, p, s, now], k) => (
            <Item key={k} v={k === 0 ? fromLeft : k === 2 ? fromRight : rise} className="relative pt-[26px]">
              <i className={"absolute left-0 top-0 w-[14px] h-[14px] rounded-full " + (now ? "bg-white" : "bg-sky")} style={{ boxShadow: "0 0 18px rgba(108,203,255,.9)" }} />
              <h3 className="text-[30px] font-normal mb-[10px]">{t as string}</h3>
              <p className="text-[21px] text-fog font-light">{p as string}</p>
              <p className="text-[21px] text-ice font-light mt-[14px]"><b className="font-medium grad">Сможете сами:</b>{(s as string).replace("Сможете сами:", "")}</p>
            </Item>
          ))}
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .4, duration: 1.4, ease: [.22, .61, .2, 1] }} className="origin-left h-[2px] mt-[64px]" style={{ background: "linear-gradient(90deg, rgba(47,99,245,.15), rgba(108,203,255,.95))", boxShadow: "0 0 14px rgba(108,203,255,.6)" }} />
      </Group>
    </Pad>
  ) },

  /* 7. Раздел */
  { mood: "section", notes: "", render: () => <Section rot={.2} n="Часть первая" title="Новый" tail="сотрудник" cube="Досье" lead="Завтра к вам выходит умный стажёр. Он читал весь интернет, но не знает про вас ничего. Что вы скажете ему в первый день?" /> },

  /* 8. До / после */
  { mood: "quiet", notes: "Метафора из аудио Кирилла: новый работник, которому либо ничего не объяснили, либо дали инструкции. Оба ответа подготовлены заранее.", render: () => (
    <Pad>
      <Group>
        <H tail="что ему рассказали">Один и тот же стажёр. Разница только в том,</H>
        <div className="grid grid-cols-2 gap-[28px] mt-[64px]">
          <Card v={fromLeft} bad>
            <CardTitle icon={Ban}>Ничего не объяснили</CardTitle>
            <Chat start={.9} gap={.6} msgs={[{ me: true, text: "Напиши поставщику: задержали поставку" }, { text: "Уважаемые партнёры! Выражаем обеспокоенность в связи с задержкой поставки. Надеемся на понимание и просим в кратчайшие сроки предоставить информацию о статусе заказа. С уважением…" }]} />
            <CardText className="mt-[18px]">Вежливо, длинно, без договора, сроков и последствий. Такое письмо можно не отправлять.</CardText>
          </Card>
          <Card v={fromRight} hi>
            <CardTitle icon={ClipboardList}>Дали досье и инструкции</CardTitle>
            <Chat start={2.3} gap={.6} msgs={[{ me: true, text: "Напиши поставщику: задержали поставку" }, { text: "Андрей, добрый день. По договору № 14 поставка должна была прийти 14 октября, сегодня 18‑е. Прошу до 12:00 завтра подтвердить дату отгрузки. По п. 6.2 с 19 октября начисляется неустойка 0,1% в день, пока удерживать не будем. Ильдар, управляющий." }]} />
            <CardText className="mt-[18px]">Имя, номер договора, срок, пункт о неустойке, одна просьба. Можно отправлять.</CardText>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 9. Шесть вещей */
  { mood: "quiet", notes: "Через десять минут впишем это в настройки за один шаг.", render: () => (
    <Pad>
      <Group>
        <H tail="до первого вопроса">Шесть вещей, которые ИИ должен знать</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[64px]">
          <Card v={fromLeft}><CardTitle icon={UserCog}>Кто вы</CardTitle><CardText>«Управляющий сетью из трёх ресторанов в Казани, подчиняюсь собственнику, в команде 60 человек».</CardText></Card>
          <Card v={fromDeep}><CardTitle icon={Building2}>Компания</CardTitle><CardText>«Холдинг: рестораны, покупка земли под застройку, агентство недвижимости в Дубае». Без цифр, которые нельзя разглашать.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={Globe}>Страна и правила</CardTitle><CardText>«Работаем по законам РФ и ОАЭ, цены в рублях и дирхамах, НДС считаем отдельно». Для Дубая и Казани ответы разные.</CardText></Card>
          <Card v={fromLeft}><CardTitle icon={PenLine}>Стиль</CardTitle><CardText>«Коротко, по делу, на «вы», без восклицательных знаков, таблица вместо абзаца, если данных больше трёх строк».</CardText></Card>
          <Card><CardTitle icon={Ban}>Что нельзя</CardTitle><CardText>«Не придумывай цифры и имена. Не обещай сроки. Если не хватает данных, задай вопрос. Юридические выводы помечай как черновик».</CardText></Card>
          <Card v={fromRight} hi><CardTitle icon={CheckCircle2}>Хороший результат</CardTitle><CardText>«Письмо на половину экрана. Три варианта на выбор. Таблица с колонками: позиция, цена, срок». То, что вы примете с первого раза.</CardText></Card>
        </div>
        <Ask>Что из шести вы не смогли бы объяснить стажёру за минуту? Это и есть то, что надо записать</Ask>
      </Group>
    </Pad>
  ) },

  /* 10. Раздел: настройки */
  { mood: "section", notes: "Переключиться в браузер с учебным аккаунтом. Возвращаться к слайду после каждой настройки.", render: () => (
    <Section rot={.9} n="Часть вторая · 30 минут живого экрана" title="Семь" tail="настроек" cube="7">
      <Item className="mt-[26px] max-w-[700px]"><Chips items={["Модель", "Личные инструкции", "Память", "Проекты", "Гигиена чатов", "Где работать", "Чем платить"]} /></Item>
    </Section>
  ) },

  /* 11. Модель */
  { mood: "quiet", notes: "Живой экран: новый чат, меню модели, выбрать думающую.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 1 из 7 · Модель</Kicker>
        <div className="grid items-center gap-[60px]" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
          <div>
            <H tail="а не «Авто»" className="max-w-[900px]">Выбирайте думающую модель,</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub>«Авто» сам решает, кому отдать ваш вопрос. Сложный запрос может уйти слабой модели, и вы об этом не узнаете.</Sub>
              <Sub>Думающая модель на несколько секунд медленнее. Зато считает, сверяет и реже выдумывает.</Sub>
              <Sub>Названия моделей меняются каждые пару месяцев. Запомните принцип, а не имя.</Sub>
            </div>
          </div>
          <Win title="Выбор модели в начале чата" rows={[{ id: "r1", label: "Авто", meta: "сервис выбирает сам", on: true }, { id: "r2", label: "Думающая модель", meta: "рассуждает перед ответом" }, { id: "r3", label: "Быстрая", meta: "короткие ответы" }, { id: "r4", label: "Показать дополнительные модели", meta: "в настройках" }]} steps={[{ sel: "r2", t: 700, on: true, off: true }]} />
        </div>
      </Group>
    </Pad>
  ) },

  /* 12. Личные инструкции */
  { mood: "quiet", notes: "Живой экран: вставить промпт, ответить на три вопроса вслух, остальное заранее. Показать «до и после» на письме поставщику.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 2 из 7 · Личные инструкции</Kicker>
        <div className="grid items-start gap-[60px]" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
          <div>
            <H tail="Вы отвечаете на вопросы" className="max-w-[900px]">Досье пишет сам ИИ.</H>
            <Item className="flex items-center gap-[10px] mt-[44px] mb-[18px] text-[19px] text-mute">{["Настройки", "Персонализация", "Инструкции"].map((t, k) => <span key={k} className="contents">{k > 0 && <em className="not-italic opacity-60">→</em>}<b className="font-medium text-fog px-[12px] py-[6px] rounded-[10px]" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>{t}</b></span>)}</Item>
            <div className="grid gap-[14px]">
              <Sub>Вставляете промпт в обычный чат. Он задаёт десять вопросов, по одному, и не принимает расплывчатых ответов.</Sub>
              <Sub>В конце получаете текст на 400–600 знаков от первого лица и вставляете его в поле инструкций.</Sub>
              <Sub>С этой минуты каждый новый чат знает, с кем говорит. Десять минут один раз.</Sub>
            </div>
          </div>
          <Prompt v={fromRight} text="Помоги составить мои личные инструкции для ИИ. Задай мне по одному вопросу: роль, компания, страна и правила, для кого я пишу, стиль ответов, что мне не нужно, как критиковать мои тексты, «ты» или «вы», любимый формат ответа, типовые задачи. Дождись ответа на каждый. Потом собери текст от первого лица на 400–600 знаков, без воды." note="Промпт есть в конспекте после встречи. Переписывать с экрана не нужно." />
        </div>
      </Group>
    </Pad>
  ) },

  /* 13. Память */
  { mood: "quiet", notes: "Живой экран: открыть список, удалить одну строку, показать переключатель истории, открыть временный чат.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 3 из 7 · Память</Kicker>
        <div className="grid items-start gap-[60px]" style={{ gridTemplateColumns: "1.05fr 1fr" }}>
          <div>
            <H tail="вторую нет" className="max-w-[900px]">У ИИ две памяти. Одну вы видите,</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub><Strong>Сохранённые факты.</Strong> Список того, что ИИ записал о вас. Можно открыть, прочитать и удалить любую строку.</Sub>
              <Sub><Strong>Скрытый профиль.</Strong> Строится из всей истории чатов. Посмотреть нельзя, только выключить. Если чаты были про всё подряд, он мешает.</Sub>
              <Sub><Strong>Временный чат.</Strong> Не попадает ни в историю, ни в память. Для разового и чувствительного.</Sub>
              <Sub className="text-[#ffb86b]">Переписка с ИИ не защищена как тайна переписки. Паспортные данные, договоры с реквизитами и зарплаты туда не вставляем. Обезличиваем: «Арендатор А», «объект на улице Б».</Sub>
            </div>
          </div>
          <Win title="Настройки → Персонализация → Память" rows={[{ id: "m1", label: "Управляет тремя ресторанами", meta: "факт" }, { id: "m2", label: "Предпочитает короткие ответы без вступлений", meta: "факт" }, { id: "m3", label: "Планирует отпуск в сентябре", meta: "удалить" }, { id: "m4", label: "Пишет арендаторам на английском", meta: "факт" }, { id: "m5", label: "Использовать историю чатов для ответов", toggle: true, on: true }]} steps={[{ sel: "m3", t: 900, gone: true }, { sel: "m5", t: 1000, on: false }]} />
        </div>
      </Group>
    </Pad>
  ) },

  /* 14. Проекты */
  { mood: "quiet", notes: "Живой экран: учебный проект с тремя файлами, отзыв про долгий счёт внутри проекта и вне его.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 4 из 7 · Проекты</Kicker>
        <div className="grid items-center gap-[60px]" style={{ gridTemplateColumns: "1.05fr 1fr" }}>
          <div>
            <H tail="Один проект, одна тема" className="max-w-[900px]">Проект — рабочее место стажёра.</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub>Внутри лежат файлы, инструкция и отдельная память. Любой новый чат в проекте их видит без напоминаний.</Sub>
              <Sub>Инструкция проекта сильнее личных. Пять пунктов: что это, для кого, тон, что в файлах, типовые задачи.</Sub>
              <Sub>Проект на каждую повторяющуюся тему: «Отзывы гостей», «Аренда Дубай», «Участок Лаишево». Это и есть первый шаг к агенту.</Sub>
            </div>
          </div>
          <Win title="Проект «Отзывы гостей»" rows={[{ id: "p1", label: "Инструкция проекта", meta: "5 пунктов · 900 знаков" }, { id: "p2", label: "Файлы", meta: "стандарт ответа · меню · правила компенсаций" }, { id: "p3", label: "Память проекта", meta: "только внутри проекта" }, { id: "p4", label: "Новый чат: «Отзыв на 3 звезды, ждали счёт…»", meta: "ответ за 8 секунд" }]} steps={[{ sel: "p1", t: 700, on: true }, { sel: "p2", t: 900, on: true }, { sel: "p4", t: 900, on: true }]} />
        </div>
        <Ask>Назовите тему, по которой вы отвечаете на одни и те же вопросы каждую неделю. Это ваш первый проект</Ask>
      </Group>
    </Pad>
  ) },

  /* 15. Гигиена */
  { mood: "quiet", notes: "Показать ветку одним кликом. Про токены не углубляться.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 5 из 7 · Гигиена чатов</Kicker>
        <H tail="Длинный разговор портит ответы">Новая тема — новый чат.</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[64px]">
          <Card v={fromLeft}><CardTitle icon={HelpCircle}>Почему</CardTitle><CardText>При каждом вопросе ИИ перечитывает весь чат. Сорок сообщений про договор аренды, а потом вопрос про меню: он ищет связь, которой нет, и отвечает хуже.</CardText></Card>
          <Card hi><CardTitle icon={GitBranch}>Ветка</CardTitle><CardText>Нужно отклониться, но сохранить начало? От любого сообщения можно отвести ветку: всё выше остаётся, всё ниже не входит.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={Timer}>Правило</CardTitle><CardText>Чат живёт столько, сколько задача. Отправили письмо арендатору, закрыли чат. Понадобилось снова, нашли по поиску за три секунды.</CardText></Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 16. Где работать */
  { mood: "quiet", notes: "Сегодня всё в браузере. Приложение и среды для агентов на второй встрече.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 6 из 7 · Где работать</Kicker>
        <H tail="Аккаунт один">Три окна для разных задач.</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[64px]">
          <Card v={fromLeft}><CardTitle icon={Smartphone}>Телефон</CardTitle><Bullets items={["Голосом по дороге: «ответь на этот отзыв»", "Фото документа или ценника вместо текста", "Короткие письма и переводы"]} /><CardText className="mt-[16px]">Всегда с собой. Для длинных документов неудобно.</CardText></Card>
          <Card hi><CardTitle icon={Monitor}>Браузер на компьютере</CardTitle><Bullets items={["Все настройки, проекты и файлы", "Редактор длинных текстов рядом с чатом", "Новые функции появляются здесь первыми"]} /><CardText className="mt-[16px]">Основное окно первых двух встреч.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={Laptop}>Приложение на компьютере</CardTitle><Bullets items={["Видит открытые окна и папки, когда вы разрешите", "Подключает почту, календарь, диск", "Отсюда один шаг до агента"]} /><CardText className="mt-[16px]">Встречи 2 и 3. Там же живут среды, где агенту дают папку.</CardText></Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 17. Подписка / ключ */
  { mood: "quiet", notes: "Цены и названия тарифов не называть. Вопрос «одной подпиской на всех?»: аккаунт личный, для команды корпоративные тарифы.", render: () => (
    <Pad>
      <Group>
        <Kicker>Настройка 7 из 7 · Чем платить</Kicker>
        <H tail="Ключ — счётчик для программ">Подписка — абонемент на окно чата.</H>
        <div className="grid grid-cols-2 gap-[28px] mt-[64px]">
          <Card v={fromLeft} hi><CardTitle icon={CreditCard}>Подписка</CardTitle><div className="text-[46px] font-extralight tracking-[-.02em] my-[6px] mb-[16px]">Фиксированная сумма в месяц</div><Bullets items={["Чат, приложение, проекты, телефон: всё в одном аккаунте", "Лимиты на самые тяжёлые режимы, зато никаких сюрпризов в счёте", "Хватает на первые две встречи и почти все задачи"]} /></Card>
          <Card v={fromRight}><CardTitle icon={KeyRound}>Ключ API</CardTitle><div className="text-[46px] font-extralight tracking-[-.02em] my-[6px] mb-[16px]">Оплата за объём текста</div><Bullets items={["Длинная строка символов, её вставляют в программу или агента. Показывается один раз", "Считает токены: примерно три‑четыре символа каждый, вход и выход по разной цене", "Нужен, когда агент работает у вас на компьютере и ходит к модели напрямую"]} /></Card>
        </div>
        <Sub className="mt-[40px] text-[22px]">На третьей встрече программа попросит «вставьте ключ». Вы уже будете знать, что это, где его взять и почему его нельзя никому пересылать.</Sub>
      </Group>
    </Pad>
  ) },

  /* 18. Две папки */
  { mood: "quiet", notes: "Живой экран: две пустые папки в проводнике, в «Б» один файл правил. Открыть Codex в каждой, один запрос, запустить. Вернуться в 17:40 (адрес #18).", render: () => (
    <>
    <Bleed className="opacity-60"><DotGridBack /></Bleed>
    <Pad className="pt-[64px]">
      <Group>
        <Kicker className="mb-[14px]">Доказательство · запускаем сейчас, результат через 30 минут</Kicker>
        <H tail="Разница — в одном файле с правилами">Одна задача, две пустые папки.</H>
        <Prompt v={rise} className="mt-[20px] text-[19px] px-[22px] py-[14px]" text="Подготовь HTML-презентацию земельного участка 2,4 га под коттеджный посёлок для инвестора: расположение, коммуникации, экономика, этапы. Данные вымышленные, 8 слайдов." delay={.5} speed={12} />
        <div className="grid grid-cols-2 gap-[28px] mt-[18px] [&_[data-id]]:py-[11px] [&_[data-id]]:text-[19px]">
          <Win v={fromLeft} title="Папка «А» · пустая" rows={[{ id: "a1", label: "Агент читает задачу", meta: "правил нет, берёт свои шаблоны" }, { id: "a2", label: "Через 10 минут: index.html", meta: "8 слайдов, стандартный вид" }]} steps={[{ sel: "a1", t: 3200, on: true }, { sel: "a2", t: 1200, on: true }]} />
          <Win v={fromRight} title="Папка «Б» · внутри один файл правил" rows={[{ id: "b0", label: "Файл правил · 1 страница", meta: "стиль, структура, референсы, что проверить" }, { id: "b1", label: "Агент читает правила, потом задачу", meta: "знает, как у нас принято" }, { id: "b2", label: "Через 10 минут: index.html", meta: "наш стиль, наша логика, проверка цифр" }]} steps={[{ sel: "b0", t: 2600, on: true }, { sel: "b1", t: 900, on: true }, { sel: "b2", t: 1200, on: true }]} />
        </div>
        <Sub className="mt-[14px] text-[19px]">Файл правил пишется один раз на тип задачи. Любая папка с ним — ваш обученный сотрудник.</Sub>
        <Ask className="mt-[10px] text-[19px]">Пока агенты работают: для какого типа задач вы написали бы такой файл правил первым?</Ask>
      </Group>
    </Pad>
    </>
  ) },

  /* 19. Раздел: способы */
  { mood: "section", notes: "", render: () => <Section rot={-.6} n="Часть третья · 30 минут" title="Пять способов" tail="решать задачи" cube="5" lead="Каждый способ — своя задача, свой вход и своя проверка результата. Все примеры вымышленные, задачи ваши: ресторан, участок, объект в Дубае." /> },

  /* 20. А */
  { mood: "quiet", notes: "Зеркало телефона или ролик 40 секунд. Письмо арендатору — готовым результатом.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ А · Быстрый диалог с телефона</Kicker>
        <div className="grid items-center gap-[70px]" style={{ gridTemplateColumns: "1fr 460px" }}>
          <div>
            <H tail="Две минуты, по дороге" className="max-w-[900px]">Отзыв гостя и письмо арендатору.</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub>Фото отзыва или голос вместо текста. Инструкции и проект уже знают, кто вы и как у вас принято.</Sub>
              <Sub><Strong>Проверка.</Strong> Нет обещаний, которых нет в правилах. Даты и суммы совпадают с вашими. Одна просьба в конце.</Sub>
              <Sub>Второй пример в конспекте: «Напиши арендатору на английском: договор до 30 ноября, предлагаем продление на год на тех же условиях, ответ до 15 ноября».</Sub>
            </div>
          </div>
          <Phone>
            <Chat start={1.2} gap={.8} msgs={[{ me: true, text: "📷 скриншот отзыва" }, { me: true, text: "Отзыв на 3 звезды: вкусно, но счёт ждали 25 минут. Ответь от управляющего, коротко, по нашим правилам" }, { text: "Марина, спасибо за честный отзыв и за «вкусно». Счёт за 25 минут — наша ошибка, разобрали со сменой. Приходите в будни: десерт за наш счёт, скажите администратору «отзыв от 17 октября». Ильдар, управляющий." }, { me: true, text: "Отправляю 👍" }]} />
          </Phone>
        </div>
      </Group>
    </Pad>
  ) },

  /* 21. Б */
  { mood: "quiet", notes: "Живой экран: вымышленное КП, одно слово «разбери». Показать «не указано».", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Б · Готовый промпт плюс документ</Kicker>
        <H tail="«разбери»">Коммерческое предложение разбирается одним словом:</H>
        <div className="grid items-start gap-[50px] mt-[44px]" style={{ gridTemplateColumns: "1fr 1.15fr" }}>
          <Prompt text="Разбери приложенное коммерческое предложение. Сначала таблица: позиция, цена, срок, условия оплаты, гарантия. Потом три главных риска для нас как заказчика и три вопроса поставщику. В конце одна рекомендация: брать, торговаться или отказаться. Если данных нет, пиши «не указано», не додумывай." delay={.6} speed={12} note="Шаблон лежит в проекте «Закупки». Есть версии для договоров аренды и смет." />
          <motion.div variants={fromRight} className="relative rounded-[20px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.14)", background: "linear-gradient(180deg,#0f141d,#0a0e15)" }}>
            <BorderBeam size={220} duration={8} colorFrom="#6ccbff" colorTo="#2f63f5" />
            <div className="px-[18px] py-[14px] text-[17px] text-mute" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>Ответ · КП на оборудование для кухни, 2 страницы</div>
            <div className="p-[22px_24px]">
              <table className="w-full border-collapse text-[19px]">
                <thead><tr>{["Позиция", "Цена", "Срок", "Оплата", "Гарантия"].map(h => <th key={h} className="text-left font-normal text-[16px] text-mute px-[12px] py-[10px]" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["Пароконвектомат", "486 000 ₽", "21 день", "50 / 50", "не указано"], ["Холодильный стол", "128 000 ₽", "не указано", "50 / 50", "12 мес."], ["Монтаж", "не указано", "3 дня", "не указано", "—"]].map((r, i) => (
                    <motion.tr key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.6 + i * .3 }}>
                      {r.map((c, j) => <td key={j} className={"px-[12px] py-[10px] font-light " + (c === "не указано" ? "text-[#ffb86b]" : j ? "text-ice" : "text-fog")} style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>{c}</td>)}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.7 }} className="text-[19px] text-fog mt-[16px]"><Strong>Рекомендация:</Strong> торговаться. Три «не указано» в ключевых полях — запросить до подписания.</motion.p>
            </div>
          </motion.div>
        </div>
      </Group>
    </Pad>
  ) },

  /* 22. В */
  { mood: "quiet", notes: "Реальных контрагентов в эфире не проверяем. Поиск нормы живьём, глубокое исследование — готовым отчётом.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ В · Поиск с источниками</Kicker>
        <H tail="только с датами и ссылками">Проверка нормы или рынка:</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[50px]">
          <Card v={fromLeft}><CardTitle icon={Search}>Как спрашивать</CardTitle><Bullets items={["Тип источников: официальные сайты, реестры, профильные издания", "Период цифрами: «сентябрь–октябрь 2026», а не «недавно»", "Ссылка на каждое утверждение"]} /></Card>
          <Card hi><CardTitle icon={Layers}>Глубокое исследование</CardTitle><Bullets items={["Десятки запросов и отчёт с цитатами за 10–30 минут", "Сравнить поставщиков, рынки, требования", "Формат заранее: таблица, пять абзацев, рекомендации"]} /></Card>
          <Card v={fromRight}><CardTitle icon={ShieldCheck}>Проверка</CardTitle><Bullets items={["Открыть две ссылки и прочитать своими глазами", "Дата документа совпадает с тем, что написал ИИ", "Нет ссылки — нет факта"]} /></Card>
        </div>
        <Prompt v={rise} className="mt-[36px] text-[20px]" text="Какие требования к вентиляции кухни ресторана действуют в России в 2026 году? Только официальные источники. Для каждого утверждения — дата документа и ссылка." delay={1.2} speed={12} />
      </Group>
    </Pad>
  ) },

  /* 23. Г */
  { mood: "quiet", notes: "Живой экран: загрузить xlsx, спросить «какая точка просела и на сколько, сначала назови формулу». Сверить цифру с файлом вслух.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Г · Таблица и вывод для руководителя</Kicker>
        <div className="grid grid-cols-2 items-center gap-[60px]">
          <div>
            <H tail="а не в уме" className="max-w-[900px]">Большие данные ИИ считает кодом,</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub>Таблицу на 18 строк он прочитает и объяснит. Выгрузку из iiko на тысячи строк или ТТК с себестоимостью должен обрабатывать скрипт, который он напишет сам.</Sub>
              <Sub>До анализа договоритесь о вопросе и формуле. После — сверьте одну сумму вручную. Факт и «что если» на разных листах.</Sub>
            </div>
          </div>
          <Card v={fromRight}>
            <CardTitle icon={BarChart3}>Вымышленная сеть · выручка за неделю, тыс. ₽</CardTitle>
            <Bars height={200} className="mt-[40px] mb-[44px] mx-[10px]" data={[{ v: 86, val: "903", label: "Север, пред.", dim: true }, { v: 84, val: "897", label: "Север" }, { v: 70, val: "738", label: "Центр, пред.", dim: true }, { v: 64, val: "692", label: "Центр" }, { v: 48, val: "506", label: "Юг, пред.", dim: true }, { v: 50, val: "526", label: "Юг" }]} />
            <div className="grid grid-cols-3 gap-[14px]">
              <div><div className="text-[64px] leading-[.9]"><Counter to={2115} /></div><CardText>итого</CardText></div>
              <div><div className="text-[64px] leading-[.9]"><Counter to={-26} /></div><CardText>к прошлой неделе</CardText></div>
              <div><div className="text-[64px] leading-[.9]"><Counter to={-46} /></div><CardText>дал «Центр»</CardText></div>
            </div>
          </Card>
        </div>
      </Group>
    </Pad>
  ) },

  /* 24. Д */
  { mood: "quiet", notes: "Взять задачу из зала, пройти пять вопросов, не больше.", render: () => (
    <Pad>
      <Group>
        <Kicker>Способ Д · ИИ спрашивает первым</Kicker>
        <H tail="«задай мне вопросы»">Одна фраза заменяет идеальный промпт:</H>
        <div className="grid grid-cols-2 items-start gap-[50px] mt-[44px]">
          <Prompt text="Мне нужна концепция летней веранды для ресторана. Задай мне 10–15 вопросов, чтобы собрать всё для этой задачи. По одному, дожидайся ответа. Не принимай расплывчатые ответы, уточняй. Когда вопросы закончатся, скажи «готов»." delay={.5} speed={12} note="Потом: «Теперь у тебя есть всё. Сделай задачу. Конкретно, без воды»." />
          <Chat start={3.4} gap={.6} msgs={[{ text: "1. Сколько посадочных мест нужно и какой бюджет на всё, включая мебель?" }, { me: true, text: "40 мест, до 2 млн" }, { text: "2. Веранда должна работать только летом или с подогревом до октября?" }, { me: true, text: "Хотелось бы до октября" }, { text: "3. Кто принимает решение и к какой дате нужен проект?" }]} />
        </div>
      </Group>
    </Pad>
  ) },

  /* 25. Карта ступеней */
  { mood: "section", notes: "Агента не надо писать, он уже есть. Про GitHub: место, где лежит и хранит историю всё, что собирает агент.", render: () => (
    <>
      <Bleed className="opacity-55"><NeuroBack /></Bleed>
      <Bleed style={{ background: "linear-gradient(0deg, rgba(5,7,11,.9), rgba(5,7,11,.4) 40%, rgba(5,7,11,0))" }} />
      <Cubes spec={[{ text: "Чат", x: -5.6, y: 3.5, size: 1.5, ry: .22, rx: -.18 }, { text: "Проект", x: -1.9, y: 3.6, size: 1.5, ry: .08, rx: -.18 }, { text: "Агент", x: 1.9, y: 3.7, size: 1.5, ry: -.08, rx: -.18 }, { text: "Ваш", x: 5.6, y: 3.8, size: 1.8, ry: -.22, rx: -.18, big: true }, { x: -9.8, y: -1.5, z: -7, size: 2.8, ry: .8, far: true }, { x: 10.2, y: 4.6, z: -8, size: 2.4, ry: -.7, far: true }]} />
      <div className="absolute left-[110px] right-[110px] bottom-[70px]">
        <Group delay={1.2}>
          <H tail="И больше ответственности у вас">С каждой ступенью у ИИ больше прав.</H>
          <div className="grid grid-cols-4 gap-[22px] mt-[44px]">
            {[["Сегодня · чат", "Права: читает то, что прислали.", "Риск: выдумки, утечка через вставленное.", "Цена: подписка.", false], ["Встреча 2 · проект и ассистент", "Права: ваши файлы, почта и календарь на чтение.", "Риск: устаревшие файлы.", "Цена: подписка.", false], ["Встреча 3 · агент на компьютере", "Права: папка проекта, запуск программ.", "Риск: тронет не те файлы, поэтому копия и подтверждение.", "Цена: подписка или ключ.", false], ["Ваш агент · по расписанию и из Telegram", "Права: работает без вас.", "Риск: ошибка повторяется каждую неделю, поэтому отчёт после запуска.", "Цена: ключ, иногда сервер.", true]].map(([t, a, b, c, hi], k) => (
              <Card key={k} hi={hi as boolean} className="p-[22px_24px]"><h3 className="text-[22px] mb-[8px]">{t as string}</h3><CardText className="text-[18px]">{a as string}<br />{b as string}<br />{c as string}</CardText></Card>
            ))}
          </div>
          <Ask className="mt-[16px]">На какую ступень вы готовы пустить ИИ уже сейчас, а на какую пока нет? Почему?</Ask>
        </Group>
      </div>
    </>
  ) },

  /* 26. Как это будет выглядеть */
  { mood: "quiet", notes: "Обезличенная копия реального сценария. В резерве показать настоящую переписку с домашним агентом.", render: () => (
    <Pad>
      <Group>
        <Kicker>Встреча 3 · как это будет выглядеть</Kicker>
        <div className="grid items-center gap-[70px]" style={{ gridTemplateColumns: "1fr 460px" }}>
          <div>
            <H tail="Через пять минут приходит файл" className="max-w-[900px]">Вы пишете агенту как коллеге.</H>
            <div className="grid gap-[14px] mt-[44px]">
              <Sub>Агент живёт на вашем компьютере, видит только папку проекта и присылает результат в Telegram.</Sub>
              <Sub>Его не пишут. Его собирают из готовых частей: модель, папка, правила, расписание. Этим и займёмся на третьей встрече.</Sub>
              <Sub><Strong>Условие.</Strong> Каждый результат проверяет человек. Агент пишет, что сделал и что не смог.</Sub>
            </div>
          </div>
          <Phone>
            <Chat start={1.2} gap={.9} msgs={[{ me: true, text: "Собери реестр договоров аренды из папки «Дубай», срок окончания до конца года, в xlsx" }, { text: "Принял. 37 файлов в папке, читаю…" }, { text: "Готово: 9 договоров заканчиваются до 31 декабря. Два файла не прочитались, они в списке отдельно." }, { text: "реестр-аренда-дубай.xlsx · 11 строк", file: true }, { me: true, text: "Отлично. В пятницу повтори" }]} />
          </Phone>
        </div>
      </Group>
    </Pad>
  ) },

  /* 27. Глоссарий */
  { mood: "quiet", notes: "Не зачитывать. Спросить, какое слово непонятно прямо сейчас.", render: () => (
    <Pad>
      <Group>
        <H tail="до собственного агента">Двенадцать слов, которых хватит</H>
        <div className="grid grid-cols-4 gap-[16px_22px] mt-[64px]">
          {[["Модель", "«Мозг» сервиса. Думающая считает дольше и точнее."], ["Контекст", "Всё, что модель видит сейчас: чат, файлы, инструкции."], ["Токен", "Единица счёта текста, три‑четыре символа. За них платят по ключу."], ["Инструкция", "Правила, которые читаются перед каждым ответом. Личные и проектные."], ["Проект", "Папка с файлами, инструкцией и памятью. Рабочее место."], ["Память", "Факты о вас между чатами. Видимая и скрытая."], ["Ассистент", "Настроенный чат с ролью и базой знаний, которым пользуются коллеги."], ["Агент", "Модель плюс доступ к папкам и программам. Делает шаги сам."], ["Папка проекта", "Границы, внутри которых работает агент. Снаружи не видит."], ["Ключ API", "Строка для доступа программы к модели. Показывается один раз."], ["Подключение", "Доступ модели к почте, календарю, диску. Сначала только чтение."], ["Навык", "Сохранённая процедура: «делаю пять раз в неделю, значит навык»."]].map(([b, s], k) => (
            <Item key={k} v={pop} className="rounded-[16px] px-[22px] py-[20px]" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.025)" }}><b className="block text-[24px] font-medium mb-[6px]">{b}</b><span className="text-[18px] text-fog font-light leading-[1.35]">{s}</span></Item>
          ))}
        </div>
      </Group>
    </Pad>
  ) },

  /* 28. Задание */
  { mood: "quiet", notes: "Назвать дату второй встречи, если согласована.", render: () => (
    <Pad>
      <Group>
        <Kicker>До встречи 2 · добровольно · 40 минут</Kicker>
        <H tail="знает вашу компанию">Три шага, после которых ИИ</H>
        <div className="grid grid-cols-3 gap-[28px] mt-[64px]">
          <Card v={fromLeft}><CardTitle icon={Wallet}>Аккаунт и тариф</CardTitle><CardText>По инструкции из рассылки. Думающая модель по умолчанию. Не получается — пишите в чат курса, разберём.</CardText></Card>
          <Card hi><CardTitle icon={PenLine}>Личные инструкции</CardTitle><CardText>Пройти промпт‑интервью из конспекта, вставить результат в настройки. Задать один рабочий вопрос и сравнить с тем, что было.</CardText></Card>
          <Card v={fromRight}><CardTitle icon={FolderOpen}>Один проект</CardTitle><CardText>На самую частую тему. Два‑три файла без персональных данных. Инструкция из пяти пунктов. Это будущее рабочее место вашего агента.</CardText></Card>
        </div>
        <Sub className="mt-[44px]">Конспект встречи с промптами и глоссарием придёт в чат курса сегодня вечером. Ничего сдавать не нужно.</Sub>
      </Group>
    </Pad>
  ) },

  /* 29. Финал */
  { mood: "hero", notes: "Резерв 8 минут. Если вопросов нет, показать обезличенное поручение домашнему агенту и готовый файл.", render: () => (
    <>
      <Bleed className="opacity-95"><LaserBack /></Bleed>
      <Bleed style={{ background: "radial-gradient(45% 40% at 50% 52%, rgba(5,7,11,.72), rgba(5,7,11,0) 70%)" }} />
      <div className="absolute inset-0 grid place-items-center text-center">
        <Group delay={.5}>
          <motion.h2 variants={fromDeep} className="text-[132px] font-extralight tracking-[-.025em] leading-[1]">Вопросы</motion.h2>
          <Sub className="mt-[22px] text-[30px] text-fog">Что из семи настроек вы сделаете первым делом сегодня вечером?</Sub>
        </Group>
      </div>
    </>
  ) },
];
