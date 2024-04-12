// @flow

import sqltag, { join, raw } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'
import type {
  MessageRoleType,
  MessageSQL,
} from "./MessageSchema.mjs";
import { MessageRole } from './MessageSchema.mjs'

export default class MessageInterface {
  static async getFirst(windowId: number): Promise<?MessageSQL> {
    const sql = sqltag`
      SELECT * 
      FROM Message
      WHERE windowId = ${windowId}
      ORDER BY messageId ASC
      LIMIT 1;
    `
    const rows = await database.query(sql)
    return rows[0]
  }

  static async getAll(windowId: number, order?: ?string): Promise<Array<MessageSQL>> {
    const sql = sqltag`
      SELECT * 
      FROM Message
      WHERE windowId = ${windowId}
      -- AND deleted = 0
      ORDER BY messageId ${raw(order ?? 'ASC')};
    `
    const rows = await database.query(sql)
    return rows
  }

  static async getFromAnnotations(annotationIds: Array<number>): Promise<Array<MessageSQL>> {
    if (!annotationIds.length) return []

    const sql = sqltag`
      SELECT m.* 
      FROM Message m
      JOIN Annotation a
      ON m.messageId = a.messageId
      WHERE a.annotationId IN (${join(annotationIds)})
      AND m.deleted = 0
      GROUP BY m.messageId
      ORDER BY messageId ASC;
    `
    const rows = await database.query(sql)
    return rows
  }

  static async insert(
    windowId: number,
    role: MessageRoleType,
    text: string,
    completed: boolean
  ): Promise<MessageSQL> {
    if (!completed && (role === MessageRole.SYSTEM || role === MessageRole.USER)) {
      throw new Error('Expected SYSTEM and USER messages to be already completed')
    }

    const query = sqltag`
      INSERT INTO Message (
        windowId,
        role,
        text,
        completed
      ) VALUES (
        ${windowId},
        ${role},
        ${text},
        ${completed}
      );
    `

    const res = await database.query(query)

    const messageId = res.insertId

    const messageTemplate: MessageSQL = {
      messageId,
      windowId,
      role,
      text,
      completed,
      deleted: false,
      dateUpdated: new Date().toISOString(),
      dateCreated: new Date().toISOString(),
    }

    return messageTemplate
  }

  static async completeData(
    messageId: number,
    text: string,
  ): Promise<any> {
    const query = sqltag`
      UPDATE Message SET
        completed = 1,
        text = ${text},
        dateUpdated = CURRENT_TIMESTAMP
      WHERE messageId = ${messageId};
    `
    await database.query(query)
  }

  static async softDelete(messageId: number) {
    const query = sqltag`
      UPDATE Message SET 
        deleted = 1,
        text = '',
        completed = true,
        dateUpdated = CURRENT_TIMESTAMP
      WHERE messageId = ${messageId};
    `
    await database.query(query)
  }

  static async truncateTable() {
    const sql = sqltag`DELETE FROM Message;`
    await database.query(sql)
  }
}
