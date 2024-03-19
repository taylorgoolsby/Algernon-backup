// @flow

import SQLite from 'react-native-sqlite-storage'
import createTables from './createTables.js'
import VersionInterface from './Version/VersionInterface.js'
import Config from '../Config.js'

SQLite.enablePromise(true)

const databaseName = 'Cobalt.db'

let db = null

const RESET_DATABASE = Config.stage === 'debug' && false

export async function query(queryObject: {
  sql: Array<string>,
  values: Array<string>,
}): any {
  try {
    if (!db) {
      console.error('Database not initialized')
      return
    }

    // dynamically import mysql, which is not available in production builds:
    // It is only used for debugging purposes
    // const mysql = await import('mysql')
    // console.log('mysql', mysql)
    // if (mysql?.format) {
    //   console.debug(mysql.format(queryObject.sql, queryObject.values))
    // }
    console.log('queryObject', queryObject)

    const [results] = await db.executeSql(queryObject.sql, queryObject.values)
    if (results.rows) {
      return results.rows.raw()
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
      // if (RESET_DATABASE) {
      //   console.log('Deleting database.')
      //   await new Promise(async (resolve, reject) => {
      //     await SQLite.deleteDatabase(
      //       {name: databaseName, location: 'Documents'},
      //       () => {
      //         console.log('Database deleted.')
      //         resolve()
      //       },
      //       error => {
      //         console.error(error)
      //         reject(error)
      //       },
      //     )
      //   })
      // }

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

      const createTableStatements = createTables
        .split(';')
        .filter(a => !!a)
        .map(statement => statement.trim() + ';')
      for (const statement of createTableStatements) {
        await query({sql: statement, values: []})
      }
      console.log('Tables created successfully.')

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
  console.log('version', version)
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
