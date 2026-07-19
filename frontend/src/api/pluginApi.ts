export interface PluginInfo {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

const API_BASE = 'http://localhost:3000/api'; // Or wherever the backend is running

export const fetchPlugins = async (): Promise<PluginInfo[]> => {
  const response = await fetch(`${API_BASE}/plugins`);
  if (!response.ok) {
    throw new Error('Failed to fetch plugins');
  }
  const data = await response.json();
  return data.plugins;
};

export const updatePluginStatus = async (id: string, isEnabled: boolean): Promise<PluginInfo> => {
  const response = await fetch(`${API_BASE}/plugins/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isEnabled }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update plugin status');
  }
  
  const data = await response.json();
  return data.setting; // Returns { id, isEnabled }
};
