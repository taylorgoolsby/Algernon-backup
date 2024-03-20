//      

import sqltag, { join } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'

export default class AnnotationInterface {
  static async retrieve(
    annotationIds               ,
  )                                                          {
    if (!annotationIds.length) return []

    const query = sqltag`
      SELECT a.text, m.dateCreated
      FROM Annotation a
      LEFT JOIN Message m
      ON a.messageId = m.messageId
      WHERE a.annotationId IN (${join(annotationIds)});
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
}
