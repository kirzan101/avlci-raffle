import axios from 'axios';
import { openDatabase } from 'expo-sqlite';
const db = openDatabase('leads');

// const link = 'http://192.168.88.23:8000/api/opc-lead-bulk';
// const link = 'http://localhost:8000/api/opc-lead-bulk';
// const link = 'http://10.0.2.2:8000/api/opc-lead-bulk';
// const link = 'https://jsonplaceholder.typicode.com/todos/1';
const link = 'https://leads.avlci.com/api/opc-lead-bulk';
const opcLink = 'https://leads.avlci.com/api/opc-leads';

async function initiateAuth() {
  const sql =
    'CREATE TABLE IF NOT EXISTS auth (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'token TEXT ' +
    ')';

  const response = await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], (tx, results) => {
      console.log(results);
    });
  });

  return response;
}

async function authenticate() {
  // create token storage
  initiateAuth();

  const response = await axios.post(
    'https://leads.avlci.com/api/mobile/login',
    {
      email: 'opc-lead@astoria.com.ph',
      password: '0aj1bvlBv7PXEyU73Cs=',
    }
  );

  return response;
}

async function storeToken(token) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      'INSERT INTO auth ( token VALUES (?) )',
      [token],
      (tx, results) => {
        console.log(results);
      }
    );
  });
}

async function updateToken(token) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      'UPDATE auth SET token = ? WHERE Id = 1',
      [token],
      (tx, results) => {
        console.log(results);
      }
    );
  });
}

async function isTokenValid() {
  const tokens = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync('SELECT * FROM auth', []);

      for (let index = 0; index < results.rows.length; index++) {
        tokens.push(results.rows[index]);
      }
    });

    const token = tokens[0].token;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(opcLink + '/check', { headers });

    if (response.status == 200) {
      return true;
    }
  } catch (error) {
    console.log(error, 'error');
  }

  return false;
}

export async function storeBulkLead(leadDatas) {
  const auth = await authenticate();

  const token = auth.data.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
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
  // console.log('auth token', auth, leadData);

  const token = auth.data.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(opcLink, leadData, { headers });

  return response;
}

export async function updateLead(leadData, id) {
  const auth = await authenticate();

  const token = auth.data.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.patch(opcLink + `/${id}`, leadData, { headers });
  // console.log('response', response.status);

  return response;
}

export async function deleteLead(id) {
  const auth = await authenticate();

  const token = auth.data.token;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.delete(opcLink + `/${id}`, leadData, {
    headers,
  });

  return response;
}
