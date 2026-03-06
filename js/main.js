const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
let backgrounds = [];
let currentBg = "";
let currentSignature = null; // object from signatures.json

async function loadAssets() {
  try {
    // carregar como array
    backgrounds = await fetch("assets/lib/signatures.json").then((r) =>
      r.json(),
    );
    const sel = document.getElementById("bgSelect");
    if (sel && backgrounds.length) {
      backgrounds.forEach((signature) => {
        const opt = document.createElement("option");
        opt.value = signature.bg.file; // armazenamos o nome do arquivo
        opt.textContent = signature.empresa;
        sel.appendChild(opt);
      });
      currentBg = backgrounds[0].bg.file || "";
      currentSignature = backgrounds[0];

      sel.addEventListener("change", (e) => {
        const chosenFile = e.target.value;
        const found = backgrounds.find((item) => item.bg.file === chosenFile);
        if (found) {
          currentBg = found.bg.file;
          currentSignature = found;
          updateBackground();
        }
      });
    } else if (backgrounds.length) {
      currentBg = backgrounds[0].bg.file || "";
      currentSignature = backgrounds[0];
    }
  } catch (e) {
    console.warn("Falha ao carregar lista de fundos", e);
  } finally {
    updateBackground();
  }
}

function updateCanvasSize() {
  if (currentSignature && Array.isArray(currentSignature.bg.dimension)) {
    const [w, h] = currentSignature.bg.dimension;
    if (w > 0 && h > 0) {
      canvas.width = w;
      canvas.height = h;
    }
  }
}

function updateBackground() {
  if (currentBg) {
    // ajustar tamanho antes do desenho
    updateCanvasSize();
    // usar caminho relativo para suporte via file://
    backgroundImage.src = "assets/images/" + currentBg;
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  let name = document.getElementById("nameInput").value.trim();
  let title = document.getElementById("titleInput").value.trim();
  if (!name) name = document.getElementById("nameInput").placeholder;
  if (!title) title = document.getElementById("titleInput").placeholder;

  // ler estilos básicos (font-family/size) dos spans ocultos
  const nameStyle = window.getComputedStyle(
    document.getElementById("styleName"),
  );
  const titleStyle = window.getComputedStyle(
    document.getElementById("styleTitle"),
  );

  // determinar cor e posição usando os dados do JSON, com fallback
  const nameColor = currentSignature.name.color;
  const titleColor = currentSignature.title.color;

  const namePos = currentSignature.name.position;
  const titlePos = currentSignature.title.position;

  const fontFamily = currentSignature.font;

  ctx.fillStyle = nameColor;
  ctx.font = `${nameStyle.fontSize} ${fontFamily}`;
  ctx.fillText(name, namePos[0], namePos[1]);

  ctx.fillStyle = titleColor;
  ctx.font = `${titleStyle.fontSize} ${titleStyle.fontFamily}`;
  ctx.fillText(title.toUpperCase(), titlePos[0], titlePos[1]);
}

backgroundImage.crossOrigin = "anonymous";
backgroundImage.onload = redraw;

document.getElementById("signatureForm").addEventListener("input", redraw);

document.getElementById("exportButton").addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = dataURL;

  // montar nome do arquivo com informações atuais
  const company = backgrounds.find((b) => b.file === currentBg)?.name || "";
  const person =
    document.getElementById("nameInput").value.trim() ||
    document.getElementById("nameInput").placeholder;
  // remover espaços excessivos e caracteres inválidos
  const safe = (str) => str.replace(/[\\/:*?"<>|]/g, "").trim();
  const filename = `Assinatura ${safe(company)} ${safe(person)}.jpg`.replace(
    /\s+/g,
    " ",
  );

  link.download = filename;
  link.click();
});

loadAssets();
