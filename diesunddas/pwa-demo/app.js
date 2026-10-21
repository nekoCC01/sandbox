// Service Worker registrieren (relativer Pfad -> Scope ist dieser Ordner)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => setText('sw', 'aktiv ✅'))
    .catch((err) => setText('sw', 'Fehler: ' + err.message));
} else {
  setText('sw', 'nicht unterstützt');
}

// Läuft die App vom Homescreen (standalone) oder im Browser?
const standalone = window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;
setText('mode', standalone ? 'Homescreen-App 📱' : 'Browser-Tab 🌐');
document.getElementById('hint').hidden = standalone;

// Online/Offline-Status
function updateOnline() {
  setText('online', navigator.onLine ? 'online' : 'offline');
}
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);
updateOnline();

// Zähler, der lokal gespeichert bleibt
let count = Number(localStorage.getItem('count') || 0);
setText('count', count);
document.getElementById('btn').addEventListener('click', () => {
  count++;
  localStorage.setItem('count', count);
  setText('count', count);
});

function setText(id, text) {
  document.getElementById(id).textContent = text;
}
