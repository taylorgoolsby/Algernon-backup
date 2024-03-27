// @flow

import type { ModelConfig } from "../types/ModelConfig.js";

export default function normalizeModelName(model: ModelConfig): string {
  if (model.completionOptions?.model === 'gpt-4-turbo-preview') {
    return 'gpt-4'
  } else if (model.completionOptions?.model) {
    return model.completionOptions?.model
  } else if (model.title.toLowerCase().includes('phi')) {
    return 'phi-2'
  }
}
