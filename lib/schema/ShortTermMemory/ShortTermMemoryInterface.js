//      

import { sqltag, join } from 'common/sql-template-tag'
import Config from 'common/src/Config.js'
import database from '../../mysql/database.js'
                                                             

export default class ShortTermMemoryInterface {
  static async getLast(agencyConversationId        )                   {
    const query = sqltag`
      SELECT * FROM ${Config.dbPrefix}_ShortTermMemory
      WHERE agencyConversationId = UNHEX(${agencyConversationId})
      ORDER BY shortTermMemoryId DESC
      LIMIT 1;
    `

    const rows = await database.query(query)

    return rows[0]?.summary
  }

  static async insert(
    agencyConversationId        ,
    model        ,
    inputs                   ,
    summary        ,
  )                  {
    const query = sqltag`
      INSERT INTO ${Config.dbPrefix}_ShortTermMemory (
        agencyConversationId,
        model,
        inputs,
        summary
      ) VALUES (
        UNHEX(${agencyConversationId}),
        ${model},
        ${JSON.stringify(inputs)},
        ${summary}
      );
    `

    const res = await database.query(query)

    const shortTermMemoryId = res.insertId

    return shortTermMemoryId
  }
}
