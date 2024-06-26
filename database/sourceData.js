import { openDatabase } from 'expo-sqlite';
const db = openDatabase('sources');

export async function initiateSourceDefaults() {
  const sql =
    'CREATE TABLE IF NOT EXISTS source_defaults(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'source_prefix TEXT, ' +
    'source TEXT ' +
    ')';

  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], () => {});
  });

  return;
}

export async function storeDefaults(request) {
  const sourceData = await getSourceDefaults();

  if (sourceData.length > 0) {
    // update if there is already a record
    await updateDafaults(request);

    // console.log('updated source', sourceData);
  } else {
    let result = '';
    // create new record
    await db.transactionAsync(async (tx) => {
      result = await tx.executeSqlAsync(
        'INSERT INTO source_defaults (source_prefix, source) VALUES (?, ?)',
        [request.source_prefix, request.source]
      );
    });

    // console.log('created source');
  }

  return;
}

export async function updateDafaults(request) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      'UPDATE source_defaults SET source_prefix = ?, source = ? WHERE id = 1',
      [request.source_prefix, request.source]
    );
  });
}

export async function getSourceDefaults() {
  await initiateSourceDefaults();
  const defaults = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        'SELECT * FROM source_defaults ORDER BY Id DESC',
        []
      );
      for (let index = 0; index < results.rows.length; index++) {
        defaults.push(results.rows[index]);
      }
    });
  } catch (error) {
    await initiateSourceDefaults();
  }

  if (defaults.length > 0) {
    return defaults;
  }

  return defaults;
}
