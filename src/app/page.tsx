export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Hello World 🌙
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#666' }}>
        Moon Calendar API
      </h2>
      <div style={{
        background: '#f5f5f5',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Available Endpoints:</h3>
        <ul style={{ lineHeight: '2', listStyle: 'none', padding: 0 }}>
          <li>📊 <a href="/api/health" style={{ color: '#0070f3' }}>/api/health</a></li>
          <li>🌙 <a href="/api/moon/today" style={{ color: '#0070f3' }}>/api/moon/today</a></li>
          <li>📅 <a href="/api/moon/day-info?latitude=52.52&longitude=13.405" style={{ color: '#0070f3' }}>/api/moon/day-info</a></li>
          <li>📆 <a href="/api/moon/month?year=2025&month=9" style={{ color: '#0070f3' }}>/api/moon/month</a></li>
          <li>🗓️ <a href="/api/moon/calendar?startDate=2025-10-01&endDate=2025-10-31" style={{ color: '#0070f3' }}>/api/moon/calendar</a></li>
        </ul>
      </div>
      <p style={{ marginTop: '2rem', color: '#999' }}>
        Server is running at {new Date().toISOString()}
      </p>
    </div>
  );
}
