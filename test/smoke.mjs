// Satu smoke check untuk dynatoast. Jalankan: node test/smoke.mjs
// Butuh chromium di PATH (atau set CHROME_BIN). Tanpa dependency npm.
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const lib = dirname(
  fileURLToPath(new URL("../lib/dynatoast.js", import.meta.url)),
);
const bin = process.env.CHROME_BIN ?? "chromium";

// Halaman uji: memuat CSS + JS library, memicu dua notify() beruntun (<100ms),
// lalu menuliskan hasil + computed style ke #out supaya bisa di-dump.
const page = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="${lib}/dynatoast.css">
<script src="${lib}/dynatoast.js"></script>
</head><body>
<pre id="out"></pre>
<script>
const island = new DynamicIsland({ duration: 5000, position: "top-center" });
island.notify({ type: "success", title: "PERTAMA", message: "harus kalah" });
island.notify({ type: "error", title: "KEDUA", message: "harus menang" });
let loadingVis;
setTimeout(() => {
  // Regression: countdown harus hilang SINKRON saat pindah ke loading,
  // bukan menunggu timeout 100ms + transisi visibility.
  island.notify({ type: "loading", title: "LOAD", message: "x" });
  loadingVis = getComputedStyle(document.querySelector("#di-close")).visibility;
  // kembalikan state akhir untuk assertion lain
  island.notify({ type: "error", title: "KEDUA", message: "harus menang" });
  setTimeout(() => {
  const cs = (el) => getComputedStyle(el);
  const title = document.querySelector("#di-title");
  const msg = document.querySelector("#di-msg");
  const text = document.querySelector(".di-text, .di-content > div > div:nth-child(2)");
  const icon = document.querySelector("#di-icon > div");
  const close = document.querySelector("#di-close");
  document.querySelector("#out").textContent = "RESULT:" + JSON.stringify({
    title: title.innerText,
    msg: msg.innerText,
    iconClass: icon.className,
    titleFontSize: cs(title).fontSize,
    msgFontSize: cs(msg).fontSize,
    iconBg: cs(icon).backgroundColor,
    iconPad: cs(icon).padding,
    textOverflow: cs(text).overflow,
    titleEllipsis: cs(title).textOverflow,
    closeIsRightmost: close.offsetLeft > text.offsetLeft,
    tailwindClassesLeft: document.querySelector(".di-content").innerHTML.includes("flex-shrink-0"),
    loadingVis,
  });
  });
}, 400);
</script></body></html>`;

const dir = mkdtempSync(join(tmpdir(), "dynatoast-"));
const file = join(dir, "t.html");
writeFileSync(file, page);

const dom = execFileSync(
  bin,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--virtual-time-budget=3000",
    "--dump-dom",
    `file://${file}`,
  ],
  { encoding: "utf8" },
);

const raw = dom.match(/RESULT:(.*?)<\/pre>/s)?.[1];
assert.ok(raw, `tidak ada hasil dari browser. dom: ${dom.slice(0, 400)}`);
const r = JSON.parse(raw);

// [D] race fix: notify() kedua yang harus menang, bukan callback pertama.
assert.equal(
  r.title,
  "KEDUA",
  "notify() pertama menimpa yang kedua (race belum fix)",
);
assert.equal(r.msg, "harus menang");
assert.equal(
  r.iconClass,
  "di-icon-error",
  "ikon tidak mengikuti notify() terakhir",
);
assert.equal(
  r.loadingVis,
  "hidden",
  "countdown tidak hilang sinkron saat notify loading",
);

// [A] markup tanpa class Tailwind, styling harus tetap datang dari dynatoast.css.
assert.equal(
  r.tailwindClassesLeft,
  false,
  "masih ada class Tailwind di .di-content",
);
assert.equal(r.titleFontSize, "14px");
assert.equal(r.msgFontSize, "12px");
assert.equal(r.iconBg, "rgb(244, 63, 94)", "ikon error kehilangan warna latar");
assert.equal(r.iconPad, "8px", "padding ikon hilang setelah dedup");
assert.equal(r.textOverflow, "hidden");
assert.equal(r.titleEllipsis, "ellipsis");
assert.equal(
  r.closeIsRightmost,
  true,
  "tombol close tidak lagi di kanan (margin-left:auto)",
);

console.log("smoke OK:", JSON.stringify(r, null, 2));
