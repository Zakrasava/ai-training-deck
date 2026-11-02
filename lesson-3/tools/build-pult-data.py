"""Собирает lesson-3/deck/cmds.js (тексты слайдов‑команд) из документа с командами ведущего.

Источник один — 03-пульт-промпты.md в репозитории программы; руками cmds.js не правится.
Запуск: python tools/build-pult-data.py <путь к 03-пульт-промпты.md> deck/cmds.js
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

out.write_text("// Собрано tools/build-pult-data.py из 03-пульт-промпты.md — руками не править.\n"
               "window.PULT = " + json.dumps({"tasks": tasks, "second": second}, ensure_ascii=False, indent=1) + ";\n",
               encoding="utf-8")
print("задач:", len(tasks))
for t in tasks:
    print(f"  {t['n']}. {t['title']}: команда {len(t['cmd'])} зн., ждём {len(t['expect'])}")
