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

  if (t.includes("vehiculo") || t.includes("vehículo") || t.includes("camion") || t.includes("camión")) {
    bot(`🚛 Vehículo recomendado basado en tu ruta. ${points.length > 0 ? 'Con ' + points.length + ' paradas, considera un vehículo de carga media.' : 'Agrega paradas para una mejor recomendación.'}`);
    return;
}

if (t.includes("distancia") || t.includes("kilometros") || t.includes("kilómetros")) {
    const dist = document.getElementById('distance').textContent;
    bot(`📏 Distancia total de tu ruta: ${dist}. ${points.length > 1 ? 'Tiempo estimado: ' + (points.length * 12) + ' minutos.' : 'Agrega más paradas para calcular.'}`);
    return;
}

if (t.includes("paradas") || t.includes("cuantas")) {
    bot(`📍 Tienes ${points.length} parada${points.length !== 1 ? 's' : ''} agregada${points.length !== 1 ? 's' : ''}. ${points.length === 0 ? 'Haz clic en el mapa para agregar.' : '¿Deseas optimizar la ruta?'}`);
    return;
}

if (t.includes("tiempo") || t.includes("duracion") || t.includes("duración")) {
    const tiempo = points.length * 12;
    bot(`⏱️ Tiempo estimado de ruta: ${tiempo} minutos (${points.length} paradas × 12 min promedio).`);
    return;
}

if (t.includes("optimizar") || t.includes("mejorar")) {
    if (points.length < 2) {
        bot("⚠️ Necesitas al menos 2 paradas para optimizar. Agrega más ubicaciones.");
    } else {
        bot("✨ Analizando tu ruta... Las paradas se reorganizarán de forma eficiente según prioridad y distancia.");
    }
    return;
}

if (t.includes("limpiar") || t.includes("borrar") || t.includes("eliminar")) {
    bot("🗑️ Para limpiar la ruta, recarga la página o continúa agregando nuevas paradas.");
    return;
}

if (t.includes("gasolina") || t.includes("combustible") || t.includes("costo")) {
    const dist = parseFloat(document.getElementById('distance').textContent);
    if (dist > 0) {
        const costoEstimado = (dist * 2.5).toFixed(2);
        bot(`⛽ Costo estimado de combustible: $${costoEstimado} MXN.`);
    } else {
        bot("⛽ Agrega paradas para calcular el costo de combustible.");
    }
    return;
}

}
