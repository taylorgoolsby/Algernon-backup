// @flow

import type { ModelConfig } from "../types/ModelConfig";
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";
import InferenceRest from "../rest/InferenceRest";
import BingSearch from "../rest/BingSearch";
import axios from "axios";
import parseAxiosError from "../utils/parseAxiosError";
import { syncTextResponse } from "./generateTextResponse";
const sanitizeHtml = require('sanitize-html');

type WebPage = {
  name: string,
  url: string,
  snippet: string,
}

type WebPages = Array<WebPage>

class Browser {
  static async checkAndSearch(
    model: ModelConfig,
    message: MessageSQL,
  ): Promise<?string> {
    try {
      const text = message.text;
      const determination = await Browser.determine(model, text);

      console.log("determination", determination);

      if ((determination?.isSearchNeeded ?? false) && !!determination?.searchFor) {
        const webPages = await Browser.performSearch(determination.searchFor);
        const url = await Browser.choose(model, text, webPages);
        console.log("url", url);
        if (url) {
          const html = await Browser.visitPage(url);
          console.log("html.length", html?.length);
          if (html) {
            const summary = await Browser.extract(model, text, html);
            console.log("search summary", summary);
            return summary
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async determine(
    model: ModelConfig,
    text: string,
  ): Promise<?{ isSearchNeeded: boolean, searchFor: string }> {
    // todo: fine-tune the model to produce determination.
    const context = [
      {
        role: 'system',
        content: `Objective:
Determine if an external search is required based on the user's query and return a JSON response. The response should either indicate that a search is needed along with the search terms or indicate that no search is needed.

Instructions:

When analyzing the user's input, consider the following:

    Is the user asking for specific, factual information that is likely available on the web (e.g., current events, specific details, definitions)?
    Is the user requesting updated information or data that may change frequently (e.g., weather updates, stock prices, news)?
    Is the user asking for general knowledge or common facts that might already be within your training data?
    Is the user seeking subjective advice, opinions, or creative content that does not require an external search?

Analyze the user's query to decide whether the information required is already known or if an external search should be conducted. Respond only with JSON in the following format:

    {"isSearchNeeded": true, "searchFor": "some search terms"}

or    
    
    {"isSearchNeeded": false, "searchFor": ""}

Examples:
Example 1:
User Query: "What is the capital of France?"
Response: {"isSearchNeeded": false, "searchFor": ""}

Example 2:
User Query: "Can you tell me the latest news about the Mars rover?"
Response: {"isSearchNeeded": true, "searchFor": "latest news about Mars rover"}

Example 3:
User Query: "How do I solve a quadratic equation?"
Response: {"isSearchNeeded": false, "searchFor": ""}

Example 4:
User Query: "What are the recent updates on the COVID-19 vaccine?"
Response: {"isSearchNeeded": true, "searchFor": "recent updates on COVID-19 vaccine"}

Example 5:
User Query: "Who won the Best Picture Oscar in 2023?"
Response: {"isSearchNeeded": true, "searchFor": "Best Picture Oscar 2023"}

Example 6:
User Query: "What's the weather like in New York today?"
Response: {"isSearchNeeded": true, "searchFor": "current weather in New York"}

Example 7:
User Query: "Explain the theory of relativity."
Response: {"isSearchNeeded": false, "searchFor": ""}

Example 8:
User Query: "Tell me about the plot of 'The Great Gatsby'."
Response: {"isSearchNeeded": false, "searchFor": ""}

Example 9:
User Query: "Find the latest tech trends for 2024."
Response: {"isSearchNeeded": true, "searchFor": "latest tech trends 2024"}`,
      },
      {
        role: 'user',
        content: text,
      },
    ]

    // Make a completion call with retry in case the JSON is not parseable:
    let determination = null
    for (let i = 0; i < 3; i++) {
      // todo: Use prompt formatting to encourage JSON output.
      const res = await syncTextResponse(model, context)
      const rawJSON = res.choices[0]?.message?.content ?? ''
      try {
        determination = JSON.parse(rawJSON)
        if (!determination.hasOwnProperty('isSearchNeeded')) {
          throw new Error('determination missing isSearchNeeded')
        }
        if (!determination.hasOwnProperty('searchFor')) {
          throw new Error('determination missing searchFor')
        }
        break
      } catch (err) {
        console.error(err)
        console.warn('Search determination is not valid JSON', rawJSON)
      }
    }

    return determination
  }

  static async performSearch(text: string): Promise<WebPages> {
    const data = await BingSearch.search(text)
    const pages: WebPages = (data?.webPages?.value ?? []).map((item): WebPage => {
      return {
        name: item.name,
        url: item.url,
        snippet: item.snippet,
      }
    })
    return pages
  }

  static async choose(
    model: ModelConfig,
    text: string,
    webPages: WebPages,
  ): Promise<?string> {
    if (!webPages.length) return ''

    const context = [
      {
        role: 'system',
        content: `Objective:
Given an array of search results (web pages), select the most relevant URL based on the user query. Respond with a JSON object indicating the selected URL to visit.

Instructions:
Analyze the array of web pages returned from the search API. Based on the context and relevance to the user query, choose the best URL. Respond only with JSON in the following format:

    {"goToUrl": "https://..."}

Examples:
Example 1:
User Query: "What is the weather like today in Marina CA?"
Web Pages Array: [
  {"name": "Marina, CA Weather Forecast | AccuWeather", "snippet": "Marina, CA Weather Forecast, with current conditions, wind, air quality, and what to expect for the next 3 days.", "url": "https://www.accuweather.com/en/us/marina/93933/weather-forecast/337145"},
  {"name": "10-Day Weather Forecast for Marina, CA - The Weather Channel", "snippet": "Be prepared with the most accurate 10-day forecast for Marina, CA with highs, lows, chance of precipitation from The Weather Channel and Weather.com", "url": "https://weather.com/weather/tenday/l/Marina+CA?canonicalCityId=e86d5eed2dafb340edd5370a0f8352556b1ec7050201f59e2e86105b26d42f80"}
]
Response: {"goToUrl": "https://www.accuweather.com/en/us/marina/93933/weather-forecast/337145"}

Example 2:
User Query: "What is the latest news on the Mars rover?"
Web Pages Array: [
  {"name": "NASA's Mars Rover Mission Updates", "snippet": "Get the latest news and updates on NASA's Mars Rover missions.", "url": "https://mars.nasa.gov/news/"},
  {"name": "BBC Science News - Mars Rover", "snippet": "Read the latest news on the Mars Rover missions from BBC Science.", "url": "https://www.bbc.com/news/science-environment-56652329"}
]
Response: {"goToUrl": "https://mars.nasa.gov/news/"}

Example 3:
User Query: "How do I solve a quadratic equation?"
Web Pages Array: [
  {"name": "Khan Academy - Quadratic Equations", "snippet": "Learn how to solve quadratic equations with video lessons and practice problems.", "url": "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics"},
  {"name": "Math is Fun - Quadratic Equation Solver", "snippet": "Use this calculator to solve quadratic equations.", "url": "https://www.mathsisfun.com/quadratic-equation-solver.html"}
]
Response: {"goToUrl": "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics"}

Example 4:
User Query: "What are the top programming languages to learn in 2024?"
Web Pages Array: [
  {"name": "Top Programming Languages in 2024 | Tech Radar", "snippet": "Find out which programming languages are expected to dominate in 2024.", "url": "https://www.techradar.com/best-programming-languages-2024"},
  {"name": "The 10 Most Popular Programming Languages to Learn in 2024 | Wired", "snippet": "A comprehensive guide to the most popular programming languages in 2024.", "url": "https://www.wired.com/story/popular-programming-languages-2024"}
]
Response: {"goToUrl": "https://www.techradar.com/best-programming-languages-2024"}
`,
      },
      {
        role: 'user',
        content: `User Query: ${text}
Web Pages Array: ${JSON.stringify(webPages, null, '  ')}`,
      },
    ]

    // Make a completion call with retry in case the JSON is not parseable:
    let results = null
    for (let i = 0; i < 3; i++) {
      // todo: Use prompt formatting to encourage JSON output.
      const res = await syncTextResponse(model, context)
      const rawJSON = res.choices[0]?.message?.content ?? ''
      try {
        console.log("rawJSON", rawJSON);
        results = JSON.parse(rawJSON)
        if (!results.hasOwnProperty('goToUrl')) {
          throw new Error('chooseUrl missing goToUrl')
        }
        break
      } catch (err) {
        console.error(err)
        console.warn('ChooseUrl results is not valid JSON', rawJSON)
      }
    }

    return results?.goToUrl ?? ''
  }

  static async visitPage(url: string): Promise<?string> {
    const config: any = {
      method: 'GET',
      url,
      timeout: 10000
    }

    const html = await axios(config).then(response => {
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
      })

    if (typeof html === 'string') {
      return simplifyHtml(html)
    }
  }

  static async extract(
    model: ModelConfig,
    text: string,
    html: string,
  ): Promise<?string> {
    const context = [
      {
        role: 'system',
        content: `Objective:
Given the index HTML of a web page and the original user query, extract the relevant information and provide a concise summary. Respond only with JSON in the following format:

    {"summary": "extracted information"}

Instructions:
Analyze the provided HTML content and the user query to identify and extract the relevant information. Respond only with JSON.

Examples:
Example 1:

User Query:
"What is the weather like today in Marina CA"

HTML Content:
<!DOCTYPE html>
<html>
<head>
    <title>Marina, CA Weather Forecast | AccuWeather</title>
</head>
<body>
    <div id="current-weather">
        <h2>Current Weather in Marina, CA</h2>
        <p>Temperature: 68°F</p>
        <p>Condition: Partly Cloudy</p>
        <p>Humidity: 72%</p>
    </div>
</body>
</html>

Response:
{"summary": "The current weather in Marina, CA is 68°F with partly cloudy conditions and 72% humidity."}

Example 2:

User Query:
"Latest news on the Mars rover"

HTML Content:
<!DOCTYPE html>
<html>
<head>
    <title>NASA's Mars Rover Mission Updates</title>
</head>
<body>
    <div class="news-article">
        <h1>NASA's Perseverance Rover Discovers New Evidence of Ancient Life on Mars</h1>
        <p>NASA's Perseverance rover has discovered new signs of ancient microbial life on Mars...</p>
    </div>
</body>
</html>

Response:
{"summary": "NASA's Perseverance rover has discovered new signs of ancient microbial life on Mars."}

Example 3:

User Query:
"How to solve a quadratic equation"

HTML Content:
<!DOCTYPE html>
<html>
<head>
    <title>Quadratic Equations | Khan Academy</title>
</head>
<body>
    <div class="lesson-content">
        <h2>Solving Quadratic Equations</h2>
        <p>To solve a quadratic equation, you can use the quadratic formula: x = (-b ± √(b²-4ac)) / (2a).</p>
    </div>
</body>
</html>

Response:
{"summary": "To solve a quadratic equation, you can use the quadratic formula: x = (-b ± √(b²-4ac)) / (2a)."}

Example 4:

User Query:
"Best programming languages to learn in 2024"

HTML Content:
<!DOCTYPE html>
<html>
<head>
    <title>Top Programming Languages in 2024 | Tech Radar</title>
</head>
<body>
    <div class="article-content">
        <h1>Top Programming Languages to Learn in 2024</h1>
        <p>1. Python: Widely used for web development, data analysis, and artificial intelligence.</p>
        <p>2. JavaScript: Essential for front-end development and widely used in full-stack development.</p>
    </div>
</body>
</html>

Response:
{"summary": "Top programming languages to learn in 2024 are Python, widely used for web development, data analysis, and AI, and JavaScript, essential for front-end and full-stack development."}
`,
      },
      {
        role: 'user',
        content: `User Query: ${text}
HTML Content: ${html}`,
      },
    ]

    console.log("context", context);

    // Make a completion call with retry in case the JSON is not parseable:
    let results = null
    for (let i = 0; i < 3; i++) {
      // todo: Use prompt formatting to encourage JSON output.
      const res = await syncTextResponse(model, context)
      console.log("res", res);
      const rawJSON = res.choices[0]?.message?.content ?? ''
      try {
        console.log("rawJSON", rawJSON);
        results = JSON.parse(rawJSON)
        if (!results.hasOwnProperty('summary')) {
          throw new Error('extractHtml missing summary')
        }
        break
      } catch (err) {
        console.error(err)
        console.warn('extractHtml results is not valid JSON', rawJSON)
      }
    }

    return results?.summary ?? ''
  }
}

function simplifyHtml(html: string): string {
  // Sanitize the input HTML
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      'img': ['alt']
    },
    exclusiveFilter: function(frame) {
      // Remove empty elements
      return !frame.text.trim() && frame.tag !== 'img';
    }
  });

  // Remove excessive whitespace
  const cleanedHtml = sanitizedHtml.replace(/\s+/g, ' ').trim();

  return cleanedHtml;
}

export default Browser
