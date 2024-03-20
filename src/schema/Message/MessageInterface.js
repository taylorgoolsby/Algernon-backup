// @flow

import sqltag, { join, raw } from '@taylorgoolsby/sql-template-tag'
import database from '../database.js'
import type {
  MessageRoleType,
  MessageSQL,
} from "./MessageSchema.mjs";
import { MessageRole } from './MessageSchema.mjs'

export default class MessageInterface {
  // Get all messages for the given agentIds
  // static async getUnderBatch(
  //   agentIds: Array<number>,
  // ): Promise<Array<MessageSQL>> {
  //   if (!agentIds.length) return []
  //
  //   const sql = sqltag`
  //     SELECT *
  //     FROM Message
  //     WHERE agentId IN (${join(agentIds.map((id) => sqltag`${id}`))})
  //     ORDER BY messageId ASC;
  //   `
  //   const rows = await database.query(sql)
  //   return rows
  // }
  //
  // static async getBatch(messageIds: Array<number>): Promise<Array<MessageSQL>> {
  //   if (!messageIds.length) return []
  //
  //   const sql = sqltag`
  //     SELECT *
  //     FROM Message
  //     WHERE messageId IN (${join(messageIds)});
  //   `
  //   const rows = await database.query(sql)
  //   return rows
  // }

  static async getAll(windowId: number, order?: ?string): Promise<Array<MessageSQL>> {
    const sql = sqltag`
      SELECT * 
      FROM Message
      WHERE windowId = ${windowId}
      ORDER BY messageId ${raw(order ?? 'ASC')};
    `
    const rows = await database.query(sql)
    console.log("rows", rows);
    return rows
  }

  // static async getByRole(
  //   windowId: string,
  //   role: MessageRoleType,
  // ): Promise<Array<MessageSQL>> {
  //   const sql = sqltag`
  //     SELECT *
  //     FROM Message
  //     WHERE windowId = UNHEX(${windowId})
  //     AND role = ${role}
  //     ORDER BY messageId ASC;
  //   `
  //   const rows = await database.query(sql)
  //   return rows
  // }

  // static async getNonSystem(
  //   windowId: string,
  // ): Promise<Array<MessageSQL>> {
  //   const sql = sqltag`
  //     SELECT *
  //     FROM Message
  //     WHERE windowId = UNHEX(${windowId})
  //     AND role != ${MessageRole.SYSTEM}
  //     ORDER BY messageId ASC;
  //   `
  //   const rows = await database.query(sql)
  //   return rows
  // }

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

  // static async linkMessages(
  //   messageId1: number,
  //   messageId2: number,
  // ): Promise<any> {
  //   let query = sqltag`
  //     UPDATE Message SET
  //       linkedMessageId = CASE
  //         WHEN messageId = ${messageId1} THEN ${messageId2}
  //         WHEN messageId = ${messageId2} THEN ${messageId1}
  //       END,
  //       dateUpdated = CURRENT_TIMESTAMP
  //     WHERE messageId IN (${messageId1}, ${messageId2});
  //   `
  //   await database.query(query)
  // }
}

// function normalizeMessageData(
//   messageId: number,
//   data: MessageData,
// ): MessageData {
//   return {
//     __typename: 'MessageData',
//     id: 'MessageData:' + messageId,
//     internalInstruction: false,
//     userInstruction: false,
//     toApi: false,
//     fromApi: false,
//     completed: false,
//     toAgentId: null,
//     fromAgentId: null,
//     text: '',
//     ...data,
//   }
// }
