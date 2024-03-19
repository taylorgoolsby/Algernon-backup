//      

import SQLite from 'react-native-sqlite-storage'
import createTables from "./createTables.js";
import VersionInterface from "./Version/VersionInterface.js";

SQLite.enablePromise(true)

const databaseName = 'Cobalt.db'

let db = null

export async function query(queryObject   
                     
                        
 ) {
  try {
    // dynamically import mysql, which is not available in production builds:
    // It is only used for debugging purposes
    // const mysql = await import('mysql')
    // console.log('mysql', mysql)
    // if (mysql?.format) {
    //   console.debug(mysql.format(queryObject.sql, queryObject.values))
    // }
    console.log('queryObject', queryObject)

    const [results] = await db.executeSql(queryObject.sql, queryObject.values)
    console.log("results", results);
    if (results.rows) {
      return results.rows
    } else {
      return results
    }
  } catch (error) {
    console.error('Error executing query:', error)
  }
}

export function initializeDatabase() {
  Promise.resolve().then(async () => {
    try {
      await new Promise(async (resolve, reject) => {
        db = await SQLite.openDatabase(
          {name: databaseName, location: 'Documents'},
          () => {
            console.log('Database opened successfully.')
            resolve()
          },
          error => {
            console.error('Error opening database:', error)
            reject(error)
          },
        )
      })

      const createTableStatements = createTables.split(';').filter(a => !!a).map(statement => statement.trim() + ';')
      for (const statement of createTableStatements) {
        await query({sql: statement, values: []})
      }
      console.log('Tables created successfully.')

      const rows = await query({sql: `
      SELECT 
          name
      FROM 
          sqlite_schema
      WHERE 
          type ='table' AND 
          name NOT LIKE 'sqlite_%';
      `, values: []})
      console.log("rows", rows);
      const items = rows.raw()
      console.log("items", items);

      await migrate()

      // Handle DB migrations here
      console.log('Database initialized')
    } catch (error) {
      console.error('Database initialization failed:', error)
    }
  })
}

async function migrate() {
  // todo: port

  await VersionInterface.insertCurrentVersion()
  const version = await VersionInterface.getCurrent()
  console.log("version", version);
  // if (version?.isMigrated) {
  //   console.log('Migration not needed.')
  //   return
  // }
  //
  // const migrationScriptFilename = Config.version.replace(/\./g, '_') + '.sql'
  // console.log('Looking for migration file', migrationScriptFilename)
  // const migrationScriptPath = path.resolve(
  //   __dirname,
  //   '../../migrations',
  //   migrationScriptFilename,
  // )
  // const migrationScriptExists = fs.existsSync(migrationScriptPath)
  // const migrationScript = migrationScriptExists
  //   ? fs.readFileSync(migrationScriptPath, { encoding: 'utf-8' }).trim()
  //   : ''
  //
  // if (migrationScript.length > 16777215) {
  //   throw new Error(
  //     `migrationScript ${migrationScriptFilename} is greater than max allowed size of MEDIUMTEXT column type.`,
  //   )
  // }
  //
  // if (migrationScript) {
  //   console.log(`Running migration script ${migrationScriptFilename}.`)
  //   console.log(migrationScript)
  //   await database.unsafeQuery(migrationScript)
  // } else {
  //   console.log(`No migration script found at ${migrationScriptPath}.`)
  // }
  //
  // console.log(`Marking version ${Config.version} as complete.`)
  // await VersionInterface.setMigrated(
  //   Config.version,
  //   Config.dbPrefix.sql,
  //   migrationScript,
  // )
  // console.log('Migration complete.')
}

const database = {
  query,
}

export default database
