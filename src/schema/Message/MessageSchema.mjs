// @flow

import gql from 'graphql-tag'
import toSqlEnum from '../../utils/toSqlEnum.mjs'

export const MessageRole = {
  SYSTEM: 'SYSTEM',
  ASSISTANT: 'ASSISTANT',
  USER: 'USER',
}

export type MessageRoleType = $Keys<typeof MessageRole>

export type MessageSQL = {|
  messageId: number,
  windowId: number,
  role: MessageRoleType,
  text: string,
  completed: boolean,
  deleted: boolean,
  dateUpdated: string,
  dateCreated: string,
|}

// todo:
//  We want the rendering of messages to be easy, so combining multiple messages into a single message is not good.
//  It makes it hard to parse in the client.
//  So if we have a case where multiple agents send a message to a target agent at the same time,
//  they will both start a new iteration for the target agent,
//  and if we debounce these iteration calls,
//  the target agent will send a single chat completion containing all the new messages,
//  but the database shows a separate message row for each message,
//  so the client will be able to easily render them.
//

export const typeDefs: any = gql`
  type Message {
    messageId: Int @sql(primary: true, auto: true)
    windowId: Int @sql(type: "INT", default: "0")
    role: String @sql(type: "TEXT")
    text: String @sql(type: "TEXT")
    completed: Boolean @sql(type: "INT", default: "0")
    deleted: Boolean @sql(type: "INT", default: "0")
    dateUpdated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
  }
`
