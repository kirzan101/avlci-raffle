import axios from 'axios';
import { openDatabase } from 'expo-sqlite';
const db = openDatabase('leads');
import AsyncStorage from '@react-native-async-storage/async-storage';

//Live links:
// const bulkLink = 'https://leads.avlci.com/api/opc-lead-bulk';
// const opcLink = 'https://leads.avlci.com/api/opc-leads';
// const opcAgentLink = 'https://leads.avlci.com/api/opc-agents';
// const loginLink = 'https://leads.avlci.com/api/mobile/login';
// const email = 'opc-lead@astoria.com.ph';
// const password = '0aj1bvlBv7PXEyU73Cs=';

//local links:
const bulkLink = 'http://192.168.88.23:8000/api/opc-lead-bulk';
const opcLink = 'http://192.168.88.23:8000/api/opc-leads';
const opcAgentLink = 'http://192.168.88.23:8000/api/opc-agents';
const loginLink = 'http://192.168.88.23:8000/api/mobile/login';
const email = 'opc_lead@mail.com';
const password = 'wJvycvwYrJg=';

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

  const response = await axios.post(loginLink, {
    email: email,
    password: password,
  });

  if (response.status === 200) {
    // Save the token
    const token = response.data.token;

    // Set token to session storage
    await AsyncStorage.setItem('token', token);
  } else {
    return null;
  }

  return response;
}

export async function storeBulkLead(leadDatas) {
  // const auth = await authenticate();
  // const token = auth.data.token;

  let token = await AsyncStorage.getItem('token');
  if (!token) {
    await authenticate();
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  const response = await axios.post(
    bulkLink,
    {
      leads: JSON.stringify(leadDatas),
    },
    headers
  );

  return response;
}

export async function storeLead(leadData) {
  // const auth = await authenticate();
  // console.log('auth token', auth, leadData);
  // const token = auth.data.token;

  let token = await AsyncStorage.getItem('token');
  if (!token) {
    await authenticate();
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  //remove sa is_uploaded column
  delete leadData['is_uploaded'];

  const response = await axios.post(opcLink, leadData, { headers });
  return response;
}

export async function updateLead(leadData, id) {
  // const auth = await authenticate();
  // const token = auth.data.token;

  let token = await AsyncStorage.getItem('token');
  if (!token) {
    await authenticate();
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.patch(opcLink + `/${id}`, leadData, { headers });
  // console.log('response', response.status);

  return response;
}

export async function deleteLead(id) {
  // const auth = await authenticate();
  // const token = auth.data.token;
  let token = await AsyncStorage.getItem('token');
  if (!token) {
    await authenticate();
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.delete(opcLink + `/${id}`, leadData, {
    headers,
  });

  return response;
}

export async function localAgentsInitiate() {
  // await db.transactionAsync(async (tx) => {
  //   await tx.executeSqlAsync('DROP TABLE IF EXISTS agents', []);
  // });

  const sql =
    'CREATE TABLE IF NOT EXISTS agents (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'first_name TEXT, ' +
    'middle_name TEXT, ' +
    'last_name TEXT, ' +
    'employee_number TEXT, ' +
    'status TEXT ' +
    ')';

  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], (tx, results) => {});
  });

  const localAgentDatas = [];

  await db.transactionAsync(async (tx) => {
    const results = await tx.executeSqlAsync('SELECT * FROM agents', []);
    for (let index = 0; index < results.rows.length; index++) {
      localAgentDatas.push(results.rows[index]);
    }
  });

  if (localAgentDatas.length > 0) {
    // return current agents here
    return localAgentDatas;
  } else {
    // create default agents
    await bulkInsertAgents(defaultAgents);
  }

  return defaultAgents;
}

const executeSqlAsync = (tx, sql, params = []) => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      sql,
      params,
      (_, results) => resolve(results),
      (_, error) => reject(error)
    );
  });
};

const queue = [];
let processing = false;

const enqueue = (operation) => {
  return new Promise((resolve, reject) => {
    queue.push({ operation, resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const { operation, resolve, reject } = queue.shift();
    try {
      const result = await operation();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  processing = false;
};

const bulkInsertAgents = async (agents) => {
  return enqueue(() => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          agents.forEach(async (agent) => {
            try {
              await executeSqlAsync(
                tx,
                'INSERT INTO agents (first_name, middle_name, last_name, employee_number, status) VALUES (?,?,?,?,?)',
                [
                  agent.first_name,
                  agent.middle_name,
                  agent.last_name,
                  agent.employee_number,
                  'new',
                ]
              );
            } catch (error) {
              reject(error);
            }
          });
        },
        reject,
        resolve
      );
    });
  });
};

const deleteAgentsWithStatusNew = async () => {
  try {
    const response = await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        'DELETE FROM agents WHERE status = "new"',
        []
      );
      return results;
    });
  } catch (error) {
    console.error('Error deleting agents:', error);
  }
};

export async function getAgents() {
  //initiate agent data;
  const localAgentDatas = await localAgentsInitiate();

  if (localAgentDatas.length > 0) {
    return localAgentDatas;
  }

  return defaultAgents;
}

export async function updateLocalAgents() {
  // await localAgentsInitiate();

  let token = await AsyncStorage.getItem('token');
  if (!token) {
    await authenticate();
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get(opcAgentLink, { headers });

  if (response.status === 200) {
    // update local agents
    await deleteAgentsWithStatusNew();

    // store new agents
    // storeLocalAgents(response.data);
    const mapData = response.data.map((agent) => {
      return {
        first_name: agent.first_name,
        middle_name: agent.middle_name,
        last_name: agent.last_name,
        employee_number: agent.employee_number,
        status: 'new',
      };
    });

    try {
      await bulkInsertAgents(mapData);
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  return false;
}

const defaultAgents = [
  {
    status: 'new',
    employee_number: '12049',
    last_name: 'Asuncion',
    first_name: 'Allan',
    middle_name: 'Dulnuan',
  },
  {
    status: 'new',
    employee_number: '12053',
    last_name: 'Bohol',
    first_name: 'Marianet',
    middle_name: 'Apolinario',
  },
  {
    status: 'new',
    employee_number: '12079',
    last_name: 'Ariel',
    first_name: 'Odeth',
    middle_name: 'Hernaez',
  },
  // {
  //   status: 'new',
  //   employee_number: '12092',
  //   last_name: 'Cabato',
  //   first_name: 'Romabel',
  //   middle_name: 'Gozun',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12137',
  //   last_name: 'Tiongco',
  //   first_name: 'Gilbert',
  //   middle_name: 'Masula',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12149',
  //   last_name: 'Bartolome',
  //   first_name: 'Elmer',
  //   middle_name: 'Espiritu',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12166',
  //   last_name: 'Jamero',
  //   first_name: 'Menandro',
  //   middle_name: 'Baserto',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12202',
  //   last_name: 'Gallentes',
  //   first_name: 'Elsen Hower',
  //   middle_name: 'Celis',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12235',
  //   last_name: 'Duatin',
  //   first_name: 'Maria Katrina',
  //   middle_name: 'De Guzman',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12249',
  //   last_name: 'Viernes',
  //   first_name: 'Keivin',
  //   middle_name: 'Siobal',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12259',
  //   last_name: 'Magat',
  //   first_name: 'Reynaldo',
  //   middle_name: 'Sebastian',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12262',
  //   last_name: 'Pamat',
  //   first_name: 'Marlyn',
  //   middle_name: 'Oroceo',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12280',
  //   last_name: 'Mendoza',
  //   first_name: 'Donnalyn',
  //   middle_name: 'Mayo',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12298',
  //   last_name: 'Caparas',
  //   first_name: 'Mary Ann',
  //   middle_name: 'Galarse',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12301',
  //   last_name: 'Caño',
  //   first_name: 'Rachel',
  //   middle_name: 'Pamat',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12303',
  //   last_name: 'Amancio',
  //   first_name: 'Jonalyn',
  //   middle_name: 'Romano',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12345',
  //   last_name: 'Pindos',
  //   first_name: 'Reynaldo',
  //   middle_name: 'Aparri',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12466',
  //   last_name: 'Celis',
  //   first_name: 'Neriza',
  //   middle_name: 'Llagono',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12479',
  //   last_name: 'Zonio',
  //   first_name: 'Rowel',
  //   middle_name: 'Cortez',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12496',
  //   last_name: 'Ilagan',
  //   first_name: 'Anthony',
  //   middle_name: 'Palabrica',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12500',
  //   last_name: 'Ocson',
  //   first_name: 'Rachel-Lyn',
  //   middle_name: 'Añonuevo',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12562',
  //   last_name: 'Geli',
  //   first_name: 'Ryan Jay',
  //   middle_name: 'Valdez',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12686',
  //   last_name: 'Labadlabad',
  //   first_name: 'Anjenette',
  //   middle_name: 'Cabique',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12818',
  //   last_name: 'Pangilinan',
  //   first_name: 'Jerome',
  //   middle_name: 'Talenjale',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12852',
  //   last_name: 'Macaspac',
  //   first_name: 'King',
  //   middle_name: 'Cruz',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12853',
  //   last_name: 'Nabayra',
  //   first_name: 'Kevin Jay',
  //   middle_name: 'Peña',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12908',
  //   last_name: 'Zonio',
  //   first_name: 'Ellienite',
  //   middle_name: 'Cortes',
  // },
  // {
  //   status: 'new',
  //   employee_number: '12910',
  //   last_name: 'Horlador',
  //   first_name: 'Jary',
  //   middle_name: 'Hablero',
  // },
];
