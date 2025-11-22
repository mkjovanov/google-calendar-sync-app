import { useEffect, useState } from 'react';
import { fetchCurrentUser, loadEvents, logout } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<{id: string, summary: string}[]>([])

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      loadEvents()
        .then(setCalendarEvents)
        .catch(() => setCalendarEvents([]))
        .finally(() => setLoadingCalendar(false));
    }
  }, [user]);

  const handleLogin = () => {
    window.location.href = '/auth/google';
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Google Calendar OAuth</h1>

      {!user && (
        <>
          <p>You are not logged in.</p>
          <button onClick={handleLogin}>Sign in with Google</button>
        </>
      )}

      {user && (
        <div>
          <div>
            <button onClick={handleLogout}>Logout</button>
            <p>Welcome, {user.name}</p>
            <p>{user.email}</p>
            <br />
          </div>
          <div>
            <b>Your calendar events:</b>
            <br /><br />
            {loadingCalendar && <>Loading calendar...</>}
            {calendarEvents.map(val =>
              <div>
                ID: {val.id}
                <br />
                Summary: {val.summary}
                <br /><br />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
