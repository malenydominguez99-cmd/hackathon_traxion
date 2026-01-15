let map = L.map('map').setView([19.43, -99.13], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let points = [];
let line;


map.on('click', e => {
    let marker = L.marker(e.latlng).addTo(map);
    points.push(e.latlng);
    document.getElementById("stops").textContent = points.length;
    
    if (points.length > 1) {
        if (line) map.removeLayer(line);
        line = L.polyline(points, {
            color: '#2f3e9e',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
        document.getElementById("distance").textContent = 
            ((points.length - 1) * 5).toFixed(1) + " km";
    }
});

map.on('click', e => {
    let marker = L.marker(e.latlng).addTo(map);
    points.push(e.latlng);
    document.getElementById("stops").textContent = points.length;
    
    if (points.length > 1) {
        if (line) map.removeLayer(line);
        line = L.polyline(points, {
            color: '#2f3e9e',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
        document.getElementById("distance").textContent = 
            ((points.length - 1) * 5).toFixed(1) + " km";
    }
});

let chatState = "INIT";
let viaje = { origen: "", destino: "" };
const chatContainer = document.getElementById("chat");
