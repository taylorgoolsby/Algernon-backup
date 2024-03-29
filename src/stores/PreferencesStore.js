// @flow

import RNFS from 'react-native-fs'
import type {ModelConfig} from '../types/ModelConfig.js'
import {makeObservable, observable, computed} from 'mobx'

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

const defaultModel: EditableModelConfig = {
  local: true,
  title: 'Built-In Phi-2',
  apiBase: '',
  apiKey: '',
  completionOptions: [],
}

export class PreferencesStore {
  loaded: boolean = false
  models: Array<ModelConfig> = []
  editableModels: Array<EditableModelConfig> = []
  selectedModelIndex: number = 0
  introCompleted: boolean = false

  constructor() {
    makeObservable(this, {
      loaded: observable,
      models: observable,
      selectedModelIndex: observable,
      selectedModel: computed,
      introCompleted: observable,
    })
  }

  get selectedModel(): ?ModelConfig {
    return this.models[this.selectedModelIndex] ?? defaultModel
  }

  reset() {
    this.loaded = true
    this.editableModels = [defaultModel]
    this.updateModels(this.editableModels)
    this.selectedModelIndex = 0
    this.introCompleted = false
  }

  updateModels(models: Array<EditableModelConfig>) {
    if (!models.length) {
      models.push(defaultModel)
    }
    this.editableModels = models

    // Remove incomplete data and convert completionOptions to object format:
    this.models = models
      .filter(model => !!model.local || !!model.title)
      .map((model: EditableModelConfig) => {
        return {
          ...model,
          completionOptions: model.completionOptions
            .filter(option => !!option.name)
            .reduce((acc, option) => {
              // $FlowFixMe
              acc[option.name] = option.value
              return acc
            }, {}),
        }
      })
  }

  async save(): Promise<void> {
    const preferences = {
      editableModels: this.editableModels,
      selectedModelIndex: this.selectedModelIndex,
      introCompleted: this.introCompleted,
    }
    console.log('saving preferences', JSON.stringify(preferences))
    await RNFS.writeFile(path, JSON.stringify(preferences), 'utf8')
  }

  async load(): Promise<void> {
    let preferences

    try {
      const preferencesJson = await RNFS.readFile(path, 'utf8')
      console.log('Preferences loaded', preferencesJson)
      preferences = JSON.parse(preferencesJson)
    } catch (err) {
      console.error(err)
      preferences = {
        editableModels: [],
        selectedModelIndex: 0,
      }
    }

    // $FlowFixMe
    this.editableModels = preferences.editableModels ?? []
    if (!this.editableModels.length) {
      this.editableModels = [defaultModel]
    }

    // Convert models from EditableModelConfig to ModelConfig:
    this.models = this.editableModels
      .filter(model => !!model.local || !!model.title)
      .map((model: EditableModelConfig) => {
        return {
          ...model,
          completionOptions: model.completionOptions.reduce((acc, option) => {
            // $FlowFixMe
            acc[option.name] = option.value
            return acc
          }, {}),
        }
      })

    this.selectedModelIndex = preferences.selectedModelIndex ?? 0

    this.introCompleted = preferences.introCompleted ?? false

    this.loaded = true
  }

  selectModel(modelIndex: number) {
    this.selectedModelIndex = modelIndex
    this.save().catch(err => {
      console.error(err)
    })
  }

  showIntro() {
    this.introCompleted = false
  }

  completeIntro() {
    this.introCompleted = true
  }
}

const preferencesStore: PreferencesStore = new PreferencesStore()
export default preferencesStore
