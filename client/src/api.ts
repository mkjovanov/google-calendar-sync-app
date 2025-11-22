
export async function fetchCurrentUser() {
  const res = await fetch('/current-user', {
    credentials: 'include'
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');

  return res.json();
}

export async function logout() {
  await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
}

export async function fetchGoogleEvents() {
  const res = await fetch("/calendar/events", {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to load calendar events");

  return res.json();
}

export async function fetchLocalEvents(timeframe: 1 | 7 | 30) {
  const res = await fetch(`/calendar/local-events?timeframe=${timeframe}`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to load local calendar events");

  return res.json();
}

