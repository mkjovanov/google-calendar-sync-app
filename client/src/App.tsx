import { useEffect, useState } from 'react';
import { fetchCurrentUser, logout } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

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
          <p>Welcome, {user.name}</p>
          <p>{user.email}</p>
          <br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
