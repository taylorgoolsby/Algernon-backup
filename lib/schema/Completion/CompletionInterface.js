//      

import sqltag, { join } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'
                                                               
                                                            
                                                              

export default class CompletionInterface {
  static async insert(type                    , model             , inputs                   , output            )                  {
    const query = sqltag`
      INSERT INTO Completion (
        type,
        model,
        inputs,
        output
      ) VALUES (
        ${type},
        ${JSON.stringify(model)},
        ${JSON.stringify(inputs)},
        ${JSON.stringify(output)}
      );
    `

    const res = await database.query(query)

    const completionId = res.insertId

    return completionId
  }

  static async truncateTable() {
    const sql = sqltag`DELETE FROM Completion;`
    await database.query(sql)
  }
}
