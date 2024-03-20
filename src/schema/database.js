// @flow

import { format } from "../utils/SqlString.js";

let db = null

export function setDB(instance: any) {
  db = instance
}

function flattenSql(queryObject: {
  strings: Array<string>,
  values: Array<string>,
}) {
  // The values of queryObject.sql and queryObject.values are arrays that you would be received by a template tag function.
  // This function flattens them into a single string.

  return format(queryObject.sql, queryObject.values)

  // if (!queryObject.strings) {
  //   return queryObject.sql
  // }
  // let flattened = ''
  // for (let i = 0; i < queryObject.strings.length; i++) {
  //   flattened += queryObject.strings[i]
  //   if (queryObject.values[i]) {
  //     flattened += queryObject.values[i]
  //   }
  // }
  // return flattened.trim()
}

export async function query(queryObject: {
  strings: Array<string>,
  values: Array<string>,
}): any {
  try {
    if (!db) {
      console.error('Database not initialized')
      return
    }

    console.log(flattenSql(queryObject))

    const [results] = await db.executeSql(queryObject.sql, queryObject.values)
    if (results.insertId) {
      return results
    } else if (results.rows) {
      return results.rows.raw()
    } else {
      return results
    }
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}

const database = {
  query,
}

export default database
