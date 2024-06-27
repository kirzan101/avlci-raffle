import { openDatabase } from 'expo-sqlite';
import { getFormattedDate } from '../util/date.js';
// import { openDatabase, openDatabaseAsync } from 'expo-sqlite/next';
const db = openDatabase('opc_leads');

// dropTable();

export async function initiateLead() {
  // await db.transactionAsync(async (tx) => {
  //   await tx.executeSqlAsync('DROP TABLE IF EXISTS leads', []);
  // });

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
    'is_uploaded TEXT,' +
    'code_name TEXT,' +
    'random_code TEXT' +
    ')';

  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], (tx, results) => {});
  });

  return;
}

export async function leadsFetch() {
  await initiateLead();

  // add remarks column here
  const count = await checkColumnExists('leads', 'remarks');
  if (count == 0) {
    await addRemarksColumn();
  }

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
    await initiateLead();
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
    await initiateLead();
  }
  return leads;
}

export async function insertLeadData(request) {
  try {
    let response = 0;

    await db.transactionAsync(async (tx) => {
      response = await tx.executeSqlAsync(
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
          'remarks, ' +
          'random_code, ' +
          'code_name, ' +
          'created_at' +
          ') ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          request.remarks,
          request.random_code,
          request.code_name,
          request.created_at.toString(),
        ]
      );

      return response;
    });

    return response.insertId;
  } catch (error) {
    console.log('insert error', error);
    return response;
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
          'is_uploaded = ?, ' +
          'remarks = ?, ' +
          'random_code = ?, ' +
          'code_name = ? ' +
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
          request.remarks,
          request.random_code,
          request.code_name,
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
    await initiateLead();
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
    await tx.executeSqlAsync(
      "UPDATE leads SET is_uploaded = 'true' WHERE is_uploaded = 'false'"
    );
  });
}

export async function dropTable() {
  await db.transactionAsync(async (tx) => {
    console.log('delete');
    await tx.executeSqlAsync('DROP TABLE leads');
  });
}

export async function checkColumnExists(table, column) {
  let count = '';

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        'SELECT COUNT(*) AS CNTREC FROM pragma_table_info(?) WHERE name=?',
        [table, column]
      );

      count = results.rows[0]['CNTREC'];
    });
  } catch (error) {
    console.log('error checkColumnExist', error);
  }

  return count;
}

export async function addNewNullableColumn(table, columnName, columnProperty) {
  try {
    //
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('ALTER TABLE ? ADD ? ? NULL', [
        table,
        columnName,
        columnProperty,
      ]);
    });

    return true;
  } catch (error) {
    console.log('new column error', error);

    return false;
  }
}

export async function addRemarksColumn() {
  try {
    //
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('ALTER TABLE leads ADD remarks TEXT NULL', []);
    });

    return true;
  } catch (error) {
    console.log('new remarks column error', error);

    return false;
  }
}
