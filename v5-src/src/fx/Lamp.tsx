import { motion } from "motion/react";
import type { ReactNode } from "react";

/* Лампа в духе Linear/Aceternity: две конические половины, светящаяся полоса,
   мягкое пятно. Адаптировано под Tailwind v4 и холст 1600×900. */
export function Lamp({ children, width = 760, color = "#6ccbff", top = 300 }: { children?: ReactNode; width?: number; color?: string; top?: number }) {
  const half = width / 2;
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 w-0" style={{ top }}>
        <motion.div initial={{ opacity: .5, width: half * .5 }} animate={{ opacity: 1, width: half }} transition={{ delay: .3, duration: .9, ease: "easeInOut" }}
          className="absolute right-0 h-[300px] overflow-visible" style={{ top: 0, backgroundImage: `conic-gradient(from 70deg at center top, ${color}cc 0deg, transparent 80deg, transparent 360deg)`, maskImage: "linear-gradient(to bottom, white 0%, transparent 92%)", opacity: .85 }} />
        <motion.div initial={{ opacity: .5, width: half * .5 }} animate={{ opacity: 1, width: half }} transition={{ delay: .3, duration: .9, ease: "easeInOut" }}
          className="absolute left-0 h-[300px] overflow-visible" style={{ top: 0, backgroundImage: `conic-gradient(from 290deg at center top, transparent 0deg, transparent 280deg, ${color}cc 360deg)`, maskImage: "linear-gradient(to bottom, white 0%, transparent 92%)", opacity: .85 }} />
        {/* светящаяся полоса */}
        <motion.div initial={{ width: half * .5, opacity: 0 }} animate={{ width: half, opacity: 1 }} transition={{ delay: .3, duration: .9, ease: "easeInOut" }}
          className="absolute -translate-x-1/2 h-[3px] rounded-full" style={{ top: -2, background: color, boxShadow: `0 0 30px 6px ${color}99, 0 0 90px 20px ${color}55` }} />
        {/* мягкое пятно под лампой */}
        <motion.div initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .5, duration: 1.2 }}
          className="absolute -translate-x-1/2 rounded-full blur-[90px]" style={{ top: -40, width: width * .8, height: 320, background: `radial-gradient(closest-side, ${color}66, transparent 70%)` }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: .9 }} transition={{ delay: .8, duration: 1.2 }}
          className="absolute -translate-x-1/2 rounded-full blur-[40px]" style={{ top: -30, width: width * .35, height: 140, background: `${color}66` }} />
      </div>
      {/* тёмная крышка над лампой, чтобы конусы не светили вверх */}
      <div className="absolute left-0 right-0" style={{ top: 0, height: top - 2, background: "linear-gradient(180deg, #05070b 70%, rgba(5,7,11,0))" }} />
      {children}
    </div>
  );
}
