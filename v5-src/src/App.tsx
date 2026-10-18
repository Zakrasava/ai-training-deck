import { AnimatePresence, motion } from "motion/react";
import { useDeck, useScale } from "@/deck/useDeck";
import { InstantCtx } from "@/deck/primitives";
import { slides } from "@/slides";
import { useEffect, useRef, useState } from "react";

declare const __NOTES__: boolean;
const NOTES = typeof __NOTES__ !== "undefined" && __NOTES__;

export default function App() {
  const total = slides.length;
  const { i, dir, next, prev, go, notes, setNotes, help, setHelp } = useDeck(total);
  const { s, bx, by } = useScale();
  const slide = slides[i];
  // слайд, который уже показывали, открывается сразу собранным: возврат к демо, прыжки через меню
  const seen = useRef(new Set<number>());
  const prevI = useRef<number | null>(null);
  if (prevI.current !== null && prevI.current !== i) seen.current.add(prevI.current);
  prevI.current = i;
  const instant = seen.current.has(i);
  const [hud, setHud] = useState(true);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    let t = window.setTimeout(() => setHud(false), 2500);
    const wake = () => { setHud(true); clearTimeout(t); t = window.setTimeout(() => setHud(false), 2500); };
    addEventListener("mousemove", wake); addEventListener("keydown", wake); addEventListener("touchstart", wake, { passive: true });
    return () => { clearTimeout(t); removeEventListener("mousemove", wake); removeEventListener("keydown", wake); removeEventListener("touchstart", wake); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); if (e.key === "m" || e.key === "M" || e.key === "ь" || e.key === "Ь") setMenu(v => !v); };
    addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey);
  }, []);
  const show = hud || notes || help || menu;

  return (
    <div className="fixed inset-0 bg-paper text-ink gridbg">
      {/* мягкий холодный свет в правом верхнем углу */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px 620px at 78% 12%, rgba(47,99,245,.10), rgba(47,99,245,0) 65%), linear-gradient(180deg, rgba(245,246,250,0), rgba(245,246,250,.6))" }} />

      {/* сцена 1600×900 */}
      <div className="absolute left-1/2 top-1/2 w-[1600px] h-[900px]" style={{ transform: `translate(-50%,-50%) scale(${s})`, ["--bx" as string]: `${bx}px`, ["--by" as string]: `${by}px` }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section key={i} className="absolute inset-0"
            initial={{ opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * dir }}
            transition={{ duration: .4, ease: [.22, .61, .2, 1] }}>
            <InstantCtx.Provider value={instant}>{slide.render()}</InstantCtx.Provider>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* телефон в портретной ориентации: сцена 16:9 станет полоской, подсказать повернуть */}
      <div className="portrait-hint">Поверните телефон горизонтально</div>

      {/* навигация по краям */}
      <button aria-label="Назад" onClick={prev} className="fixed left-0 top-[64px] bottom-[48px] w-[16%] cursor-pointer opacity-0" />
      <button aria-label="Вперёд" onClick={next} className="fixed right-0 top-[64px] bottom-[48px] w-[16%] cursor-pointer opacity-0" />

      {/* меню слайдов: три полоски в левом верхнем углу */}
      <button aria-label="Список слайдов (M)" onClick={() => setMenu(v => !v)} className="fixed left-[16px] top-[14px] w-[44px] h-[40px] grid place-items-center gap-[4px] rounded-[10px] cursor-pointer text-mute hover:text-ink hover:bg-white/80 transition-all duration-300" style={{ opacity: show ? 1 : .25, gridAutoRows: "2px", paddingTop: 12, paddingBottom: 12 }}>
        <i className="menu-line" /><i className="menu-line" /><i className="menu-line" />
      </button>
      <AnimatePresence>
        {menu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} className="fixed inset-0" style={{ background: "rgba(15,23,42,.18)", backdropFilter: "blur(2px)" }} />
            <motion.nav initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="fixed left-0 top-0 bottom-0 w-[420px] overflow-auto bg-white border-r border-line window px-[18px] py-[18px]">
              <div className="flex items-center justify-between px-[10px] pb-[12px] border-b border-line text-[14px] text-mute"><span>Слайды · {total}</span><span>M или Esc закрывает</span></div>
              <ol className="m-0 p-0 list-none mt-[8px]">
                {slides.map((sl, k) => (
                  <li key={k}>
                    <button onClick={() => { go(k); setMenu(false); }} className={"w-full text-left flex items-baseline gap-[14px] px-[10px] py-[9px] rounded-[10px] cursor-pointer text-[17px] " + (k === i ? "bg-blue/8 text-ink font-medium" : "text-body hover:bg-paper")}>
                      <span className={"w-[30px] shrink-0 tabular-nums text-[14px] " + (k === i ? "text-blue" : "text-mute")}>{k + 1}</span><span>{sl.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="fixed left-0 right-0 bottom-0 flex items-center justify-between px-[18px] pt-[10px] pb-[12px] text-[12px] text-mute/70 transition-opacity duration-500" style={{ opacity: show ? 1 : 0 }}>
        <motion.div className="absolute left-0 top-0 h-[2px] bg-blue" animate={{ width: `${((i + 1) / total) * 100}%` }} transition={{ duration: .5 }} />
        <div className="flex items-center gap-[6px]"><button onClick={prev} className="px-[8px] py-[6px] rounded-[8px] hover:bg-ink/5 hover:text-ink cursor-pointer">←</button><span className="tabular-nums">{i + 1} / {total}</span><button onClick={next} className="px-[8px] py-[6px] rounded-[8px] hover:bg-ink/5 hover:text-ink cursor-pointer">→</button></div>
        <div className="flex items-center gap-[6px]">
          {NOTES && <button onClick={() => setNotes(v => !v)} className="px-[8px] py-[6px] rounded-[8px] hover:bg-ink/5 hover:text-ink cursor-pointer">Заметки (N)</button>}
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }} className="px-[8px] py-[6px] rounded-[8px] hover:bg-ink/5 hover:text-ink cursor-pointer">Во весь экран (F)</button>
          <button onClick={() => setHelp(v => !v)} className="px-[8px] py-[6px] rounded-[8px] hover:bg-ink/5 hover:text-ink cursor-pointer">?</button>
        </div>
      </div>

      <AnimatePresence>
        {notes && NOTES && (
          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed right-[16px] bottom-[56px] w-[440px] max-h-[60vh] overflow-auto px-[20px] py-[18px] rounded-[14px] text-[15px] leading-[1.45] text-body bg-white border border-line window">
            <h4 className="m-0 mb-[8px] text-[13px] font-medium text-mute">Заметки ведущего</h4>
            <p className="m-0">{slide.notes || "Без заметок."}</p>
          </motion.aside>
        )}
        {help && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHelp(false)} className="fixed inset-0 grid place-items-center" style={{ background: "rgba(15,23,42,.35)", backdropFilter: "blur(6px)" }}>
            <div className="w-[520px] px-[32px] py-[28px] rounded-[16px] text-[16px] text-body bg-white border border-line window">
              <p className="my-[8px]"><kbd className="kbd">→</kbd> <kbd className="kbd">пробел</kbd> следующий слайд, <kbd className="kbd">←</kbd> предыдущий</p>
              <p className="my-[8px]"><kbd className="kbd">M</kbd> список слайдов, {NOTES && <><kbd className="kbd">N</kbd> заметки ведущего, </>}<kbd className="kbd">F</kbd> полный экран</p>
              <p className="my-[8px]">Клик по краю экрана, свайп на телефоне. Номер слайда в адресе: #8 откроет восьмой.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
