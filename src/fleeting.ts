import axios from 'axios';

const API_ROOT=process.env.API_ROOT || 'https://api.reminds-app.com/v1';
const API_KEY=process.env.API_KEY;

export const createFleeting = async (content: string) => {
  const response = await axios.post(`${API_ROOT}/fleeting`, {
    content,
    source: 'mcp',
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      api_key: API_KEY,
    },
  });

  if (response.status !== 200) {
    return `Error occured: ${response.statusText}`;
  } else {
    return `Successfully created fleeting with id: ${response.data.data.gid}`;
  }
}

export const getFleeting = async (id: number) => {
  const response = await axios.get(`${API_ROOT}/fleeting/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      api_key: API_KEY,
    },
  });

  if (response.status !== 200) {
    return `Error occured: ${response.statusText}`;
  } else {
    return response.data.data.content;
  }
}