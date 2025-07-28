import { useEffect, useState } from 'react';

function EventLog() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const source = new EventSource('/events'); // usa el proxy si lo configuraste

    const formatDate = (date) => {
      const pad = n => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
             `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const date = new Date(data.time * 1000);
        const formattedTime = formatDate(date);

        const newEvent = {
          event: data.event,
          time: formattedTime,
        };

        setEvents(prev => [newEvent, ...prev]);
      } catch (e) {
        console.warn('Evento no válido:', event.data);
      }
    };

    source.onerror = (err) => {
      console.error('Error en SSE:', err);
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <div>
      <h2>Eventos en tiempo real</h2>
      <div id="event-log">
        {events.map((e, index) => (
          <p key={index}>
            Evento: {e.event} , Hora: {e.time}
          </p>
        ))}
      </div>
    </div>
  );
}

export default EventLog;
