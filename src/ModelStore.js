// @flow

import RNFS from 'react-native-fs'
import type {ModelConfig} from './types/ModelConfig.js'

/*
export type ModelConfig = {
  // This tries to conform to the naming scheme used by continue.dev config: https://continue.dev/docs/reference/Model%20Providers/openai
  title: string,
  apiBase: string,
  apiKey?: ?string,
  completionOptions?: ?{ ... },
}
*
*/

export type EditableModelConfig = {
  local?: ?boolean,
  title: string,
  apiBase: string,
  apiKey: string,
  completionOptions: Array<{name: string, value: string}>,
}

const path = `${RNFS.DocumentDirectoryPath}/models.json`

export default class ModelStore {
  static models: Array<ModelConfig>
  static editableModels: Array<EditableModelConfig>
  static selectedModel: ?ModelConfig

  static async save(models: Array<EditableModelConfig>): Promise<void> {
    if (!models.length) {
      models.push({
        local: true,
        title: 'Built-In Phi-2',
        apiBase: '',
        apiKey: '',
        completionOptions: [],
      })
    }

    console.log("saving models", models);

    const modelsToSave = models.filter(
      model =>
        !!model.local || !!model.title,
    ).map((model) => {
      return {
        ...model,
        completionOptions: model.completionOptions.filter(option => (!!option.name))
      }
    })

    await RNFS.writeFile(path, JSON.stringify(modelsToSave), 'utf8')

    // Convert models from EditableModelConfig to ModelConfig:
    ModelStore.models = modelsToSave.map((model: EditableModelConfig) => {
      return {
        title: model.title,
        apiBase: model.apiBase,
        apiKey: model.apiKey,
        completionOptions: model.completionOptions.reduce((acc, option) => {
          // $FlowFixMe
          acc[option.name] = option.value
          return acc
        }, {}),
      }
    })
  }

  static load(): void {
    Promise.resolve().then(async () => {
      let models: Array<EditableModelConfig> = []

      try {
        const modelsJson = await RNFS.readFile(path, 'utf8')
        models = JSON.parse(modelsJson)
      } catch (err) {
        console.error(err)
      }

      if (!models.length) {
        models = [
          {
            local: true,
            title: 'Built-In Phi-2',
            apiBase: '',
            apiKey: '',
            completionOptions: [],
          },
        ]
      }

      console.log('Models loaded', models)

      // Convert models from EditableModelConfig to ModelConfig:
      ModelStore.models = models
        .filter(
          model =>
            !!model.local || !!model.title,
        )
        .map((model: EditableModelConfig) => {
          return {
            title: model.title,
            apiBase: model.apiBase,
            apiKey: model.apiKey,
            completionOptions: model.completionOptions.reduce((acc, option) => {
              // $FlowFixMe
              acc[option.name] = option.value
              return acc
            }, {}),
          }
        })

      if (!ModelStore.selectedModel) {
        ModelStore.selectedModel = ModelStore.models[0]
      }

      ModelStore.editableModels = models
    })
  }

  static selectModel(model: ModelConfig) {
    ModelStore.selectedModel = model
  }
}
