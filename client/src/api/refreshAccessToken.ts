// refresh access token

import axios from 'axios';

export async function refreshAccesstoken() {
  const response = await axios.get<{ accessToken: string }>('/auth/refresh');
  return response.data.accessToken;
}

