export function getToken() {
  return localStorage.getItem('token');
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}