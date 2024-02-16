import { openDatabase } from 'expo-sqlite';
import { getFormattedDate } from '../util/date.js';
// import { openDatabase, openDatabaseAsync } from 'expo-sqlite/next';
const db = openDatabase('db');

// dropTable();

export async function initiateLead() {
  const sql =
    'CREATE TABLE IF NOT EXISTS leads (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'first_name TEXT, ' +
    'middle_name TEXT, ' +
    'last_name TEXT, ' +
    'companion_first_name TEXT, ' +
    'companion_middle_name TEXT, ' +
    'companion_last_name TEXT, ' +
    'address TEXT, ' +
    'hotel TEXT, ' +
    'mobile_number TEXT, ' +
    'occupation TEXT, ' +
    'age INT, ' +
    'source_prefix TEXT, ' +
    'source TEXT, ' +
    'civil_status TEXT, ' +
    'created_at TEXT,' +
    'is_uploaded TEXT' +
    ')';

  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], (tx, results) => {
      console.log(results);
    });
  });

  console.log('initiated');
  return results;
}

export async function leadsFetch() {
  // initiateLead();

  const leads = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync('SELECT * FROM leads', []);

      for (let index = 0; index < results.rows.length; index++) {
        leads.push(results.rows[index]);
      }
    });
  } catch (error) {
    console.log(error, 'error');
    initiateLead();
  }
  return leads;
}

export async function unUploadedleadsFetch() {
  const leads = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        "SELECT * FROM leads WHERE is_uploaded = 'false'",
        []
      );

      for (let index = 0; index < results.rows.length; index++) {
        leads.push(results.rows[index]);
      }
    });
  } catch (error) {
    console.log(error, 'error');
    initiateLead();
  }
  return leads;
}

export async function insertLeadData(request) {
  try {
    await db.transactionAsync(async (tx) => {
      return await tx.executeSqlAsync(
        'INSERT INTO leads (' +
          'first_name, ' +
          'middle_name, ' +
          'last_name, ' +
          'companion_first_name, ' +
          'companion_middle_name, ' +
          'companion_last_name, ' +
          'address, ' +
          'hotel, ' +
          'mobile_number, ' +
          'occupation, ' +
          'age, ' +
          'source_prefix, ' +
          'source, ' +
          'civil_status, ' +
          'is_uploaded, ' +
          'created_at' +
          ') ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          request.first_name,
          request.middle_name,
          request.last_name,
          request.companion_first_name,
          request.companion_middle_name,
          request.companion_last_name,
          request.address,
          request.hotel,
          request.mobile_number,
          request.occupation,
          request.age,
          request.source_prefix,
          request.source,
          request.civil_status,
          request.is_uploaded,
          request.created_at.toString(),
        ]
      );
    });

    return true;
  } catch (error) {
    console.log('insert error', error);
    return false;
  }
}

export async function updateLeadData(id, request) {
  try {
    await db.transactionAsync(async (tx) => {
      return await tx.executeSqlAsync(
        'UPDATE leads SET ' +
          'first_name = ?, ' +
          'middle_name = ?, ' +
          'last_name = ?, ' +
          'companion_first_name = ?, ' +
          'companion_middle_name = ?, ' +
          'companion_last_name = ?, ' +
          'address = ?, ' +
          'hotel = ?, ' +
          'mobile_number = ?, ' +
          'occupation = ?, ' +
          'age = ?, ' +
          'source_prefix = ?, ' +
          'source = ?, ' +
          'civil_status = ?, ' +
          'is_uploaded = ? ' +
          'WHERE id = ?',
        [
          request.first_name,
          request.middle_name,
          request.last_name,
          request.companion_first_name,
          request.companion_middle_name,
          request.companion_last_name,
          request.address,
          request.hotel,
          request.mobile_number,
          request.occupation,
          request.age,
          request.source_prefix,
          request.source,
          request.civil_status,
          request.is_uploaded,
          id,
        ]
      );
    });

    return true;
  } catch (error) {
    console.log('update error', error);
    return false;
  }
}

export async function deleteLeadData(id) {
  try {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('DELETE FROM leads WHERE id = ?', [id]);
    });

    return true;
  } catch (error) {
    console.log(error, 'error');
    console.log('delete error', error);
    return false;
  }
}

export async function showLeadDataAsync(id) {
  const lead = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        'SELECT * FROM leads WHERE id = ?',
        [id]
      );

      for (let index = 0; index < results.rows.length; index++) {
        lead.push(results.rows[index]);
      }
    });
  } catch (error) {
    console.log(error, 'error');
    initiateLead();
  }

  return lead;
}

export function showLeadData(id) {
  const lead = [];

  try {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM leads WHERE id = ?', [id], (tx, results) => {
        console.log('result showLead', results);
      });
    });
  } catch (error) {
    console.log('error', error);
  }
  return lead;
}

export async function uploadLead() {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync("UPDATE leads SET is_uploaded = 'true' WHERE is_uploaded = 'false'");
  });
}

export async function dropTable() {
  await db.transactionAsync(async (tx) => {
    console.log('delete');
    await tx.executeSqlAsync('DROP TABLE leads');
  });
}
