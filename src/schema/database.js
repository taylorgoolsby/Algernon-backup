// @flow

import SQLite from 'react-native-sqlite-storage'
import DeviceInfo from 'react-native-device-info'
import MessageInterface from './MessageInterface.js'
import CompletionInterface from './CompletionInterface.js'
import AnnotationInterface from './AnnotationInterface.js'
import ShortTermInterface from './ShortTermInterface.js'
import VersionInterface from './VersionInterface.js'

SQLite.enablePromise(true)

const databaseName = 'CobaltDB.db'

let db = null

export async function query(queryObject: {
  sql: Array<string>,
  values: Array<string>,
}) {
  try {
    // dynamically import mysql, which is not available in production builds:
    // It is only used for debugging purposes
    const mysql = await import('mysql')
    console.log('mysql', mysql)
    if (mysql) {
      console.debug(mysql.format(queryObject.sql, queryObject.values))
    }

    const [results] = await db.executeSql(queryObject.sql, queryObject.values)
    return results
  } catch (error) {
    console.error('Error executing query:', error)
  }
}

export async function initializeDatabase() {
  try {
    db = await SQLite.openDatabase(
      {name: databaseName, location: 'Documents'},
      () => console.log('Database opened successfully.'),
      error => console.error('Error opening database:', error),
    )

    // All create table statements should be CREATE TABLE IF NOT EXISTS
    await VersionInterface.create()
    await MessageInterface.create()
    await CompletionInterface.create()
    await AnnotationInterface.create()
    await ShortTermInterface.create()

    await migrate()

    // Handle DB migrations here
    console.log('Database initialized')
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}

async function migrate() {
  const appVersion = DeviceInfo.getVersion()
  const buildNumber = DeviceInfo.getBuildNumber()
  console.log('appVersion', appVersion)
  console.log('buildNumber', buildNumber)

  // todo: port
  // await VersionInterface.insertCurrentVersion()
  // const version = await VersionInterface.getCurrent()
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
