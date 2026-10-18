import { motion, type Variants, useMotionValue, animate, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ---------- хореография появления: одна спокойная сцена на слайд ---------- */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 22, mass: .8 } },
};
export const fromLeft: Variants = { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 130, damping: 20 } } };
export const fromRight: Variants = { hidden: { opacity: 0, x: 36 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 130, damping: 20 } } };
export const fromDeep: Variants = { hidden: { opacity: 0, scale: .94 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } } };
export const pop: Variants = { hidden: { opacity: 0, scale: .92 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } } };

export const Group = ({ children, className, delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) => (
  <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }} initial="hidden" animate="show" className={className} style={style}>{children}</motion.div>
);
export const Item = ({ children, className, v = rise, style }: { children: ReactNode; className?: string; v?: Variants; style?: CSSProperties }) => (
  <motion.div variants={v} className={className} style={style}>{children}</motion.div>
);

/* ---------- фон навылет: выходит за сцену до краёв окна ---------- */
export const Bleed = ({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={cn("absolute overflow-hidden pointer-events-none", className)} style={{ left: "calc(-1 * var(--bx, 0px))", right: "calc(-1 * var(--bx, 0px))", top: "calc(-1 * var(--by, 0px))", bottom: "calc(-1 * var(--by, 0px))", ...style }}>{children}</div>
);

/* ---------- типографика ---------- */
export const Kicker = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.p variants={rise} className={cn("flex items-center gap-[12px] text-[20px] text-mute mb-[22px]", className)}><i className="w-[8px] h-[8px] rounded-[2px] bg-blue shrink-0" />{children}</motion.p>
);
export const H = ({ children, tail, className, size = 64 }: { children: ReactNode; tail?: ReactNode; className?: string; size?: number }) => (
  <motion.h2 variants={rise} className={cn("font-semibold tracking-[-.035em] leading-[1.02] max-w-[1180px] text-ink", className)} style={{ fontSize: size }}>
    {children}{tail ? <> <span className="tail">{tail}</span></> : null}
  </motion.h2>
);
export const Sub = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.p variants={rise} className={cn("text-[24px] font-normal text-body leading-[1.42]", className)}>{children}</motion.p>
);
export const Strong = ({ children }: { children: ReactNode }) => <b className="font-semibold text-ink">{children}</b>;

/* ---------- иконка и карточка ---------- */
export const Icon = ({ icon: I, size = 40, className }: { icon: LucideIcon; size?: number; className?: string }) => (
  <span className={cn("inline-grid place-items-center rounded-[10px] shrink-0 text-blue bg-paper border border-line", className)} style={{ width: size, height: size }}>
    <I size={Math.round(size * .5)} strokeWidth={1.75} />
  </span>
);
export const Card = ({ children, className, hi, bad, v = rise }: { children: ReactNode; className?: string; hi?: boolean; bad?: boolean; v?: Variants; glow?: boolean }) => (
  <motion.div variants={v} className={cn("relative rounded-[14px] p-[28px_30px]", hi ? "panel-hi" : "panel", bad && "panel-bad", className)}>
    <div className="relative">{children}</div>
  </motion.div>
);
export const CardTitle = ({ children, icon }: { children: ReactNode; icon?: LucideIcon }) => (
  <h3 className="flex items-center gap-[14px] text-[26px] font-medium leading-[1.2] mb-[12px] text-ink">{icon && <Icon icon={icon} size={40} />}<span>{children}</span></h3>
);
export const CardText = ({ children, className }: { children: ReactNode; className?: string }) => <p className={cn("text-[20px] text-body leading-[1.45]", className)}>{children}</p>;
export const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="m-0 p-0 list-none">
    {items.map((t, k) => (
      <li key={k} className="relative pl-[22px] mt-[8px] text-[20px] text-body leading-[1.42]">
        <i className="absolute left-0 top-[12px] w-[7px] h-[7px] rounded-[2px] bg-blue" />{t}
      </li>
    ))}
  </ul>
);

/* ---------- нумерованная повестка раздела ---------- */
export const Steps = ({ items, on = 0 }: { items: [string, string][]; on?: number }) => (
  <ol className="m-0 p-0 list-none">
    {items.map(([t, m], k) => (
      <motion.li key={k} variants={rise} className={cn("grid items-center gap-[20px] py-[18px] border-t border-line text-[28px]", k === on ? "text-ink font-medium" : "text-body")} style={{ gridTemplateColumns: "64px 1fr auto" }}>
        <small className={cn("text-[17px] tabular-nums", k === on ? "text-blue" : "text-mute")}>{String(k + 1).padStart(2, "0")}</small><span>{t}</span><em className="not-italic text-[16px] text-mute">{m}</em>
      </motion.li>
    ))}
    <motion.li variants={rise} className="border-t border-line" />
  </ol>
);

/* ---------- вопрос в зал ---------- */
export const Ask = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={pop} className={cn("inline-flex items-center gap-[14px] mt-[24px] pl-[12px] pr-[20px] py-[11px] rounded-full text-[20px] text-ink bg-white border border-line", className)}>
    <i className="not-italic w-[32px] h-[32px] rounded-full bg-ink grid place-items-center font-semibold text-[17px] text-white shrink-0">?</i>{children}
  </motion.div>
);

/* ---------- окно интерфейса ---------- */
export const Frame = ({ title, meta, children, className, v = fromRight }: { title: string; meta?: ReactNode; children: ReactNode; className?: string; v?: Variants }) => (
  <motion.div variants={v} className={cn("relative rounded-[14px] overflow-hidden bg-white border border-line window", className)}>
    <div className="flex items-center gap-[8px] px-[16px] py-[13px] text-[15px] text-mute border-b border-line">
      <i className="w-[10px] h-[10px] rounded-full bg-line" /><i className="w-[10px] h-[10px] rounded-full bg-line" /><i className="w-[10px] h-[10px] rounded-full bg-line" /><span className="ml-[8px]">{title}</span>
    </div>
    <div className="p-[18px_20px]">{children}</div>
    {meta && <div className="px-[20px] pb-[16px] text-[14px] text-mute">{meta}</div>}
  </motion.div>
);

/* ---------- окно интерфейса с живым курсором ---------- */
export type Step = { sel: string; t?: number; on?: boolean; gone?: boolean; off?: boolean };
export const Win = ({ title, rows, steps = [], className, v = fromRight }: { title: string; rows: { id: string; label: ReactNode; meta?: ReactNode; on?: boolean; toggle?: boolean }[]; steps?: Step[]; className?: string; v?: Variants }) => {
  const [state, setState] = useState<Record<string, { on?: boolean; gone?: boolean }>>(() => Object.fromEntries(rows.map(r => [r.id, { on: !!r.on }])));
  const [cur, setCur] = useState<{ x: number; y: number; show: boolean; click: boolean }>({ x: 60, y: 90, show: false, click: false });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timers: number[] = [];
    let t = 1100;
    steps.forEach((s) => {
      t += s.t ?? 900;
      timers.push(window.setTimeout(() => {
        const box = ref.current, el = box?.querySelector<HTMLElement>(`[data-id="${s.sel}"]`);
        if (!box || !el) return;
        setCur({ x: el.offsetLeft + 40, y: el.offsetTop + el.offsetHeight / 2, show: true, click: false });
      }, t));
      timers.push(window.setTimeout(() => {
        setCur((c) => ({ ...c, click: true }));
        setState((st) => {
          const n = { ...st };
          if (s.off) Object.keys(n).forEach(k => n[k] = { ...n[k], on: false });
          n[s.sel] = { ...n[s.sel], on: s.on ?? n[s.sel]?.on, gone: s.gone ?? n[s.sel]?.gone };
          return n;
        });
        window.setTimeout(() => setCur((c) => ({ ...c, click: false })), 300);
      }, t + 650));
    });
    timers.push(window.setTimeout(() => setCur((c) => ({ ...c, show: false })), t + 2400));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <motion.div variants={v} className={cn("relative rounded-[14px] overflow-hidden bg-white border border-line window", className)}>
      <div className="flex items-center gap-[8px] px-[16px] py-[13px] text-[15px] text-mute border-b border-line">
        <i className="w-[10px] h-[10px] rounded-full bg-line" /><i className="w-[10px] h-[10px] rounded-full bg-line" /><i className="w-[10px] h-[10px] rounded-full bg-line" /><span className="ml-[8px]">{title}</span>
      </div>
      <div ref={ref} className="relative p-[18px_20px] grid gap-[10px]">
        {rows.map((r) => {
          const st = state[r.id] || {};
          return (
            <div key={r.id} data-id={r.id} className={cn("flex items-center justify-between gap-[16px] px-[16px] py-[13px] rounded-[10px] text-[19px] transition-all duration-300 border",
              st.on ? "text-ink border-blue/50 bg-blue/8" : "text-body border-line bg-paper", st.gone && "opacity-30 line-through")}>
              <span>{r.label}</span>
              {r.toggle ? (
                <span className="relative w-[44px] h-[24px] rounded-full shrink-0 transition-colors duration-300" style={{ background: st.on ? "#2f63f5" : "#cfd5e1" }}>
                  <i className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white transition-all duration-300" style={{ left: st.on ? 22 : 2, boxShadow: "0 1px 2px rgba(15,23,42,.25)" }} />
                </span>
              ) : <small className="text-[15px] text-mute">{r.meta}</small>}
            </div>
          );
        })}
        <div className="absolute z-10 pointer-events-none transition-all duration-700 ease-out" style={{ left: cur.x, top: cur.y, opacity: cur.show ? 1 : 0 }}>
          <svg width="22" height="26" viewBox="0 0 22 26" style={{ filter: "drop-shadow(0 2px 4px rgba(15,23,42,.35))" }}><path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14 L17 14 Z" fill="#0f172a" stroke="#fff" strokeWidth="1.2" /></svg>
          {cur.click && <span className="absolute -left-[14px] -top-[14px] w-[40px] h-[40px] rounded-full border-2 border-blue animate-ping" />}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- чат и телефон ---------- */
export const Chat = ({ msgs, className, start = 0.9, gap = 0.6, compact = false }: { msgs: { me?: boolean; text: ReactNode; file?: boolean }[]; className?: string; start?: number; gap?: number; compact?: boolean }) => (
  <div className={cn("grid", compact ? "gap-[8px]" : "gap-[10px]", className)}>
    {msgs.map((m, k) => (
      <motion.div key={k} initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: start + k * gap, type: "spring", stiffness: 200, damping: 22 }}
        className={cn("max-w-[86%] rounded-[16px] leading-[1.35]", compact ? "px-[12px] py-[8px] text-[15px]" : "px-[16px] py-[12px] text-[18px]", m.me ? "justify-self-end bg-blue text-white rounded-br-[6px]" : "justify-self-start bg-paper border border-line text-ink rounded-bl-[6px]", m.file && "flex items-center gap-[12px]")}>
        {m.file && <i className="not-italic w-[34px] h-[34px] rounded-[8px] bg-ink text-white grid place-items-center text-[12px] font-semibold">XLS</i>}{m.text}
      </motion.div>
    ))}
  </div>
);
/* Телефон целиком: строка состояния, шапка приложения, лента, поле ввода */
export const Phone = ({ children, className, v = fromRight, app = "ChatGPT", model = "Думающая модель" }: { children: ReactNode; className?: string; v?: Variants; app?: string; model?: string }) => (
  <motion.div variants={v} className={cn("w-[440px] rounded-[44px] p-[10px] bg-ink", className)} style={{ boxShadow: "0 40px 80px -36px rgba(15,23,42,.55), inset 0 0 0 2px rgba(255,255,255,.08)" }}>
    <div className="relative rounded-[36px] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-[26px] pt-[12px] text-[13px] font-medium text-ink"><span>16:31</span><span className="absolute left-1/2 top-[8px] -translate-x-1/2 w-[112px] h-[30px] rounded-full bg-ink" /><span className="flex items-center gap-[5px]"><i className="w-[16px] h-[10px] border border-ink rounded-[3px] relative after:content-[''] after:absolute after:inset-[2px] after:bg-ink after:rounded-[1px]" /></span></div>
      <div className="flex items-center justify-between px-[18px] pt-[14px] pb-[10px] border-b border-line">
        <span className="text-[20px] text-mute">≡</span><span className="text-center leading-[1.1]"><b className="block text-[16px] font-semibold text-ink">{app}</b><small className="text-[12px] text-mute">{model}</small></span><span className="w-[28px] h-[28px] rounded-full bg-paper border border-line" />
      </div>
      <div className="px-[12px] py-[12px] min-h-[200px]">{children}</div>
      <div className="mx-[14px] mb-[14px] flex items-center gap-[10px] px-[14px] py-[10px] rounded-full bg-paper border border-line text-[15px] text-mute"><span className="flex-1">Спросите что‑нибудь</span><span className="w-[28px] h-[28px] rounded-full bg-ink text-white grid place-items-center text-[14px]">↑</span></div>
    </div>
  </motion.div>
);

/* ---------- промпт с набором текста ---------- */
export const Prompt = ({ text, note, className, delay = 0.6, speed = 14, v = fromLeft }: { text: string; note?: ReactNode; className?: string; delay?: number; speed?: number; v?: Variants }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let k = 0; const start = window.setTimeout(function tick() { k++; setN(k); if (k < text.length) window.setTimeout(tick, speed + (",.".includes(text[k - 1]) ? 110 : 0)); }, delay * 1000);
    return () => clearTimeout(start);
  }, [text]);
  return (
    <motion.div variants={v} className={cn("rounded-[14px] px-[26px] py-[22px] text-[22px] leading-[1.45] text-ink bg-blue/6 border border-blue/25", className)}>
      <span className="whitespace-pre-wrap">{text.slice(0, n)}</span>{n < text.length && <span className="text-blue animate-pulse">▍</span>}
      {note && <small className="block mt-[10px] text-[16px] text-mute">{note}</small>}
    </motion.div>
  );
};

/* ---------- счётчик и столбики ---------- */
export const Counter = ({ to, suffix = "", className, delay = .5 }: { to: number; suffix?: string; className?: string; delay?: number }) => {
  const mv = useMotionValue(0); const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref);
  useEffect(() => { if (!inView) return; const c = animate(mv, to, { duration: 1.3, delay, ease: [0.2, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref} className={cn("font-semibold tracking-[-.04em] text-ink tabular-nums", className)}>{v}{suffix}</span>;
};
export const Bars = ({ data, height = 200, className }: { data: { v: number; label: string; val: string; dim?: boolean }[]; height?: number; className?: string }) => (
  <div className={cn("flex items-end gap-[18px]", className)} style={{ height }}>
    {data.map((d, k) => (
      <div key={k} className="relative flex-1 h-full flex items-end">
        <motion.div initial={{ height: 0 }} animate={{ height: `${d.v}%` }} transition={{ delay: .5 + k * .12, duration: 1.1, ease: [0.2, 1, 0.3, 1] }} className={cn("w-full relative rounded-t-[8px] rounded-b-[3px]", d.dim ? "bg-line" : "bg-blue")}>
          <b className="absolute left-0 right-0 -top-[32px] text-center text-[20px] font-semibold text-ink tabular-nums">{d.val}</b>
          <span className="absolute left-0 right-0 -bottom-[30px] text-center text-[15px] text-mute whitespace-nowrap">{d.label}</span>
        </motion.div>
      </div>
    ))}
  </div>
);

export const Chips = ({ items, on = 0 }: { items: string[]; on?: number }) => (
  <div className="flex flex-wrap gap-[10px]">
    {items.map((t, k) => (
      <motion.span key={k} variants={pop} className={cn("inline-flex items-center px-[16px] py-[8px] rounded-[10px] text-[19px] border", k === on ? "bg-ink text-white border-ink" : "bg-white text-body border-line")}>{t}</motion.span>
    ))}
  </div>
);
