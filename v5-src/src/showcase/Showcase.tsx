import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from "react";
import { entries, groups, type Entry } from "./catalog";
import { Cubes } from "@/fx/Cubes";

const mods = import.meta.glob("../bits/*/*.tsx") as Record<string, () => Promise<{ default: ComponentType<any> }>>;
const lazyOf: Record<string, ComponentType<any>> = {};
const load = (name: string) => (lazyOf[name] ??= lazy(() => mods[`../bits/${name}/${name}.tsx`]()));

const LS = "showcase-picks";
const readPicks = (): string[] => { try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; } };

const docUrl = (e: Entry) => {
  const cat = e.group === "Фоны" ? "backgrounds" : e.group === "Текст" ? "text-animations" : e.group === "Микро" ? "animations" : "components";
  return `https://reactbits.dev/${cat}/${e.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
};

function Stage({ e, overlay }: { e: Entry; overlay: boolean }) {
  const C = load(e.name);
  const box = e.box ?? "full";
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-mute text-[20px]">Загрузка {e.name}…</div>}>
        {box === "full"
          ? <div className="absolute inset-0 [&>*]:w-full [&>*]:h-full">{e.demo ? e.demo(C) : <C />}</div>
          : <div className="absolute inset-0 grid place-items-center">{e.demo ? e.demo(C) : <C />}</div>}
      </Suspense>
      {overlay && e.group === "Фоны" && (
        <div className="absolute inset-0 pointer-events-none">
          <Cubes spec={[{ text: "7", x: 4.8, y: .3, size: 4.4, ry: -.3, rx: -.22, big: true }]} />
          <div className="absolute left-[110px] bottom-[120px] max-w-[760px]">
            <p className="m-0 mb-[18px] text-[13px] tracking-[.12em] uppercase opacity-60">Часть вторая · 30 минут живого экрана</p>
            <h1 className="m-0 font-medium tracking-[-.045em] leading-[.92] text-[92px]">Семь<span className="tail"> настроек</span></h1>
            <p className="m-0 mt-[24px] text-[28px] text-fog max-w-[640px]">Живой экран: каждую настройку включаем вместе, возвращаемся к слайду.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Showcase() {
  const [cur, setCur] = useState(() => { const h = decodeURIComponent(location.hash.slice(1)); return entries.find(e => e.name === h) ? h : entries[0].name; });
  const [picks, setPicks] = useState<string[]>(readPicks);
  const [overlay, setOverlay] = useState(true);
  const [q, setQ] = useState("");
  const [scale, setScale] = useState(1);
  const e = entries.find(x => x.name === cur)!;
  const list = useMemo(() => entries.filter(x => !q || x.name.toLowerCase().includes(q.toLowerCase()) || x.hint.includes(q)), [q]);

  useEffect(() => { location.hash = cur; }, [cur]);
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(picks)); } catch { /* приватное окно */ } }, [picks]);
  useEffect(() => {
    const fit = () => { const w = innerWidth - 360 - 32, h = innerHeight - 56 - 48; setScale(Math.min(w / 1600, h / 900)); };
    fit(); addEventListener("resize", fit); return () => removeEventListener("resize", fit);
  }, []);
  const toggle = (n: string) => setPicks(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const i = list.findIndex(x => x.name === cur);
      if (ev.key === "ArrowDown" || ev.key === "ArrowRight") { ev.preventDefault(); setCur(list[Math.min(list.length - 1, i + 1)]?.name ?? cur); }
      if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") { ev.preventDefault(); setCur(list[Math.max(0, i - 1)]?.name ?? cur); }
      if (ev.key === " ") { ev.preventDefault(); toggle(cur); }
      if (ev.key.toLowerCase() === "t" || ev.key.toLowerCase() === "е") setOverlay(v => !v);
    };
    addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey);
  });
  const picksText = picks.map(n => { const x = entries.find(y => y.name === n); return `${n} — ${x?.group}, ${x?.hint}`; }).join("\n");

  return (
    <div className="fixed inset-0 grid" style={{ gridTemplateColumns: "360px 1fr", gridTemplateRows: "56px 1fr" }}>
      <header className="col-span-2 flex items-center gap-[16px] px-[18px] border-b border-white/10 text-[14px]">
        <strong className="text-[16px]">Витрина React Bits для колоды</strong>
        <span className="text-mute">{entries.length} компонентов · MIT · код уже в проекте</span>
        <span className="ml-auto text-mute">↑↓ листать · Пробел — беру · T — текст слайда</span>
        <label className="flex items-center gap-[8px] cursor-pointer"><input type="checkbox" checked={overlay} onChange={ev => setOverlay(ev.target.checked)} />текст слайда поверх</label>
      </header>
      <aside className="overflow-auto border-r border-white/10 text-[14px]">
        <div className="sticky top-0 bg-ink p-[12px] border-b border-white/10 z-10">
          <input value={q} onChange={ev => setQ(ev.target.value)} placeholder="Поиск по названию или слоту…" className="w-full px-[10px] py-[8px] rounded-[8px] bg-white/5 border border-white/10 text-white outline-none" />
        </div>
        {groups.map(g => {
          const items = list.filter(x => x.group === g); if (!items.length) return null;
          return (
            <div key={g}>
              <div className="px-[14px] pt-[14px] pb-[6px] text-[12px] tracking-[.12em] uppercase text-mute">{g} · {items.length}</div>
              {items.map(x => (
                <div key={x.name} onClick={() => setCur(x.name)} className={"flex items-center gap-[10px] px-[14px] py-[7px] cursor-pointer " + (x.name === cur ? "bg-blue/25" : "hover:bg-white/5")}>
                  <input type="checkbox" checked={picks.includes(x.name)} onChange={() => toggle(x.name)} onClick={ev => ev.stopPropagation()} title="Беру" />
                  <span className="text-white">{x.name}</span>
                  <span className="ml-auto text-[12px] text-mute text-right">{x.hint}</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="p-[14px] border-t border-white/10 mt-[10px]">
          <div className="text-[12px] tracking-[.12em] uppercase text-mute mb-[8px]">Мой выбор · {picks.length}</div>
          <textarea readOnly value={picksText} rows={Math.max(3, Math.min(10, picks.length + 1))} className="w-full text-[12px] p-[8px] rounded-[8px] bg-white/5 border border-white/10 text-fog font-mono" />
          <div className="flex gap-[8px] mt-[8px]">
            <button onClick={() => navigator.clipboard?.writeText(picksText)} className="px-[10px] py-[6px] rounded-[8px] bg-blue text-white cursor-pointer">Скопировать</button>
            <button onClick={() => setPicks([])} className="px-[10px] py-[6px] rounded-[8px] bg-white/10 text-white cursor-pointer">Очистить</button>
          </div>
        </div>
      </aside>
      <main className="relative overflow-hidden grid place-items-center bg-[#02030a]">
        <div style={{ width: 1600, height: 900, transform: `scale(${scale})`, transformOrigin: "center" }} className="relative shadow-[0_40px_120px_-40px_rgba(0,0,0,1)] border border-white/10">
          <Stage key={cur + (overlay ? "1" : "0")} e={e} overlay={overlay} />
        </div>
        <div className="absolute left-[16px] bottom-[12px] text-[13px] text-mute">
          <strong className="text-white">{e.name}</strong> · {e.group} · {e.hint} · <a className="text-sky" href={docUrl(e)} target="_blank" rel="noreferrer">документация ↗</a>
        </div>
      </main>
    </div>
  );
}
