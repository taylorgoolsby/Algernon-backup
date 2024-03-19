//      

import { sqltag, join } from 'common/sql-template-tag'
import Config from 'common/src/Config.js'
import database from '../../mysql/database.js'
                                                            
                                                               

export default class CompletionInterface {
  static async insert(agencyConversationId        , type                    , model        , inputs                   , output            )                  {
    const query = sqltag`
      INSERT INTO ${Config.dbPrefix}_Completion (
        agencyConversationId,
        type,
        model,
        inputs,
        output
      ) VALUES (
        UNHEX(${agencyConversationId}),
        ${type},
        ${model},
        ${JSON.stringify(inputs)},
        ${JSON.stringify(output)}
      );
    `

    const res = await database.query(query)

    const completionId = res.insertId

    return completionId
  }
}
