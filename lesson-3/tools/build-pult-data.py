"""Собирает lesson-3/deck/cmds.js (тексты слайдов‑команд) из документа с командами ведущего.

Источник один — 03-пульт-промпты.md в репозитории программы; руками cmds.js не правится.
Запуск: python tools/build-pult-data.py <путь к 03-пульт-промпты.md> deck/cmds.js [<папка урока>/цепочка.md]
Третий аргумент — куда записать шесть сообщений цепочки «одно окно — один бот» для репетиции (разделитель ─ строка -----).
"""
import json
import re
import sys
from pathlib import Path

src = Path(sys.argv[1]).read_text(encoding="utf-8")
out = Path(sys.argv[2])

BLOCK = re.compile(r"\*\*([^*]+?)\*\*[^\n]*\n+```\n(.*?)\n```", re.S)

parts = re.split(r"^## ", src, flags=re.M)
common = next(p for p in parts if p.startswith("Общий шаг"))
second = {m.group(1).strip(): m.group(2).strip() for m in BLOCK.finditer(common)}["Второй взгляд"]

tasks = []
for p in parts:
    m = re.match(r"(\d)\. (.+)", p)
    if not m:
        continue
    cmd = {b.group(1).strip(): b.group(2).strip() for b in BLOCK.finditer(p)}["Команда"]
    exp = re.search(r"Что агент должен найти сам:\s*(.+)", p)
    items = [s.strip().rstrip(".") for s in exp.group(1).split(";")] if exp else []
    tasks.append({"n": int(m.group(1)), "title": m.group(2).strip(), "cmd": cmd,
                  "expect": [s[0].upper() + s[1:] for s in items if s]})

split = lambda line: [x.strip().rstrip(".") for x in line.split(";") if x.strip()]
cap = lambda xs: [x[0].upper() + x[1:] for x in xs]

# цепочка: «**N · Название** (задача M)» и блок кода; «Что увидим:» — список для последнего сообщения
one = next(p for p in parts if p.startswith("Одно окно"))
chain = []
for m in re.finditer(r"\*\*(\d) · ([^*]+?)\*\*([^\n]*)\n+```\n(.*?)\n```", one, re.S):
    ref = re.search(r"задача (\d)", m.group(3))
    t = next((x for x in tasks if ref and x["n"] == int(ref.group(1))), None)
    chain.append({"n": int(m.group(1)), "title": m.group(2).strip(), "cmd": m.group(4).strip(),
                  "expect": t["expect"] if t else []})
see = re.search(r"Что увидим:\s*(.+)", one)
chain[-1].update(expect=cap(split(see.group(1))), expectTitle="Что увидим на экране")

out.write_text("// Собрано tools/build-pult-data.py из 03-пульт-промпты.md — руками не править.\n"
               "window.PULT = " + json.dumps({"tasks": tasks, "chain": chain, "second": second}, ensure_ascii=False, indent=1)
               + ";\n", encoding="utf-8")
if len(sys.argv) > 3:
    Path(sys.argv[3]).write_text("\n-----\n".join(c["cmd"] for c in chain) + "\n", encoding="utf-8")
print("задач:", len(tasks), "· сообщений цепочки:", len(chain))
for t in tasks:
    print(f"  {t['n']}. {t['title']}: команда {len(t['cmd'])} зн., ждём {len(t['expect'])}")
for c in chain:
    print(f"  сообщение {c['n']} · {c['title']}: {len(c['cmd'])} зн., ждём {len(c['expect'])}")
