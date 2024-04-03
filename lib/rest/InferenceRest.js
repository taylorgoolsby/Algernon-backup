//      

import axios from 'axios'
import parseAxiosError from '../utils/parseAxiosError.js'
                                                      
                                                                       
                                                        
import EventSource from '../react-native-sse'

// ordering matters here
// default model is the first one.
export const standardModels = [
  'gpt-3.5-turbo-1106',
  'gpt-4-1106-preview',
  // 'gpt-3.5-turbo',
  // 'gpt-4',
]

export default class InferenceRest {
  static async chatCompletion(
    model             ,
    messages                   ,
  )                                   {
    const apiBase = model.apiBase
    const apiKey = model.apiKey

    if (!apiBase) {
      throw new Error('apiBase is required')
    }

    const url = getUrl(apiBase)
    const headers = getHeaders(apiBase, apiKey)
    const data = getBody(apiBase, messages, model.completionOptions, false)

    const res = await send(
      url,
      data,
      headers,
    )

    if (res.error) {
      if (res.error instanceof Error) {
        throw res.error
      } else {
        throw new Error(res.error)
      }
    }

    return res
  }

  static relayChatCompletionStream(
    model             ,
    messages                   ,
    onData                                        ,
    onError                     ,
  )       {
    const apiBase = model.apiBase
    const apiKey = model.apiKey

    if (!apiBase) {
      throw new Error('apiBase is required')
    }

    const url = getUrl(apiBase)
    const headers = getHeaders(apiBase, apiKey)
    const data = getBody(apiBase, messages, model.completionOptions, true)

    const es = new EventSource(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
      pollingInterval: 25000,
    })

    let buffer = ''
    let dataLog      = []
    const listener = (event     ) => {
      const data = event.data

      if (data === undefined) return

      dataLog.push(data)

      buffer += data

      const items = buffer.split('\n\n')

      for (let i = 0; i < items.length; i++) {
        let item = items[i]

        // item might end with 0, 1, or 2 new lines.
        // So the next item might start with 2, 1, or 0 new lines.
        // Remove any newlines at the beginning:
        item = item.replace(/^\n+/, '')

        if (item === '') continue

        if (/^data: \[DONE\]/.test(item)) {
          buffer = items.slice(i + 1).join('\n\n')
          es.close()
          return
        }

        let parsedPayload
        try {
          parsedPayload = JSON.parse(item.replace(/^data: /, ''))
        } catch (err) {
          buffer = items.slice(i).join('\n\n')
          return
        }

        try {
          onData(parsedPayload)
        } catch (err) {
          console.error(err)
        }
      }
      // All items in the array have been processed, so clear the buffer.
      // Equivalent to items.slice(items.length).join('\n\n')
      buffer = ''
    }

    const closeListener = (event     ) => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message)
        es.close()
        onError(new Error(event.message))
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error)
        onError(event.error)
        es.close()
      } else if (event.type === 'close') {
        console.log('closed third party')
      }
      if (buffer) {
        console.debug(dataLog)
        console.debug(buffer)
        console.error(new Error('buffer is not empty'))
        onError(new Error('buffer is not empty'))
      }
    }

    // Add listener
    es.addEventListener('open', () => console.log('Open SSE connection.'))
    es.addEventListener('data', listener)
    es.addEventListener('error', closeListener)
    es.addEventListener('close', closeListener)
  }
}

function makeRequestWithRetry(
  call                    ,
  retries        ,
)               {
  console.log('retries', retries)
  return call().catch(error => {
    console.error(error.message)
    if (retries > 0) {
      console.log(`Retrying... Attempts left: ${retries - 1}`)
      return makeRequestWithRetry(call, retries - 1)
    }
    return Promise.reject(error)
  })
}

function getHeaders(apiBase        , apiKey         )                     {
  let headers                     = {}
  if (apiKey) {
    headers = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      if (apiBase === 'https://api.openai.com') {
        // $FlowFixMe
        headers['Authorization'] = `Bearer ${apiKey}`
      } else if (apiBase === 'https://api.anthropic.com') {
        // $FlowFixMe
        headers['x-api-key'] = apiKey
        headers['anthropic-version'] = '2023-06-01'
      } else if (apiBase === 'https://api.mistral.ai') {
        // $FlowFixMe
        headers['Authorization'] = `Bearer ${apiKey}`
      }
    }
  }

  return headers
}

function getUrl(apiBase        )         {
  if (apiBase === 'https://api.openai.com') {
    return 'https://api.openai.com/v1/chat/completions'
  } else if (apiBase === 'https://api.anthropic.com') {
    return `https://api.anthropic.com/v1/messages`
  } else if (apiBase === 'https://api.mistral.ai') {
    return 'https://api.mistral.ai/v1/chat/completions'
  } else {
    return `${apiBase}/v1/chat/completions`
  }
}

function getBody(apiBase        , messages                   , completionOptions                  , stream         )      {
  if (apiBase === 'https://api.openai.com') {
    return {
      ...completionOptions,
      messages,
      stream,
    }
  } else if (apiBase === 'https://api.anthropic.com') {
    const systemMessages = messages.filter(message => message.role === 'system')
    const nonSystemMessages = messages.filter(message => message.role !== 'system')

    const system = systemMessages.map(message => message.content).join('\n\n')

    return {
      ...completionOptions,
      system,
      messages: nonSystemMessages,
      stream,
    }
  } else if (apiBase === 'https://api.mistral.ai') {
    return {
      ...completionOptions,
      messages,
      stream,
    }
  } else {
    return {
      ...completionOptions,
      messages,
      stream,
    }
  }
}

async function send(
  url        ,
  data                 ,
  headers                 ,
)      {
  const config      = {
    method: 'POST',
    url,
    data,
    headers,
    timeout: 10000
  }

  // if (authToken) {
  //   config.headers = {
  //     Authorization: `Bearer ${authToken}`,
  //   }
  // }
  //
  // if (method === 'GET') {
  //   // $FlowFixMe
  //   config.params = data
  // } else if (method === 'POST') {
  //   // $FlowFixMe
  //   config.data = data
  // }

  // console.debug(
  //   `Sending ${method} request to ${url}`,
  // )

  // $FlowFixMe
  // config.timeout = 10000

  const res = await makeRequestWithRetry(
    () =>
      axios(config)
        .then(response => {
          return response.data
        })
        .catch(err => {
          // parseAxiosError will throw when a connection cannot be established.
          return parseAxiosError(err)
        })
        .then(response => {
          if (response.error) {
            throw new Error(response.error.message)
          } else {
            return response
          }
        }),
    3,
  ).catch(err => {
    console.error(err)
    return {
      error: err,
    }
  })
  return res
}

export function canUseJSON(model        )          {
  return model === 'gpt-4-1106-preview' || model === 'gpt-3.5-turbo-1106'
}
