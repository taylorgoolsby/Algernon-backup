//      

import traverse from 'traverse'
import clone from 'clone'

export const redactedFields                = [
  /password/,
  /password_sha/,
  /identity/,
  /key/,
  /Token/,
  /token/,
  /access_token/,
  /id_token/,
  /clientIp/,
  /openAiKey/,
  /apiKey/
]

export default function redact   (value   )    {
  if (typeof value === 'string') {
    // $FlowFixMe
    return value.replace(/sk-\w{44}/g, "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  }

  const v = clone(value)
  // $FlowFixMe
  return traverse(v).forEach(function (leaf     ) {
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
