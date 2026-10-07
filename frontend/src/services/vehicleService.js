const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';

const headers = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const vehicleService = {
  getAll: (token) =>
    fetch(`${API}/vehicles`, { headers: headers(token) }).then(handle),

  getById: (id, token) =>
    fetch(`${API}/vehicles/${id}`, { headers: headers(token) }).then(handle),

  create: (body, token) =>
    fetch(`${API}/vehicles`, {
      method: 'POST', headers: headers(token), body: JSON.stringify(body),
    }).then(handle),

  update: (id, body, token) =>
    fetch(`${API}/vehicles/${id}`, {
      method: 'PUT', headers: headers(token), body: JSON.stringify(body),
    }).then(handle),

  search: (query, token) =>
    fetch(`${API}/vehicles/search?query=${encodeURIComponent(query)}`,
      { headers: headers(token) }).then(handle),
};
