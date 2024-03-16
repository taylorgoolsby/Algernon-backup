// @flow

import { sqltag, join } from 'sql-template-tag'
import database from "./database.js";

/*
export const typeDefs: any = gql`
  type Annotation {
    annotationId: Int @sql(primary: true)
    messageId: Int @sql(type: "INT", index: true)
    text: String @sql(type: "TEXT", unicode: true)
    embedding: JSON @sql(type: "JSON")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")

    id: String
  }
`
* */

export type AnnotationSQL = {
  annotationId: number,
  messageId: number,
  text: string,
  embedding: Array<number>,
  dateCreated: string,
}

export default class AnnotationInterface {
  static async create() {
    const sql = `
      CREATE TABLE IF NOT EXISTS Annotation (
        annotationId INTEGER PRIMARY KEY,
        messageId INTEGER NOT NULL,
        text TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await database.executeSql(sql);
  }

  static async get(db, annotationId) {
    // Implementation to fetch an annotation by annotationId
  }

  static async insert(db, messageId, embedding, annotationText) {
    // Implementation to insert a new annotation
  }
}
