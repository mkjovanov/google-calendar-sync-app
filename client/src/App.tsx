import { useEffect, useState } from 'react';
import { fetchCurrentUser, fetchLocalEvents, logout } from './api';
import type { User } from './types/user';
import type { GroupedLocalCalendarEvent } from './types/localCalendarEvent';
import { groupEventsByDay, parseDateStringToUtc } from './utils/dateUtils';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocalCalendar, setLoadingLocalCalendar] = useState(true);
  const [localCalendarEvents, setLocalCalendarEvents] = useState<GroupedLocalCalendarEvent[]>([])
  const [timeframe, setTimeFrame] = useState<1 | 7 | 30>(7);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetchLocalEvents(timeframe)
        .then((events) => {
          setLocalCalendarEvents(groupEventsByDay(events));
        })
        .catch(() => setLocalCalendarEvents([]))
        .finally(() => setLoadingLocalCalendar(false));
    }
  }, [user, timeframe]);

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
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '15rem'}}>
              <div>Timeframe:</div>
              <button onClick={() => {setTimeFrame(1)}} disabled={timeframe === 1}>1 day</button>
              <button onClick={() => {setTimeFrame(7)}} disabled={timeframe === 7}>7 days</button>
              <button onClick={() => {setTimeFrame(30)}} disabled={timeframe === 30}>30 days</button>
            </div>
            <br /><br />
            {loadingLocalCalendar && <>Loading calendar...</>}
            {localCalendarEvents.length === 0 && <>No events to display in next {timeframe} day{timeframe > 1 && 's'}</>}
            {localCalendarEvents.map(groupedEvents =>
              <>
                <div>
                  <b>Date: {groupedEvents.date}</b>
                </div>
                {groupedEvents.events.map(event =>
                  <div>
                    ID: {event.id}
                    <br />
                    Google ID: {event.googleEventId}
                    <br />
                    Summary: {event.summary}
                    <br />
                    Start date time: {parseDateStringToUtc(event.start)}
                    <br />
                    End date time: {parseDateStringToUtc(event.end)}
                    <br /><br />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
