import React, { useState } from 'react';

interface EventMonitorProps {
  sdk: any;
}

interface EventLog {
  id: string;
  contractId: string;
  eventName: string;
  timestamp: number;
  data: any;
}

export function EventMonitor({ sdk }: EventMonitorProps) {
  const [events, setEvents] = useState<EventLog[]>([]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Event Monitor</h2>
      
      <div style={{ marginTop: '20px' }}>
        {events.length === 0 ? (
          <p style={{ color: '#666' }}>No events captured yet</p>
        ) : (
          <div>
            {events.map((event) => (
              <div key={event.id} style={{ padding: '10px', marginBottom: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                <p><strong>{event.contractId}</strong> - {event.eventName}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{new Date(event.timestamp).toLocaleString()}</p>
                <pre style={{ fontSize: '12px' }}>{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
