// @flow

import type {MessageSQL} from "../schema/Message/MessageSchema.mjs";

export type UpdateMessageOutput = {
  windowId: number,
  message: MessageSQL,
}
