//      

let db = null

export function setDB(instance     ) {
  db = instance
}

function format(sql, values, stringifyObjects, timeZone) {
  if (values == null) {
    return sql;
  }

  if (!Array.isArray(values)) {
    values = [values];
  }

  var chunkIndex        = 0;
  var placeholdersRegex = /\?+/g;
  var result            = '';
  var valuesIndex       = 0;
  var match;

  while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
    var len = match[0].length;

    if (len > 2) {
      continue;
    }

    var value = len === 2
      ? SqlString.escapeId(values[valuesIndex])
      : SqlString.escape(values[valuesIndex], stringifyObjects, timeZone);

    result += sql.slice(chunkIndex, match.index) + value;
    chunkIndex = placeholdersRegex.lastIndex;
    valuesIndex++;
  }

  if (chunkIndex === 0) {
    // Nothing was replaced
    return sql;
  }

  if (chunkIndex < sql.length) {
    return result + sql.slice(chunkIndex);
  }

  return result;
}

function flattenSql(queryObject   
                         
                        
 ) {
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

export async function query(queryObject   
                         
                        
 )      {
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
