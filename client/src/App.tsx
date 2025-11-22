import { useEffect, useState } from 'react';
import { fetchCurrentUser, fetchLocalEvents, logout } from './api';
import type { User } from './types/user';
import type { LocalCalendarEvent } from './types/localCalendarEvent';
import { parseDateStringToUtc } from './utils/dateUtils';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocalCalendar, setLoadingLocalCalendar] = useState(true);
  const [localCalendarEvents, setLocalCalendarEvents] = useState<LocalCalendarEvent[]>([])

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetchLocalEvents()
        .then(setLocalCalendarEvents)
        .catch(() => setLocalCalendarEvents([]))
        .finally(() => setLoadingLocalCalendar(false));
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
            {loadingLocalCalendar && <>Loading calendar...</>}
            {localCalendarEvents.map(val =>
              <div>
                ID: {val.id}
                <br />
                Google ID: {val.googleEventId}
                <br />
                Summary: {val.summary}
                <br />
                Start date time: {parseDateStringToUtc(val.start)}
                <br />
                End date time: {parseDateStringToUtc(val.end)}
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
