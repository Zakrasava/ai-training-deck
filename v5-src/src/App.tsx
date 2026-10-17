import { AnimatePresence, motion } from "motion/react";
import { useDeck, useScale } from "@/deck/useDeck";
import { slides } from "@/slides";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function App() {
  const total = slides.length;
  const { i, dir, next, prev, notes, setNotes, help, setHelp } = useDeck(total);
  const s = useScale();
  const slide = slides[i];
  const mood = slide.mood;

  return (
    <div className="fixed inset-0 bg-ink text-[#edf1f7]">
      {/* фон: глубина, звёзды, кометы */}
      <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity: mood === "quiet" ? .55 : 1 }} transition={{ duration: 1.4 }}>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-[100px]" style={{ background: "radial-gradient(closest-side, rgba(27,61,160,.55), rgba(13,28,68,.35) 45%, rgba(5,7,11,0) 72%)" }} />
        <div className="absolute left-1/2 -bottom-[260px] -translate-x-1/2 w-[1700px] h-[560px] rounded-full blur-[90px] opacity-80" style={{ background: "radial-gradient(closest-side, rgba(60,120,255,.32), rgba(5,7,11,0) 72%)" }} />
      </motion.div>
      <StarsBackground starDensity={0.00035} className="opacity-90" />
      <ShootingStars minSpeed={14} maxSpeed={32} minDelay={900} maxDelay={3400} starColor="#9fc4ff" trailColor="#2f63f5" starWidth={14} starHeight={1.5} className="opacity-80" />

      {/* сцена 1600×900 */}
      <div className="absolute left-1/2 top-1/2 w-[1600px] h-[900px]" style={{ transform: `translate(-50%,-50%) scale(${s})` }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section key={i} className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0, x: 80 * dir, scale: .985, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -80 * dir, scale: 1.01, filter: "blur(10px)" }}
            transition={{ duration: .55, ease: [.22, .61, .2, 1] }}>
            {slide.render()}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* навигация по краям */}
      <button aria-label="Назад" onClick={prev} className="fixed left-0 top-0 bottom-[48px] w-[16%] cursor-pointer opacity-0" />
      <button aria-label="Вперёд" onClick={next} className="fixed right-0 top-0 bottom-[48px] w-[16%] cursor-pointer opacity-0" />

      {/* HUD */}
      <div className="fixed left-0 right-0 bottom-0 flex items-center justify-between px-[18px] pt-[10px] pb-[12px] text-[13px] text-white/40">
        <motion.div className="absolute left-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg,#2f63f5,#6ccbff)", boxShadow: "0 0 12px rgba(108,203,255,.8)" }} animate={{ width: `${((i + 1) / total) * 100}%` }} transition={{ duration: .5 }} />
        <div className="flex items-center gap-[6px]"><button onClick={prev} className="px-[8px] py-[6px] rounded-[8px] hover:bg-white/5 hover:text-white cursor-pointer">←</button><span>{i + 1} / {total}</span><button onClick={next} className="px-[8px] py-[6px] rounded-[8px] hover:bg-white/5 hover:text-white cursor-pointer">→</button></div>
        <div className="flex items-center gap-[6px]">
          <button onClick={() => setNotes(v => !v)} className="px-[8px] py-[6px] rounded-[8px] hover:bg-white/5 hover:text-white cursor-pointer">Заметки (N)</button>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }} className="px-[8px] py-[6px] rounded-[8px] hover:bg-white/5 hover:text-white cursor-pointer">Во весь экран (F)</button>
          <button onClick={() => setHelp(v => !v)} className="px-[8px] py-[6px] rounded-[8px] hover:bg-white/5 hover:text-white cursor-pointer">?</button>
        </div>
      </div>

      <AnimatePresence>
        {notes && (
          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed right-[16px] bottom-[56px] w-[440px] max-h-[60vh] overflow-auto px-[20px] py-[18px] rounded-[16px] text-[15px] leading-[1.45] text-fog" style={{ background: "rgba(10,14,22,.92)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(12px)" }}>
            <h4 className="m-0 mb-[8px] text-[13px] font-medium text-mute">Заметки ведущего</h4>
            <p className="m-0">{slide.notes || "Без заметок."}</p>
          </motion.aside>
        )}
        {help && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHelp(false)} className="fixed inset-0 grid place-items-center" style={{ background: "rgba(5,7,11,.8)", backdropFilter: "blur(8px)" }}>
            <div className="w-[520px] px-[32px] py-[28px] rounded-[20px] text-[16px] text-fog" style={{ background: "#0c1119", border: "1px solid rgba(255,255,255,.14)" }}>
              <p className="my-[8px]"><kbd className="kbd">→</kbd> <kbd className="kbd">пробел</kbd> следующий слайд, <kbd className="kbd">←</kbd> предыдущий</p>
              <p className="my-[8px]"><kbd className="kbd">N</kbd> заметки ведущего, <kbd className="kbd">F</kbd> полный экран, <kbd className="kbd">Home</kbd> <kbd className="kbd">End</kbd> начало и конец</p>
              <p className="my-[8px]">Клик по краю экрана, свайп на телефоне. Номер слайда в адресе: #8 откроет восьмой.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
