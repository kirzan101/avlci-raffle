import { openDatabase } from 'expo-sqlite';
const db = openDatabase('source_defaults');

export async function initiateSourceDafults() {
  const sql =
    'CREATE TABLE IF NOT EXISTS defaults(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'source_prefix TEXT, ' +
    'source TEXT ' +
    ')';

  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(sql, [], (tx, results) => {
      console.log(results);
    });

    // console.log('result here', result)
  });

  return;
}


export async function storeDefaults(request) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      'INSERT INTO defaults (source_prefix, source) VALUES (?, ?)',
      [request.source_prefix, request.source]
    );
  });
}

export async function updateDafaults(request) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      'UPDATE defaults SET source_prefix = ?, source = ? WHERE id = 1',
      [request.source_prefix, request.source]
    );
  });
}

export async function getSourceDefaults() {
//   initiateSourceDafults();
  const defaults = [];

  try {
    await db.transactionAsync(async (tx) => {
      const results = await tx.executeSqlAsync(
        'SELECT * FROM defaults WHERE id = 1',
        []
      );

      for (let index = 0; index < results.rows.length; index++) {
        defaults.push(results.rows[index]);
      }
    });
  } catch (error) {
    console.log(error, 'error on default fetch');
    initiateSourceDafults();
  }

  if (defaults.length > 0) {
    return {
      source_prefix: defaults[0].source_prefix,
      source: defaults[0].source,
    };
  }

  return {
    source_prefix: '',
    source: '',
  };
}
