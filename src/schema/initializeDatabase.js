// @flow

import SQLite from "react-native-sqlite-storage";
import createTables from "./createTables.js";
import VersionInterface from "./Version/VersionInterface.js";
import { setDB, query } from "./database.js";
import AnnotationInterface from "./Annotation/AnnotationInterface.js";
import CompletionInterface from "./Completion/CompletionInterface.js";
import MessageInterface from "./Message/MessageInterface.js";
import ShortTermMemoryInterface from "./ShortTermMemory/ShortTermMemoryInterface.js";
import sqltag from "@taylorgoolsby/sql-template-tag";
import chatStore from "../stores/ChatStore.js";
import { MessageRole } from "./Message/MessageSchema.mjs";

SQLite.enablePromise(true)
const databaseName = 'Cobalt.db'
const RESET_DATABASE = false

export async function initializeDatabase() {
  try {
    if (RESET_DATABASE) {
      console.log('Deleting database.')
      await new Promise(async (resolve, reject) => {
        await SQLite.deleteDatabase(
          {name: databaseName, location: 'Documents'},
          () => {
            console.log('Database deleted.')
            resolve()
          },
          error => {
            console.error(error)
            reject(error)
          },
        )
      })
    }

    await new Promise(async (resolve, reject) => {
      const instance = await SQLite.openDatabase(
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
      setDB(instance)
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

    await initData()

    // Handle DB migrations here
    console.log('Database initialized')
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}

async function initData() {
  const firstMessage = await MessageInterface.getFirst(0)
  const initialized = !!firstMessage
  if (initialized) return

  await MessageInterface.insert(chatStore.windowId, MessageRole.ASSISTANT, 'Hi, how are you?', true)
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

export async function truncateDatabase() {
  await AnnotationInterface.truncateTable()
  await CompletionInterface.truncateTable()
  await MessageInterface.truncateTable()
  await MessageInterface.truncateTable()
  await ShortTermMemoryInterface.truncateTable()
  await query(sqltag`DELETE FROM sqlite_sequence;`)
  // The Version table does not get truncated.

  await initData()
}
