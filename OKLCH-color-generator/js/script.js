function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToOklch(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l / 255);
  const m_ = Math.cbrt(m / 255);
  const s_ = Math.cbrt(s / 255);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  const h = (Math.atan2(b_, a) * 180) / Math.PI;

  return [L * 100, C * 100, (h + 360) % 360];
}

function oklchToRgb(L, C, h) {
  L /= 100;
  C /= 100;
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_ * 255;
  const m = m_ * m_ * m_ * 255;
  const s = s_ * s_ * s_ * 255;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_out = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b_out))),
  ];
}

function generateColors() {
  const hexInput = document.getElementById("hexInput").value;
  const [r, g, b] = hexToRgb(hexInput);
  const [L, C, h] = rgbToOklch(r, g, b);

  const colorContainer = document.getElementById("colorContainer");
  colorContainer.innerHTML = "";

  for (let i = 0; i < 31; i++) {
    const newL = 40 + (i * (100 - 40)) / 30;
    const [newR, newG, newB] = oklchToRgb(newL, C, h);
    const newHex = `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = newHex;
    colorBox.style.color = newL > 70 ? "black" : "white";
    colorBox.innerHTML = `
                    oklch(${newL.toFixed(1)}% ${C.toFixed(1)} ${h.toFixed(
      1
    )})<br>
                    ${newHex}
                    <span class="copy-icon" onclick="copyToClipboard('${newHex}', this)">📋</span>
                `;
    colorContainer.appendChild(colorBox);
  }
}

function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = element.textContent;
    element.textContent = "✓";
    setTimeout(() => {
      element.textContent = originalText;
    }, 1000);
  });
}
