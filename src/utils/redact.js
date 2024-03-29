// @flow

import traverse from 'traverse'
import clone from 'clone'

export const redactedFields: Array<RegExp> = [
  /password/,
  /password_sha/,
  /identity/,
  /key/,
  /Key/,
  /Token/,
  /token/,
  /access_token/,
  /id_token/,
  /clientIp/,
  /openAiKey/,
  /apiKey/
]

export default function redact<T>(value: T): T {
  if (typeof value === 'string') {
    // $FlowFixMe
    return value
      // openai key
      .replace(/sk-\w{44}/g, "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      // codepush key
      .replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g, "00000000-0000-0000-0000-000000000000")
  }

  const v = clone(value)
  // $FlowFixMe
  return traverse(v).forEach(function (leaf: any) {
    const matchFound = redactedFields
      .map((f) => f.test(this.key))
      .reduce((acc, cur) => {
        return acc || cur
      }, false)
    if (matchFound) {
      this.update('[REDACTED]', true)
      return
    }

    if (this.isLeaf && typeof this.node === 'string') {
      try {
        const obj = JSON.parse(this.node)
        if (typeof obj === 'object') {
          const redactedObj = redact(obj)
          this.update(JSON.stringify(redactedObj))
        }
      } catch (err) {}
    }
  })
}
