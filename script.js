const paletteEl = document.getElementById("palette");
const btn = document.getElementById("generate");

// track each swatch’s state
let swatches = [];

// generate a single random hex color
function randomHex() {
    return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
}

// build or refresh swatches array
function buildPalette(count = 5) {
    if (swatches.length === 0) {
        // first time: create all
        swatches = Array.from({ length: count }, () => ({ hex: randomHex(), locked: false }));
    } else {
        // subsequent: only replace unlocked
        swatches = swatches.map(s => s.locked ? s : { hex: randomHex(), locked: false });
    }
    renderPalette();
}

// render DOM
function renderPalette() {
    paletteEl.innerHTML = "";
    swatches.forEach((s, i) => {
        const div = document.createElement("div");
        div.className = "swatch" + (s.locked ? " locked" : "");
        div.style.background = s.hex;
        div.textContent = s.hex;
        // click to copy
        div.addEventListener("click", () => {
            navigator.clipboard.writeText(s.hex);
            div.textContent = "Copied!";
            setTimeout(() => div.textContent = s.hex, 800);
        });
        // right‑click to toggle lock
        div.addEventListener("contextmenu", e => {
            e.preventDefault();
            swatches[i].locked = !swatches[i].locked;
            div.classList.toggle("locked");
        });
        paletteEl.appendChild(div);
    });
}

const copyAllBtn = document.getElementById("copy-all");
copyAllBtn.addEventListener("click", () => {
    const allHex = swatches.map(s => s.hex).join(", ");
    navigator.clipboard.writeText(allHex);
    copyAllBtn.textContent = "Copied!";
    setTimeout(() => copyAllBtn.textContent = "Copy All", 800);
});
// (optional) — to fetch from an API instead:
// async function fetchPalette() {
//   const res = await fetch("https://www.colr.org/json/colors/random/5");
//   const data = await res.json();
//   swatches = data.colors.map(c => ({ hex: `#${c.hex}`, locked: false }));
//   renderPalette();
// }

btn.addEventListener("click", () => buildPalette());

/* initialize */
buildPalette();
