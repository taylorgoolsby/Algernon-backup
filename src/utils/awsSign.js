// @flow

import sha256 from 'crypto-js/sha256'

export default function awsSign(headers: {[string]: string}, body: string) {
  const method = 'GET';
  const canonicalURI = uriEncode('/examplebucket/myphoto.jpg')
  const canonicalQueryString = ''
  const canonicalHeaders = getCanonicalHeaders(headers)
  const signedHeaders = getSignedHeaders(headers)
  const payloadHash = getHashedPayload(body)
  const canonicalRequest = `${method}\n${canonicalURI}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

  const canonicalRequestHash = sha256(canonicalRequest).toString('hex').toLowerCase()

  const requestDateTime = getRequestDateTime(headers)
  const credentialScope = `AKIARX4KAX2DTNF372VX/${requestDateTime.substring(0, 8)}/us-east-1/bedrock/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${requestDateTime}\n${credentialScope}\n${canonicalRequestHash}`


}

function getCanonicalHeaders(headers: {[string]: any}): string {
  return Object.keys(headers).filter(key => {
    // Only include host header and any x-amz-* headers:
    return key.toLowerCase() === 'host' || key.toLowerCase().startsWith('x-amz-')
  }).sort((a, b) => {
    // headers must be in alphabetical order:
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1
  }).map(key => `${key.toLowerCase()}:${headers[key].trim()}`).join('\n')
}

function getSignedHeaders(headers: {[string]: any}): string {
  return Object.keys(headers).filter(key => {
    // Only include host header and any x-amz-* headers:
    return key.toLowerCase() === 'host' || key.toLowerCase().startsWith('x-amz-')
  }).sort((a, b) => {
    // headers must be in alphabetical order:
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1
  }).map(key => key.toLowerCase()).join(';')
}

function getHashedPayload(body: string): string {
  return sha256(body).toString('hex').toLowerCase()
}

function getRequestDateTime(headers: {[string]: any}): string {
  return headers['X-Amz-Date'] || headers['x-amz-date'] || ''
}

function uriEncode(uri: string): string {
  return uri.split('/').map(encodeURIComponent).join('/')
}
