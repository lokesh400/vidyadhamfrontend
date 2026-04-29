// const BASE_URL = 'https://vidyadhammandirerp.onrender.com';

const BASE_URL = 'http://10.25.167.198:4000/api';

const request = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const raw = await response.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (parseError) {
      data = {
        message: 'Non-JSON response received from server',
        raw,
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

const api = {
  get: (endpoint, token) => request(endpoint, 'GET', null, token),
  post: (endpoint, body, token) => request(endpoint, 'POST', body, token),
  put: (endpoint, body, token) => request(endpoint, 'PUT', body, token),
  delete: (endpoint, token) => request(endpoint, 'DELETE', null, token),
};

export default api;
