//      

import sqltag, { join } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'
                                                            
                                                              

export default class ShortTermMemoryInterface {
  static async getLast(windowId        )                   {
    const query = sqltag`
      SELECT * FROM ShortTermMemory
      WHERE windowId = ${windowId}
      ORDER BY shortTermMemoryId DESC
      LIMIT 1;
    `

    const rows = await database.query(query)

    return rows[0]?.summary
  }

  static async insert(
    windowId        ,
    model             ,
    inputs                   ,
    summary        ,
  )                  {
    const query = sqltag`
      INSERT INTO ShortTermMemory (
        windowId,
        model,
        inputs,
        summary
      ) VALUES (
        ${windowId},
        ${JSON.stringify(model)},
        ${JSON.stringify(inputs)},
        ${summary}
      );
    `

    const res = await database.query(query)

    const shortTermMemoryId = res.insertId

    return shortTermMemoryId
  }
}
