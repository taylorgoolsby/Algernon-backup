// @flow

import type { MessageSQL } from '../schema/Message/MessageSchema.mjs'
import AnnotationInterface from '../schema/Annotation/AnnotationInterface.js'
import InferenceRest from '../rest/InferenceRest.js'
import type {ModelConfig} from "../types/ModelConfig.js";
import { NativeModules } from 'react-native';

const { TextFeatureExtractor, FaissBridge } = NativeModules;

FaissBridge.init(384).then(() => console.log('faiss initialized')).catch(error => {
  console.error(error);
})

// const MODEL = 'Xenova/all-MiniLM-L6-v2'
// const D = 384
// const INDEX_PATH = 'index.faiss'
const DISTANCE_THRESHOLD = 0.25
// let pipe: any
// let index: any

export default class LongTermAnnotation {
  /*
  Long term annotation will take the text of a message and:
  1. Pass it through an agent which will pick out a list annotations.
  2. Store each annotation in a mysql database, Annotation table, producing a unique ID.
  3. Store each annotation in a vector database with this ID.
  4. Later, on retrieval, a vector similarity search is used to find annotations close to a topic. This returns IDs.
  5. The ID is used against mysql to get the annotation.
  6. Annotation rows are related to the Message row, so the original message can be retrieved.
  7. Both the retrieved annotations and the original message can be used generate the long term summary.
  * */
  static backgroundAnnotate(
    model: ModelConfig,
    message: MessageSQL,
  ): void {
    Promise.resolve().then(async () => {
      try {
        const text = message.text
        console.log('annotating', text)

        const annotations = await LongTermAnnotation.getAnnotations(
          model,
          text,
        )
        console.log("annotations", annotations);

        for (const annotationText of annotations) {
          const embedding: Array<number> = await TextFeatureExtractor.extractFeatures(annotationText)
          console.log("embedding", typeof embedding[0]);
          // const embedding = await pipe(annotationText, {
          //   pooling: 'mean',
          //   normalize: true,
          // })
          // const vector = Array.from(embedding.data)
          const annotationId = await LongTermAnnotation.insert(embedding)
          console.log('annotationId', annotationId)

          await AnnotationInterface.insert(
            annotationId,
            message.messageId,
            annotationText,
            embedding,
          )
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  static async getAnnotations(
    model: ModelConfig,
    text: string,
  ): Promise<Array<string>> {
    // todo: fine-tune the model to produce annotations.
    const context = [
      {
        role: 'system',
        content: `Your task is to read a given body of text and produce a list of annotations in the form of a JSON array. These annotations should highlight key points, themes, facts, events, and insights from personal experiences and stories mentioned within the text. The annotations should be concise, informative, and directly relevant to the content of the text. It is essential that all responses must be formatted as a JSON array containing strings only.

Your annotations should serve various purposes, including journaling (to capture personal experiences and insights), brainstorming (to generate ideas and themes for creative or analytical thinking), and knowledge base management (to organize and categorize information systematically).

There should always be at least one annotation. Please ensure your annotations capture a broad range of insights from the text, making them valuable for the intended purposes.

Examples:

1. Journaling Example:

Input Text:

"Today, I visited the new art exhibit at the city museum. It was an incredible experience, showcasing a wide range of modern art pieces. One particular piece, a large canvas painted in vibrant blues and greens, caught my eye. It reminded me of the ocean trips I used to take with my family. The day ended with a surprise visit from an old friend I hadn't seen in years. We talked for hours, catching up on life's ups and downs."

Generated Annotations:

[
  "Visited new art exhibit at the city museum - reminiscent of past personal experiences.",
  "Encountered an art piece that evoked memories of family ocean trips.",
  "Surprise reunion with an old friend, rekindling past connections and sharing life updates."
]

2. Brainstorming Example:

Input Text:

"Thinking about starting a project on urban sustainability. The idea is to integrate green spaces into city planning, promote renewable energy sources, and encourage community recycling programs. This could lead to more sustainable urban living environments and improved quality of life for city residents."

Generated Annotations:

[
  "Project idea: Urban sustainability - integrating green spaces into cities.",
  "Promotion of renewable energy sources as a key component.",
  "Encouraging community recycling programs for sustainability.",
  "Potential impact: Improved quality of life in urban environments."
]

3. Knowledge Base Management Example:

Input Text:

"In the study of ancient civilizations, the role of trade networks in the development of early societies is crucial. Trade allowed for the exchange of goods, ideas, and cultural practices across vast distances. The Silk Road is a prime example, connecting the East and West, and facilitating the spread of technologies, religions, and languages."

Generated Annotations:

[
  "Importance of trade networks in ancient civilizations.",
  "Exchange of goods, ideas, and cultural practices through trade.",
  "The Silk Road as a key example of early global trade networks.",
  "Spread of technologies, religions, and languages via the Silk Road."
]

When producing annotations, ensure they are tailored to capture the essence of each significant detail or theme, providing a clear and comprehensive overview of the text's key elements suitable for journaling, brainstorming, or knowledge base management.

The following are exmaples for Short Input Text:

Journaling Example for Short Input:

Input Text:

"Today, I went to the beach."

Generated Annotations:

["Beach visit - a day spent outdoors."]

Brainstorming Example for Short Input:

Input Text:

"Thinking of painting my room blue to feel more relaxed."

Generated Annotations:

["Room renovation idea: Painting walls blue for a relaxing atmosphere."]

Knowledge Base Management Example for Short Input:

Input Text:

"The Eiffel Tower was completed in 1889."

Generated Annotations:

["Eiffel Tower completion date: 1889."]

Examples Demonstrating When Not to Annotate:

Example of Non-Annotatable Short Response:

Input Text:
"yes"

Generated Annotations:

[]

Explanation: This input is a simple affirmation that does not provide any substantial information or context to be annotated.

Example of Non-Annotatable Acknowledgement:

Input Text:
"ok, got it"

Generated Annotations:

[]

Explanation: Similar to the previous example, this input is an acknowledgement without any informative content, thus not warranting an annotation.`,
      },
      {
        role: 'user',
        content: text,
      },
    ]

    // Make a completion call with retry in case the JSON is not parseable:
    let annotations: Array<string> = []
    for (let i = 0; i < 3; i++) {
      // todo: Use prompt formatting to encourage JSON output.
      const res = await InferenceRest.chatCompletion(model, context)
      const rawJSON = res.choices[0]?.message?.content ?? ''
      console.log('rawJSON for annotating', rawJSON)
      try {
        annotations = JSON.parse(rawJSON)
        break
      } catch (err) {
        console.error('Error parsing JSON', rawJSON)
      }
    }

    return annotations
  }

  /*
  Adds an embedding to the vector database.
  Returns the label of the embedding.
  * */
  static async insert(vector: Array<number>): Promise<number> {
    // let k = 1
    //
    // if (!index) {
    //   if (fs.existsSync(INDEX_PATH)) {
    //     index = Index.read(INDEX_PATH)
    //   } else {
    //     // index = Index.fromFactory(D, `"IVF${k},Flat"`, MetricType.METRIC_INNER_PRODUCT);
    //     index = Index.fromFactory(
    //       D,
    //       `IVF${k},Flat`,
    //       MetricType.METRIC_INNER_PRODUCT,
    //     )
    //     index.train(vector)
    //   }
    // }

    const label = FaissBridge.addVector(vector)
    return label
  }

  static async search(
    topic: string,
  ): Promise<{| distances: Array<number>, labels: Array<number> |}> {
    // if (!pipe) {
    //   pipe = await pipeline('feature-extraction', MODEL)
    // }

    const embedding = await TextFeatureExtractor.extractFeatures(topic)

    // const embedding = await pipe(topic, { pooling: 'mean', normalize: true })
    // const vector = Array.from(embedding.data)

    // if (!index) {
    //   if (fs.existsSync(INDEX_PATH)) {
    //     index = Index.read(INDEX_PATH)
    //   } else {
    //     throw new Error('Index not found')
    //   }
    // }
    const ntotal = await FaissBridge.ntotal()
    const k = Math.min(10, ntotal)
    const res = await FaissBridge.searchVectors(embedding, k)
    return res
  }

  static async detectTopic(
    model: ModelConfig,
    shortTermSummary: string,
    lastMessage: MessageSQL,
  ): Promise<string> {
    return shortTermSummary + '\n\n' + lastMessage.text
  }

  static async searchAndSummarize(
    model: ModelConfig,
    shortTermSummary: string,
    lastMessage: MessageSQL,
  ): Promise<string> {
    const topic = await LongTermAnnotation.detectTopic(
      model,
      shortTermSummary,
      lastMessage,
    )

    const vectorRes = await LongTermAnnotation.search(topic)
    console.log('vector search res', vectorRes)

    // Filter out labels which are below the distance threshold:
    const annotationIds = vectorRes.labels.filter(
      (label, i) => vectorRes.distances[i] > DISTANCE_THRESHOLD,
    )

    console.log("annotationIds", annotationIds);

    const annotations = await AnnotationInterface.retrieve(annotationIds)

    console.log("annotations", annotations);

    // todo: timezone

    const context = [
      {
        role: 'system',
        content: `Your task is to generate a concise summary from a given collection of annotations, focusing on retaining the most important information for long-term memory. The annotations are structured in JSON format, each containing a text field that holds the content of the annotation and a dateCreated field indicating when the annotation was created.
Instructions:

    Analyze the Annotations: Go through each annotation to understand its content and significance.

    Identify Key Information: Determine the most important information in each annotation that should be retained for long-term memory.

    Handle Time-sensitive Information: Pay close attention to the dateCreated field. For annotations with time-sensitive information, ensure the summary reflects the context of when the annotation was created.

    Generate Summary: Create a summary that encapsulates the key points from the annotations, weaving them into a coherent narrative if possible. The summary should be concise, informative, and tailored to aid in journaling and brainstorming by making connections with past stories and ideas.

Examples:

Input:

[
  {text: 'Started reading "Atomic Habits" by James Clear, excited to explore habit formation.', dateCreated: '2020-06-15T09:30:00.000Z'},
  {text: 'Atomic Habits: Small changes can lead to remarkable results by focusing on 1% improvements.', dateCreated: '2020-06-20T10:00:00.000Z'}
]

Output:

In June 2020, started exploring "Atomic Habits" by James Clear, focusing on the power of small changes and 1% improvements for remarkable results in habit formation.

Input:

[
  {text: 'Brainstorming session: Possible to use AI for personalized education?', dateCreated: '2021-03-05T14:00:00.000Z'},
  {text: 'Idea: Develop an app that adapts learning material based on student performance.', dateCreated: '2021-03-10T16:45:00.000Z'},
  {text: 'Feedback from mentor: Emphasize interactive elements and real-world applications.', dateCreated: '2021-03-12T13:20:00.000Z'}
]

Output:

    In March 2021, brainstormed the potential of AI in personalized education, leading to an idea for an app that customizes learning content according to student performance. Mentor feedback highlighted the importance of interactive elements and real-world applications.

This summary should serve as a reflective, insightful, and concise synthesis of the provided annotations, aiding the user in journaling and brainstorming activities by connecting with past insights and ideas.`,
      },
      {
        role: 'user',
        content: JSON.stringify(annotations),
      },
    ]

    // Make a completion call to get the long term summary:
    let summary = ''
    for (let i = 0; i < 3; i++) {
      const res = await InferenceRest.chatCompletion(model, context)
      summary = res.choices[0]?.message?.content ?? ''
      if (summary) {
        break
      }
    }

    return summary
  }
}
