import axios from 'axios';

// const link = 'http://192.168.88.23:8000/api/opc-lead-bulk';
// const link = 'http://localhost:8000/api/opc-lead-bulk';
// const link = 'http://10.0.2.2:8000/api/opc-lead-bulk';
// const link = 'https://jsonplaceholder.typicode.com/todos/1';
const link = 'https://leads.avlci.com/api/opc-lead-bulk';
const opcLink = 'https://leads.avlci.com/api/opc-leads';

// export function storeLead(leadData) {
//   axios.post(link, leadData);
// }

async function authenticate() {
  const response = await axios.post('https://leads.avlci.com/api/mobile/login', {
    email: 'opc-lead@astoria.com.ph',
    password: '0aj1bvlBv7PXEyU73Cs=',
  });

  return response;
}

export async function storeBulkLead(leadDatas) {
  const auth = await authenticate();

  const token = auth.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  const response = await axios.post(
    link,
    {
      leads: JSON.stringify(leadDatas),
    },
    headers
  );

  return response;
}

export async function storeLead(leadData) {
  const auth = await authenticate();

  const token = auth.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  const response = await axios.post(opcLink, leadData, headers);

  return response;
}

export async function updateLead(leadData, id) {
  const auth = await authenticate();

  const token = auth.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  const response = await axios.put(opcLink + `/${id}`, leadData, headers);

  return response;
}

export async function deleteLead(id) {
  const auth = await authenticate();

  const token = auth.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  const response = await axios.delete(opcLink + `/${id}`, leadData, headers);

  return response;
}

