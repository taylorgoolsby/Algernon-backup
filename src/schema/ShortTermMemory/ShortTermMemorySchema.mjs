// @flow

import gql from 'graphql-tag'
import type { GPTMessage } from '../../types/GPTMessage.js'

export type ShortTermMemorySQL = {|
  shortTermMemoryId: number,
  model: string,
  inputs: Array<GPTMessage>,
  summary: string,
  dateCreated: string,
|}

export const typeDefs: any = gql`
  type ShortTermMemory {
    shortTermMemoryId: Int @sql(primary: true, auto: true)
    model: String @sql(type: "TEXT")
    inputs: JSON @sql(type: "TEXT")
    summary: String @sql(type: "TEXT", unicode: true)
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")

    id: String
  }
`
