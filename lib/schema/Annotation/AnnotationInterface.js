//      

import sqltag, { join } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'
                                                            

export default class AnnotationInterface {
  static async getAll()                                {
    const query = sqltag`
      SELECT * 
      FROM Annotation
      ORDER BY annotationId ASC;
    `
    const rows = await database.query(query)
    return rows
  }

  static async retrieve(
    annotationIds               ,
  )                                                          {
    if (!annotationIds.length) return []

    const query = sqltag`
      SELECT a.text, m.dateCreated, m.text
      FROM Annotation a
      LEFT JOIN Message m
      ON a.messageId = m.messageId
      WHERE a.annotationId IN (${join(annotationIds)})
      AND m.deleted = 0;
    `
    const rows = await database.query(query)
    return rows
  }

  static async insert(
    annotationId        ,
    messageId        ,
    annotationText        ,
    vector               ,
  )                {
    const query = sqltag`
      INSERT INTO Annotation (
        annotationId,
        messageId,
        text,
        embedding
      ) VALUES (
        ${annotationId},
        ${messageId},
        ${annotationText},
        ${JSON.stringify(vector)}
      );
    `

    const res = await database.query(query)

    // const annotationId = res.insertId
    //
    // return annotationId
  }

  static async truncateTable() {
    const sql = sqltag`DELETE FROM Annotation;`
    await database.query(sql)
  }
}
