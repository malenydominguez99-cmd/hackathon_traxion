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

  if (
    t.includes("vehiculo") ||
    t.includes("vehículo") ||
    t.includes("camion") ||
    t.includes("camión")
  ) {
    bot(
      `🚛 Vehículo recomendado basado en tu ruta. ${
        points.length > 0
          ? "Con " +
            points.length +
            " paradas, considera un vehículo de carga media."
          : "Agrega paradas para una mejor recomendación."
      }`
    );
    return;
  }

  if (
    t.includes("distancia") ||
    t.includes("kilometros") ||
    t.includes("kilómetros")
  ) {
    const dist = document.getElementById("distance").textContent;
    bot(
      `📏 Distancia total de tu ruta: ${dist}. ${
        points.length > 1
          ? "Tiempo estimado: " + points.length * 12 + " minutos."
          : "Agrega más paradas para calcular."
      }`
    );
    return;
  }

  if (t.includes("paradas") || t.includes("cuantas")) {
    bot(
      `📍 Tienes ${points.length} parada${
        points.length !== 1 ? "s" : ""
      } agregada${points.length !== 1 ? "s" : ""}. ${
        points.length === 0
          ? "Haz clic en el mapa para agregar."
          : "¿Deseas optimizar la ruta?"
      }`
    );
    return;
  }

  if (
    t.includes("tiempo") ||
    t.includes("duracion") ||
    t.includes("duración")
  ) {
    const tiempo = points.length * 12;
    bot(
      `⏱️ Tiempo estimado de ruta: ${tiempo} minutos (${points.length} paradas × 12 min promedio).`
    );
    return;
  }

  if (t.includes("optimizar") || t.includes("mejorar")) {
    if (points.length < 2) {
      bot(
        "⚠️ Necesitas al menos 2 paradas para optimizar. Agrega más ubicaciones."
      );
    } else {
      bot(
        "✨ Analizando tu ruta... Las paradas se reorganizarán de forma eficiente según prioridad y distancia."
      );
    }
    return;
  }

  if (t.includes("limpiar") || t.includes("borrar") || t.includes("eliminar")) {
    bot(
      "🗑️ Para limpiar la ruta, recarga la página o continúa agregando nuevas paradas."
    );
    return;
  }

  if (
    t.includes("gasolina") ||
    t.includes("combustible") ||
    t.includes("costo")
  ) {
    const dist = parseFloat(document.getElementById("distance").textContent);
    if (dist > 0) {
      const costoEstimado = (dist * 2.5).toFixed(2);
      bot(`⛽ Costo estimado de combustible: $${costoEstimado} MXN.`);
    } else {
      bot("⛽ Agrega paradas para calcular el costo de combustible.");
    }
    return;
  }

  if (
    t.includes("consejos") ||
    t.includes("tips") ||
    t.includes("recomendaciones")
  ) {
    const tips = [
      "💡 Agrupa entregas en la misma zona para ahorrar tiempo.",
      "💡 Las paradas de alta prioridad se optimizan primero.",
      "💡 Revisa el tráfico antes de salir.",
      "💡 Planea descansos en rutas largas.",
    ];
    bot(tips[Math.floor(Math.random() * tips.length)]);
    return;
  }

  if (t.includes("gracias") || t.includes("genial") || t.includes("perfecto")) {
    bot("😊 ¡De nada! Estoy aquí para ayudarte.");
    return;
  }

  if (
    t.includes("adios") ||
    t.includes("adiós") ||
    t.includes("chao") ||
    t.includes("hasta luego")
  ) {
    bot("👋 ¡Hasta pronto! Buen viaje.");
    return;
  }

  switch (chatState) {
    case "INIT":
      if (t.includes("hola")) {
        bot(
          "👋 ¡Hola! ¿Quieres que te ayude a trazar tu ruta? Responde 'sí' para comenzar."
        );
      } else if (t === "si" || t === "sí") {
        chatState = "ORIGEN";
        bot("📍 Perfecto, ¿desde dónde sales? (ciudad, dirección o ubicación)");
      } else if (t === "no") {
        bot(
          "👌 Sin problema. Escribe 'ayuda' si necesitas saber qué puedo hacer por ti."
        );
      } else {
        bot(
          "❓ No entendí. Responde 'sí' para planear una ruta, o escribe 'ayuda' para ver qué puedo hacer."
        );
      }
      break;

    case "ORIGEN":
      viaje.origen = t;
      chatState = "DESTINO";
      bot(`📍 Saliendo de: ${t}`);
      bot("➡️ ¿A dónde te diriges?");
      break;

    case "DESTINO":
      viaje.destino = t;
      chatState = "OPCIONES";
      bot(`🎯 Destino: ${t}`);
      bot(`📊 Ruta: ${viaje.origen} → ${viaje.destino}`);
      bot(
        "¿Qué información necesitas? Opciones:\n• clima\n• tráfico\n• ambos\n• ninguno"
      );
      break;

    case "OPCIONES":
      if (
        (t.includes("clima") && t.includes("trafico")) ||
        t.includes("tráfico") ||
        t === "ambos"
      ) {
        bot("🌤️ Clima: Soleado 24°C, viento ligero del norte 12 km/h");
        bot(
          "🚦 Tráfico: Fluido en la ruta. Tiempo estimado: " +
            (points.length * 12 || 45) +
            " min"
        );
        chatState = "PARADAS";
        bot("📍 ¿Tienes paradas intermedias? (sí / no)");
      } else if (t.includes("clima")) {
        bot(
          "🌤️ Clima: Soleado 24°C, viento ligero del norte 12 km/h. ¡Buen día para viajar!"
        );
        chatState = "PARADAS";
        bot("📍 ¿Tienes paradas intermedias? (sí / no)");
      } else if (t.includes("trafico") || t.includes("tráfico")) {
        bot(
          "🚦 Tráfico: Fluido en la ruta principal. Tiempo estimado: " +
            (points.length * 12 || 45) +
            " min"
        );
        chatState = "PARADAS";
        bot("📍 ¿Tienes paradas intermedias? (sí / no)");
      } else if (t === "ninguno" || t === "no") {
        chatState = "PARADAS";
        bot("👌 Entendido. 📍 ¿Tienes paradas intermedias? (sí / no)");
      } else {
        bot("⚠️ Opciones: clima, tráfico, ambos o ninguno");
      }
      break;

    case "PARADAS":
      if (t === "si" || t === "sí") {
        chatState = "CONTADOR_PARADAS";
        bot("📝 ¿Cuántas paradas tienes? (número)");
      } else if (t === "no") {
        chatState = "CERRAR";
        bot("✅ Ruta directa sin paradas intermedias.");
        bot("🚛 ¿Deseas cerrar el viaje? (sí / no)");
      } else {
        bot("⚠️ Responde sí o no");
      }
      break;

    case "CONTADOR_PARADAS":
      const numParadas = parseInt(t);
      if (!isNaN(numParadas) && numParadas > 0) {
        viaje.numParadas = numParadas;
        chatState = "CERRAR";
        bot(
          `📍 Entendido, ${numParadas} parada${
            numParadas > 1 ? "s" : ""
          } intermedia${numParadas > 1 ? "s" : ""}.`
        );
        bot(`💡 Usa el mapa para agregarlas haciendo clic.`);
        bot("✅ ¿Deseas cerrar el viaje? (sí / no)");
      } else {
        bot("⚠️ Por favor ingresa un número válido de paradas.");
      }
      break;

    case "CERRAR":
      if (t === "si" || t === "sí") {
        chatState = "INIT";
        bot("🧳 Viaje cerrado exitosamente.");
        bot(
          `📋 Resumen: ${viaje.origen} → ${viaje.destino}${
            viaje.numParadas ? ` (${viaje.numParadas} paradas)` : ""
          }`
        );
        bot("¿Deseas planear otro viaje? (sí / no)");
        viaje = { origen: "", destino: "" };
      } else if (t === "no") {
        bot(
          "🔁 Perfecto, seguimos con este viaje. ¿En qué más te puedo ayudar? (escribe 'ayuda' para opciones)"
        );
      } else {
        bot("⚠️ Responde sí o no");
      }
      break;
  }
}
