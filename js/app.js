// AqSu — интерактивті су деңгейі симуляторы
let level = 42;
let pump = true;
let automatic = true;
let timer = null;

const byId = (id) => document.getElementById(id);
const ui = {
  water: byId("water"), level: byId("level"), range: byId("rangeValue"),
  slider: byId("levelSlider"), pump: byId("pumpState"), mode: byId("modeState"),
  pumpIcon: byId("pumpIcon"), message: byId("simMessage"), log: byId("eventLog"),
  auto: byId("autoBtn"), manual: byId("manualBtn"), toggle: byId("pumpBtn"),
  fill: byId("fillBtn")
};

function addLog(message) {
  const entry = document.createElement("p");
  entry.textContent = `${new Date().toLocaleTimeString("kk-KZ")} · ${message}`;
  ui.log.prepend(entry);
  while (ui.log.children.length > 20) ui.log.lastElementChild.remove();
}

function render() {
  const previousPump = pump;
  if (automatic) {
    if (level >= 95) pump = false;
    else if (level <= 15) pump = true;
  }
  if (previousPump !== pump) addLog(pump ? "Төменгі шек: сорғы қосылды." : "Жоғарғы шек: сорғы тоқтады.");

  ui.water.style.height = `${level}%`;
  ui.level.textContent = `${level}%`;
  ui.range.textContent = `${level}%`;
  ui.slider.value = level;
  ui.pump.textContent = pump ? "Қосулы" : "Өшірулі";
  ui.pump.className = pump ? "state-on" : "state-off";
  ui.mode.textContent = automatic ? "Автоматты" : "Қолмен";
  ui.pumpIcon.classList.toggle("running", pump);

  if (automatic) {
    ui.message.textContent = pump
      ? "Сорғы жұмыс істеп тұр. Жоғарғы шекке жеткенде автоматты тоқтайды."
      : "Сорғы тоқтады. Су 15%-ға дейін азайғанда қайта қосылады.";
  } else {
    ui.message.textContent = pump
      ? "Қолмен басқару: сорғы қосулы. Су деңгейін бақылаңыз."
      : "Қолмен басқару: сорғы өшірулі.";
  }
  if (level >= 100 && !automatic && pump) ui.message.textContent = "Ескерту: ыдыс толды! Сорғыны қолмен өшіріңіз.";
}

function stopFill() {
  clearInterval(timer);
  timer = null;
  ui.fill.textContent = "▶ Толтыруды бастау";
}

ui.slider.addEventListener("input", (event) => {
  level = Number(event.target.value);
  render();
});

ui.auto.addEventListener("click", () => {
  automatic = true;
  ui.auto.classList.add("selected");
  ui.manual.classList.remove("selected");
  ui.toggle.hidden = true;
  addLog("Автоматты режим таңдалды.");
  render();
});

ui.manual.addEventListener("click", () => {
  automatic = false;
  ui.manual.classList.add("selected");
  ui.auto.classList.remove("selected");
  ui.toggle.hidden = false;
  addLog("Қолмен басқару таңдалды.");
  render();
});

ui.toggle.addEventListener("click", () => {
  pump = !pump;
  addLog(pump ? "Сорғы қолмен қосылды." : "Сорғы қолмен өшірілді.");
  render();
});

ui.fill.addEventListener("click", () => {
  if (timer) {
    stopFill();
    addLog("Модель кідіртілді.");
    return;
  }
  if (!pump) {
    addLog("Сорғы өшірулі. Суды жұмсаңыз немесе қолмен қосыңыз.");
    return;
  }
  addLog("Демонстрациялық толтыру басталды.");
  ui.fill.textContent = "Ⅱ Кідірту";
  timer = setInterval(() => {
    if (!pump) {
      stopFill();
      return;
    }
    level = Math.min(100, level + 1);
    render();
    if (level >= 100 || !pump) stopFill();
  }, 180);
});

byId("drainBtn").addEventListener("click", () => {
  level = Math.max(0, level - 20);
  addLog(`Су жұмсалды. Деңгей: ${level}%.`);
  render();
});

byId("resetBtn").addEventListener("click", () => {
  stopFill();
  level = 42;
  pump = true;
  automatic = true;
  ui.auto.classList.add("selected");
  ui.manual.classList.remove("selected");
  ui.toggle.hidden = true;
  ui.log.replaceChildren();
  addLog("Модель бастапқы күйге қайтарылды.");
  render();
});

const costs = [
  ["Су деңгейін өлшейтін сенсор", 1500],
  ["Су сорғысы (5–12 V)", 3000],
  ["Реле модулі", 1200],
  ["Қуат көзі", 2500],
  ["Макет тақша және сымдар", 1000],
  ["Шлангалар мен ыдыс", 800],
  ["Қосымша материалдар", 1000]
];

const costList = byId("costList");
for (const [name, price] of costs) {
  const row = document.createElement("div");
  row.className = "cost-row";
  const item = document.createElement("span");
  const amount = document.createElement("span");
  item.textContent = name;
  amount.textContent = `${price.toLocaleString("kk-KZ")} ₸`;
  row.append(item, amount);
  costList.append(row);
}

byId("printBtn").addEventListener("click", () => window.print());
render();
