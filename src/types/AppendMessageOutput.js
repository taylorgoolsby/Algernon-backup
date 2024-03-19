// @flow

import type {MessageSQL} from "../schema/Message/MessageSchema.mjs";

export type AppendMessageOutput = {|
  windowId: number,
  message: MessageSQL,
|}
