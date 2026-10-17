import { motion, type Variants, useMotionValue, animate, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

/* ---------- хореография появления ---------- */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } };
export const rise: Variants = {
  hidden: { opacity: 0, y: 46, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 20, mass: .9 } },
};
export const fromLeft: Variants = { hidden: { opacity: 0, x: -140, rotate: -3, filter: "blur(10px)" }, show: { opacity: 1, x: 0, rotate: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 110, damping: 18 } } };
export const fromRight: Variants = { hidden: { opacity: 0, x: 140, rotate: 3, filter: "blur(10px)" }, show: { opacity: 1, x: 0, rotate: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 110, damping: 18 } } };
export const fromDeep: Variants = { hidden: { opacity: 0, scale: .55, filter: "blur(16px)" }, show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 90, damping: 16 } } };
export const pop: Variants = { hidden: { opacity: 0, scale: .7, rotate: -8 }, show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 16 } } };

export const Group = ({ children, className, delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) => (
  <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: delay } } }} initial="hidden" animate="show" className={className} style={style}>{children}</motion.div>
);
export const Item = ({ children, className, v = rise, style }: { children: ReactNode; className?: string; v?: Variants; style?: CSSProperties }) => (
  <motion.div variants={v} className={className} style={style}>{children}</motion.div>
);

/* ---------- типографика ---------- */
export const Kicker = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.p variants={rise} className={cn("text-[22px] text-mute mb-[22px]", className)}>{children}</motion.p>
);
export const H = ({ children, tail, className, size = 64 }: { children: ReactNode; tail?: ReactNode; className?: string; size?: number }) => (
  <motion.h2 variants={rise} className={cn("font-light tracking-[-.02em] leading-[1.06] max-w-[1180px]", className)} style={{ fontSize: size }}>
    {children}{tail ? <> <span className="tail">{tail}</span></> : null}
  </motion.h2>
);
export const Sub = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.p variants={rise} className={cn("text-[24px] font-light text-mute leading-[1.4]", className)}>{children}</motion.p>
);
export const Strong = ({ children }: { children: ReactNode }) => <b className="font-medium text-ice">{children}</b>;

/* ---------- карточка со свечением по курсору ---------- */
export const Card = ({ children, className, hi, bad, v = rise, glow = false }: { children: ReactNode; className?: string; hi?: boolean; bad?: boolean; v?: Variants; glow?: boolean }) => (
  <motion.div variants={v} className={cn("relative rounded-[22px] p-[30px_32px]", hi ? "glass-hi" : "glass", bad && "glass-bad", className)}>
    {glow && <GlowingEffect spread={46} glow proximity={120} inactiveZone={0.05} borderWidth={1.5} disabled={false} />}
    <div className="relative">{children}</div>
  </motion.div>
);
export const CardTitle = ({ children }: { children: ReactNode }) => <h3 className="text-[27px] font-normal leading-[1.2] mb-[12px]">{children}</h3>;
export const CardText = ({ children, className }: { children: ReactNode; className?: string }) => <p className={cn("text-[21px] text-fog font-light leading-[1.4]", className)}>{children}</p>;
export const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="m-0 p-0 list-none">
    {items.map((t, k) => (
      <li key={k} className="relative pl-[22px] mt-[8px] text-[21px] text-fog font-light leading-[1.4]">
        <i className="absolute left-0 top-[13px] w-[7px] h-[7px] rounded-full bg-blue shadow-[0_0_10px_rgba(47,99,245,.9)]" />{t}
      </li>
    ))}
  </ul>
);

/* ---------- вопрос в зал ---------- */
export const Ask = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={pop} className={cn("inline-flex items-center gap-[14px] mt-[24px] pl-[14px] pr-[20px] py-[12px] rounded-full text-[21px] text-ice", className)}
    style={{ background: "rgba(47,99,245,.14)", border: "1px solid rgba(120,160,255,.4)" }}>
    <i className="not-italic w-[34px] h-[34px] rounded-full bg-blue grid place-items-center font-semibold text-[18px] text-white shrink-0 shadow-[0_0_18px_rgba(47,99,245,.9)]">?</i>{children}
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
    <motion.div variants={v} className={cn("relative rounded-[20px] overflow-hidden", className)} style={{ border: "1px solid rgba(255,255,255,.14)", background: "linear-gradient(180deg,#0f141d,#0a0e15)", boxShadow: "0 40px 90px -40px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.07)" }}>
      <div className="flex items-center gap-[10px] px-[18px] py-[14px] text-[17px] text-mute" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <i className="w-[11px] h-[11px] rounded-full bg-[#2a3140]" /><i className="w-[11px] h-[11px] rounded-full bg-[#343c4e]" /><i className="w-[11px] h-[11px] rounded-full bg-[#3e475b]" /><span className="ml-[10px]">{title}</span>
      </div>
      <div ref={ref} className="relative p-[22px_24px] grid gap-[12px]">
        {rows.map((r) => {
          const st = state[r.id] || {};
          return (
            <div key={r.id} data-id={r.id} className={cn("flex items-center justify-between gap-[16px] px-[16px] py-[14px] rounded-[12px] text-[20px] transition-all duration-300",
              st.on ? "text-white" : "text-fog", st.gone && "opacity-25 line-through")}
              style={{ background: st.on ? "rgba(47,99,245,.16)" : "rgba(255,255,255,.03)", border: st.on ? "1px solid rgba(120,160,255,.45)" : "1px solid rgba(255,255,255,.08)", boxShadow: st.on ? "0 0 0 1px rgba(120,160,255,.3), 0 10px 30px -12px rgba(47,99,245,.8)" : undefined }}>
              <span>{r.label}</span>
              {r.toggle ? (
                <span className="relative w-[46px] h-[26px] rounded-full shrink-0 transition-colors duration-300" style={{ background: st.on ? "#2f63f5" : "#2a3140", boxShadow: st.on ? "0 0 14px rgba(47,99,245,.8)" : undefined }}>
                  <i className="absolute top-[3px] w-[20px] h-[20px] rounded-full transition-all duration-300" style={{ left: st.on ? 23 : 3, background: st.on ? "#fff" : "#8a94a6" }} />
                </span>
              ) : <small className="text-[16px] text-mute">{r.meta}</small>}
            </div>
          );
        })}
        <div className="absolute z-10 pointer-events-none transition-all duration-700 ease-out" style={{ left: cur.x, top: cur.y, opacity: cur.show ? 1 : 0 }}>
          <svg width="22" height="26" viewBox="0 0 22 26" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }}><path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14 L17 14 Z" fill="#fff" stroke="#222" strokeWidth="1" /></svg>
          {cur.click && <span className="absolute -left-[14px] -top-[14px] w-[40px] h-[40px] rounded-full border-2 border-sky animate-ping" />}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- чат и телефон ---------- */
export const Chat = ({ msgs, className, start = 0.9, gap = 0.6 }: { msgs: { me?: boolean; text: ReactNode; file?: boolean }[]; className?: string; start?: number; gap?: number }) => (
  <div className={cn("grid gap-[12px]", className)}>
    {msgs.map((m, k) => (
      <motion.div key={k} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: start + k * gap, type: "spring", stiffness: 200, damping: 20 }}
        className={cn("max-w-[86%] px-[18px] py-[14px] rounded-[18px] text-[19px] leading-[1.35]", m.me ? "justify-self-end text-white rounded-br-[6px]" : "justify-self-start rounded-bl-[6px]", m.file && "flex items-center gap-[12px]")}
        style={m.me ? { background: "linear-gradient(180deg,#27479e,#1a2f6e)" } : { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
        {m.file && <i className="not-italic w-[34px] h-[34px] rounded-[8px] bg-blue grid place-items-center text-[13px] font-semibold">XLS</i>}{m.text}
      </motion.div>
    ))}
  </div>
);
export const Phone = ({ children, className, v = fromRight }: { children: ReactNode; className?: string; v?: Variants }) => (
  <motion.div variants={v} className={cn("w-[440px] rounded-[36px] p-[18px_14px]", className)} style={{ background: "#0b0f17", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9), inset 0 0 0 6px #05070b" }}>
    <div className="px-[6px] py-[10px]">{children}</div>
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
    <motion.div variants={v} className={cn("rounded-[18px] px-[28px] py-[24px] text-[22px] leading-[1.45] text-ice", className)} style={{ background: "rgba(47,99,245,.10)", border: "1px solid rgba(120,160,255,.3)" }}>
      <span className="whitespace-pre-wrap">{text.slice(0, n)}</span>{n < text.length && <span className="text-sky animate-pulse">▍</span>}
      {note && <small className="block mt-[10px] text-[17px] text-mute">{note}</small>}
    </motion.div>
  );
};

/* ---------- счётчик и столбики ---------- */
export const Counter = ({ to, suffix = "", className, delay = .5 }: { to: number; suffix?: string; className?: string; delay?: number }) => {
  const mv = useMotionValue(0); const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref);
  useEffect(() => { if (!inView) return; const c = animate(mv, to, { duration: 1.3, delay, ease: [0.2, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref} className={cn("font-extralight tracking-[-.04em] text-ice", className)} style={{ textShadow: "0 0 48px rgba(108,203,255,.35)" }}>{v}{suffix}</span>;
};
export const Bars = ({ data, height = 200, className }: { data: { v: number; label: string; val: string; dim?: boolean }[]; height?: number; className?: string }) => (
  <div className={cn("flex items-end gap-[18px]", className)} style={{ height }}>
    {data.map((d, k) => (
      <div key={k} className="relative flex-1 h-full flex items-end">
        <motion.div initial={{ height: 0 }} animate={{ height: `${d.v}%` }} transition={{ delay: .5 + k * .12, duration: 1.1, ease: [0.2, 1, 0.3, 1] }} className="w-full relative rounded-t-[10px] rounded-b-[4px]"
          style={d.dim ? { background: "linear-gradient(180deg, rgba(255,255,255,.25), rgba(255,255,255,.08))" } : { background: "linear-gradient(180deg, rgba(108,203,255,.9), rgba(47,99,245,.6))", boxShadow: "0 0 24px rgba(47,99,245,.35)" }}>
          <b className="absolute left-0 right-0 -top-[32px] text-center text-[20px] font-medium text-ice">{d.val}</b>
          <span className="absolute left-0 right-0 -bottom-[30px] text-center text-[16px] text-mute whitespace-nowrap">{d.label}</span>
        </motion.div>
      </div>
    ))}
  </div>
);

export const Chips = ({ items, on = 0 }: { items: string[]; on?: number }) => (
  <div className="flex flex-wrap gap-[12px]">
    {items.map((t, k) => (
      <motion.span key={k} variants={pop} className="inline-flex items-center px-[16px] py-[8px] rounded-full text-[19px]" style={k === on ? { background: "rgba(47,99,245,.22)", border: "1px solid rgba(120,160,255,.5)", color: "#fff" } : { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.14)", color: "#b7c0cf" }}>{t}</motion.span>
    ))}
  </div>
);
