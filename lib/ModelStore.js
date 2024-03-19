//      

import RNFS from 'react-native-fs'
                                                       
import { makeObservable, observable } from "mobx";

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

                                   
                   
                
                  
                 
                                                          
 

const path = `${RNFS.DocumentDirectoryPath}/models.json`

export class ModelStore {
  models                    
  editableModels                            
  selectedModel               = null

  constructor() {
    makeObservable(this, {
      selectedModel: observable
    });
  }

  async save(models                            )                {
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
    this.models = modelsToSave.map((model                     ) => {
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

  load()       {
    Promise.resolve().then(async () => {
      let models                             = []

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
      this.models = models
        .filter(
          model =>
            !!model.local || !!model.title,
        )
        .map((model                     ) => {
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
        this.selectedModel = this.models[0]
      }

      this.editableModels = models
    })
  }

  selectModel(model             ) {
    this.selectedModel = model
  }
}

const modelStore             = new ModelStore();
export default modelStore;
