const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function getHeaders() {
  const token = localStorage.getItem('transitops_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API error (${response.status})`);
  }
  return data.data ?? data;
}

export const api = {
  auth: {
    register: async (userData: any) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    }
  },

  dashboard: {
    getOverview: async () => {
      const response = await fetch(`${API_URL}/api/v1/dashboard/overview`, {
        headers: await getHeaders()
      });
      return handleResponse(response);
    },
    getFleetHealth: async () => {
      const response = await fetch(`${API_URL}/api/v1/dashboard/fleet-health`, {
        headers: await getHeaders()
      });
      return handleResponse(response);
    }
  },

  vehicles: {
    list: async () => {
      const response = await fetch(`${API_URL}/api/v1/vehicles?limit=100`, {
        headers: await getHeaders()
      });
      const data = await handleResponse(response);
      return data.items ?? data;
    },
    create: async (vehicleData: any) => {
      const response = await fetch(`${API_URL}/api/v1/vehicles`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    },
    update: async (id: string | number, vehicleData: any) => {
      const response = await fetch(`${API_URL}/api/v1/vehicles/${id}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    },
    delete: async (id: string | number) => {
      const response = await fetch(`${API_URL}/api/v1/vehicles/${id}`, {
        method: 'DELETE',
        headers: await getHeaders()
      });
      return handleResponse(response);
    }
  },

  drivers: {
    list: async () => {
      const response = await fetch(`${API_URL}/api/v1/drivers?limit=100`, {
        headers: await getHeaders()
      });
      const data = await handleResponse(response);
      return data.items ?? data;
    },
    create: async (driverData: any) => {
      const response = await fetch(`${API_URL}/api/v1/drivers`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(driverData)
      });
      return handleResponse(response);
    },
    update: async (id: string | number, driverData: any) => {
      const response = await fetch(`${API_URL}/api/v1/drivers/${id}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(driverData)
      });
      return handleResponse(response);
    },
    delete: async (id: string | number) => {
      const response = await fetch(`${API_URL}/api/v1/drivers/${id}`, {
        method: 'DELETE',
        headers: await getHeaders()
      });
      return handleResponse(response);
    }
  }
};
