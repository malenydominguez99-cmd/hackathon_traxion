let map = L.map("map").setView([19.43, -99.13], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let points = [];
let line;

map.on("click", (e) => {
  let marker = L.marker(e.latlng).addTo(map);
  points.push(e.latlng);
  document.getElementById("stops").textContent = points.length;

  if (points.length > 1) {
    if (line) map.removeLayer(line);
    line = L.polyline(points, {
      color: "#2f3e9e",
      weight: 3,
      opacity: 0.7,
    }).addTo(map);
    document.getElementById("distance").textContent =
      ((points.length - 1) * 5).toFixed(1) + " km";
  }
});

let chatState = "INIT";
let viaje = { origen: "", destino: "" };
const chatContainer = document.getElementById("chat");

function bot(m) {
  let d = document.createElement("div");
  d.className = "msg bot";
  d.textContent = m;
  chatContainer.appendChild(d);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function user(m) {
  let d = document.createElement("div");
  d.className = "msg user";
  d.textContent = m;
  chatContainer.appendChild(d);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

bot("👋 Hola, ¿quieres que te ayude a trazar tu ruta? (sí / no)");

function send() {
  let i = document.getElementById("msg");
  const t = i.value.trim().toLowerCase();
  if (!t) return;

  user(i.value.trim());
  i.value = "";

  setTimeout(() => handleChat(t), 600);
}

function handleChat(t) {
  if (t.includes("ayuda") || t.includes("que puedes hacer")) {
    bot(
      "💡 Puedo ayudarte con:\n• Planear rutas de origen a destino\n• Información de clima y tráfico\n• Optimizar tus paradas\n• Calcular distancias\n• Sugerencias de vehículos\n¿Qué necesitas?"
    );
    return;
  }

  if (t.includes("clima") && chatState !== "CLIMA") {
    bot("🌤️ Clima actual: Soleado 24°C, viento ligero. Ideal para entregas.");
    return;
  }

  if (t.includes("trafico") || t.includes("tráfico")) {
    bot(
      "🚦 Tráfico en tiempo real: Fluido en la mayoría de zonas. Se recomienda evitar la zona centro entre 2-4 PM."
    );
    return;
  }
}
