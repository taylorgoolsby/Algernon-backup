// @flow

import type { ModelConfig } from "../types/ModelConfig.js";

export default function normalizeModelName(model: ModelConfig) {
  if (model.completionOptions?.model) {
    return model.completionOptions?.model
  } else if (model.title.toLowerCase().includes('phi')) {
    return 'phi-2'
  }
}
