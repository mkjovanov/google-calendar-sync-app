export async function fetchCurrentUser() {
  const res = await fetch('/curent-user', {
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
