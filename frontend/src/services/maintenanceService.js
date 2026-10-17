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

export const maintenanceService = {
  getAll: (token) =>
    fetch(`${API}/maintenance`, { headers: headers(token) }).then(handle),

  getById: (id, token) =>
    fetch(`${API}/maintenance/${id}`, { headers: headers(token) }).then(handle),

  create: (body, token) =>
    fetch(`${API}/maintenance`, {
      method: 'POST', headers: headers(token), body: JSON.stringify(body),
    }).then(handle),

  myReports: (token) =>
    fetch(`${API}/maintenance/my-reports`, { headers: headers(token) }).then(handle),

  myJobs: (token) =>
    fetch(`${API}/maintenance/my-jobs`, { headers: headers(token) }).then(handle),

  search: (query, token) =>
    fetch(`${API}/maintenance/search?query=${encodeURIComponent(query)}`,
      { headers: headers(token) }).then(handle),

  assign: (id, mechanicUsername, token) =>
    fetch(`${API}/maintenance/${id}/assign`, {
      method: 'PUT', headers: headers(token),
      body: JSON.stringify({ mechanicUsername }),
    }).then(handle),

  start: (id, token) =>
    fetch(`${API}/maintenance/${id}/start`, {
      method: 'PUT', headers: headers(token),
    }).then(handle),

  complete: (id, token) =>
    fetch(`${API}/maintenance/${id}/complete`, {
      method: 'PUT', headers: headers(token),
    }).then(handle),

  close: (id, token) =>
    fetch(`${API}/maintenance/${id}/close`, {
      method: 'PUT', headers: headers(token),
    }).then(handle),

  getDashboard: (token) =>
    fetch(`${API}/dashboard/summary`, { headers: headers(token) }).then(handle),
};
