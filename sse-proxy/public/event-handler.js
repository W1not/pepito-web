const source = new EventSource('/events'); // se conecta a tu backend

function formatDate(date) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

source.onmessage = function(event) {
  const log = document.getElementById("event-log");
  const data = JSON.parse(event.data);

  const date = new Date(data.time * 1000);
  const formattedTime = formatDate(date);

  const p = document.createElement("p");
  p.textContent = `Evento: ${data.event} ,  Hora: ${formattedTime}`;
  log.prepend(p);
};

source.onerror = function(err) {
  console.error("Error en SSE:", err);
};
