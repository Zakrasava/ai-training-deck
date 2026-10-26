// QR-код без интернета: байтовый режим, уровень коррекции M, версии 1–10 (до ~200 байт).
// QR.svg(text) → строка <svg>. Используется на слайде 24 для ссылки из data.js → botLink.
window.QR = (() => {
  // [ecc на блок, блоков в группе 1, данных в блоке 1, блоков в группе 2, данных в блоке 2] для уровня M
  const EC = [null, [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0], [24, 2, 43, 0, 0],
    [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44]];
  const AL = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  const EXP = new Array(512), LOG = new Array(256);
  for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  function rsRem(data, n) {
    let g = [1];
    for (let i = 0; i < n; i++) { const ng = new Array(g.length + 1).fill(0); for (let j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= mul(g[j], EXP[i]); } g = ng; }
    const r = data.concat(new Array(n).fill(0));
    for (let i = 0; i < data.length; i++) { const c = r[i]; if (c) for (let j = 0; j < g.length; j++) r[i + j] ^= mul(g[j], c); }
    return r.slice(data.length);
  }

  function matrix(text) {
    const bytes = [...new TextEncoder().encode(text)];
    let ver = 1;
    for (; ver <= 10; ver++) { const e = EC[ver]; if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= (e[1] * e[2] + e[3] * e[4]) * 8) break; }
    if (ver > 10) throw new Error('QR: слишком длинная строка');
    const e = EC[ver], dataCw = e[1] * e[2] + e[3] * e[4], size = 17 + 4 * ver;
    // данные
    const bits = [], put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, dataCw * 8 - bits.length)); while (bits.length % 8) bits.push(0);
    const cw = []; for (let i = 0; i < bits.length; i += 8) { let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; cw.push(v); }
    for (let p = 0xec; cw.length < dataCw; p ^= 0xec ^ 0x11) cw.push(p);
    const blocks = [], ecb = []; let k = 0;
    for (let g = 0; g < 2; g++) for (let b = 0; b < e[1 + g * 2]; b++) { const d = cw.slice(k, k + e[2 + g * 2]); k += d.length; blocks.push(d); ecb.push(rsRem(d, e[0])); }
    const out = [], maxLen = Math.max(...blocks.map(b => b.length));
    for (let i = 0; i < maxLen; i++) blocks.forEach(b => { if (i < b.length) out.push(b[i]); });
    for (let i = 0; i < e[0]; i++) ecb.forEach(b => out.push(b[i]));
    // служебные узоры
    const m = Array.from({ length: size }, () => new Array(size).fill(0));
    const f = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (x, y, v) => { m[y][x] = v ? 1 : 0; f[y][x] = true; };
    for (const [fx, fy] of [[0, 0], [size - 7, 0], [0, size - 7]])
      for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
        const x = fx + dx, y = fy + dy; if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
        set(x, y, inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)));
      }
    for (let i = 8; i < size - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const al = AL[ver];
    for (const cy of al) for (const cx of al) {
      if ((cx === 6 && cy === 6) || (cx === 6 && cy === al[al.length - 1]) || (cx === al[al.length - 1] && cy === 6)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    for (let i = 0; i < 9; i++) { f[8][i] = f[i][8] = true; }
    for (let i = 0; i < 8; i++) { f[8][size - 1 - i] = f[size - 1 - i][8] = true; }
    set(8, size - 8, 1);
    if (ver >= 7) for (let i = 0; i < 18; i++) { const a = size - 11 + (i % 3), b = Math.floor(i / 3); f[b][a] = f[a][b] = true; }
    // размещение данных змейкой
    let bi = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!f[y][x] && bi < out.length * 8) { m[y][x] = (out[bi >>> 3] >>> (7 - (bi & 7))) & 1; bi++; }
      }
    }
    const MASK = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0];
    const fmt = (mm, mask) => {
      const data = (0 << 3) | mask; let rem = data;               // уровень M = 00
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const b = ((data << 10) | rem) ^ 0x5412, bit = i => (b >>> i) & 1;
      for (let i = 0; i <= 5; i++) mm[i][8] = bit(i);
      mm[7][8] = bit(6); mm[8][8] = bit(7); mm[8][7] = bit(8);
      for (let i = 9; i < 15; i++) mm[8][14 - i] = bit(i);
      for (let i = 0; i < 8; i++) mm[8][size - 1 - i] = bit(i);
      for (let i = 8; i < 15; i++) mm[size - 15 + i][8] = bit(i);
      mm[size - 8][8] = 1;
      if (ver >= 7) {
        let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
        const vb = (ver << 12) | r;
        for (let i = 0; i < 18; i++) { const v = (vb >>> i) & 1, a = size - 11 + (i % 3), c = Math.floor(i / 3); mm[c][a] = v; mm[a][c] = v; }
      }
    };
    const penalty = mm => {
      let p = 0, dark = 0;
      const line = get => { for (let a = 0; a < size; a++) { let run = 1; for (let b = 1; b <= size; b++) { if (b < size && get(a, b) === get(a, b - 1)) run++; else { if (run >= 5) p += run - 2; run = 1; } } } };
      line((a, b) => mm[a][b]); line((a, b) => mm[b][a]);
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = mm[y][x]; if (c === mm[y][x + 1] && c === mm[y + 1][x] && c === mm[y + 1][x + 1]) p += 3; }
      const pat = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], tap = pat.slice().reverse();
      const hit = get => { for (let a = 0; a < size; a++) for (let b = 0; b + 11 <= size; b++) { let s1 = true, s2 = true; for (let k2 = 0; k2 < 11; k2++) { const v = get(a, b + k2); if (v !== pat[k2]) s1 = false; if (v !== tap[k2]) s2 = false; } if (s1) p += 40; if (s2) p += 40; } };
      hit((a, b) => mm[a][b]); hit((a, b) => mm[b][a]);
      mm.forEach(r => r.forEach(v => (dark += v)));
      p += Math.floor(Math.abs((dark * 20) / (size * size) - 10)) * 10;
      return p;
    };
    let best = null, bestP = Infinity;
    for (let mask = 0; mask < 8; mask++) {
      const mm = m.map((r, y) => r.map((v, x) => (f[y][x] ? v : v ^ (MASK[mask](x, y) ? 1 : 0))));
      fmt(mm, mask);
      const p = penalty(mm); if (p < bestP) { bestP = p; best = mm; }
    }
    return best;
  }

  function svg(text, color = '#18191B', bg = 'transparent') {
    const m = matrix(text), n = m.length, q = 4, s = n + q * 2;
    let d = '';
    m.forEach((r, y) => r.forEach((v, x) => { if (v) d += `M${x + q} ${y + q}h1v1h-1z`; }));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" role="img" aria-label="QR-код"><rect width="${s}" height="${s}" fill="${bg}"/><path d="${d}" fill="${color}"/></svg>`;
  }
  return { matrix, svg };
})();
