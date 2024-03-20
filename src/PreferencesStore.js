// @flow

import RNFS from 'react-native-fs'
import type {ModelConfig} from './types/ModelConfig.js'
import {makeObservable, observable} from 'mobx'

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

const path = `${RNFS.DocumentDirectoryPath}/preferences.json`

export class PreferencesStore {
  models: Array<ModelConfig> = []
  editableModels: Array<EditableModelConfig> = []
  selectedModel: ?ModelConfig = null

  constructor() {
    makeObservable(this, {
      selectedModel: observable,
    })
  }

  async save(models: Array<EditableModelConfig>): Promise<void> {
    if (!models.length) {
      models.push({
        local: true,
        title: 'Built-In Phi-2',
        apiBase: '',
        apiKey: '',
        completionOptions: [],
      })
    }

    const modelsToSave = models
      .filter(model => !!model.local || !!model.title)
      .map(model => {
        return {
          ...model,
          completionOptions: model.completionOptions.filter(
            option => !!option.name,
          ),
        }
      })

    const preferences = {
      editableModels: modelsToSave,
      selectedModel: this.selectedModel,
    }

    console.log('saving preferences', JSON.stringify(preferences))

    await RNFS.writeFile(path, JSON.stringify(preferences), 'utf8')

    // Convert models from EditableModelConfig to ModelConfig:
    this.editableModels = modelsToSave
    this.models = modelsToSave.map((model: EditableModelConfig) => {
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

  load(): void {
    Promise.resolve().then(async () => {
      let preferences

      try {
        const preferencesJson = await RNFS.readFile(path, 'utf8')
        console.log('Preferences loaded', preferencesJson)
        preferences = JSON.parse(preferencesJson)
      } catch (err) {
        console.error(err)
        preferences = {
          editableModels: [],
          selectedModel: null,
        }
      }

      this.editableModels = preferences.editableModels ?? []

      if (!this.editableModels.length) {
        this.editableModels = [
          {
            local: true,
            title: 'Built-In Phi-2',
            apiBase: '',
            apiKey: '',
            completionOptions: [],
          },
        ]
      }

      // Convert models from EditableModelConfig to ModelConfig:
      this.models = this.editableModels
        .filter(model => !!model.local || !!model.title)
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

      // console.log("this.models", this.models);
      // console.log("this.selectedModel", this.selectedModel);
      if (!this.selectedModel) {
        // console.log('setting default model')
        this.selectedModel = preferences.selectedModel || this.models[0]
      }
    })
  }

  selectModel(model: ModelConfig) {
    this.selectedModel = model
    this.save(this.editableModels).catch(err => {
      console.error(err)
    })
  }
}

const preferencesStore: PreferencesStore = new PreferencesStore()
export default preferencesStore
