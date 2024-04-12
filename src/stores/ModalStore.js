// @flow

import {makeObservable, observable, computed} from 'mobx'

class ModalStore {
  openModal: boolean = false

  title: ?string = null
  message: ?string = null
  primaryLabel: ?string = null
  secondaryLabel: ?string = null
  onPrimary: ?() => void = null
  onSecondary: ?() => void = null

  constructor() {
    makeObservable(this, {
      openModal: observable,
      title: observable,
      message: observable,
      primaryLabel: observable,
      secondaryLabel: observable,
      onPrimary: observable,
      onSecondary: observable,
    })
  }

  close: () => void = () => {
    this.openModal = false
    this.title = null
    this.message = null
    this.primaryLabel = null
    this.secondaryLabel = null
    this.onPrimary = null
    this.onSecondary = null
  }

  showError(message: string) {
    this.openModal = true
    this.message = message
  }

  confirm(title: ?string, message: ?string, primaryLabel?: ?string, secondaryLabel?: ?string): Promise<boolean> {
    this.openModal = true
    this.title = title
    this.message = message
    this.primaryLabel = primaryLabel ?? 'Yes'
    this.secondaryLabel = secondaryLabel ?? 'Nevermind'
    return new Promise((resolve) => {
      this.onPrimary = () => {
        this.close()
        resolve(true)
      }
      this.onSecondary = () => {
        this.close()
        resolve(false)
      }
    })
  }

  cta(title: ?string, message: string, primaryLabel: string, onPrimary: ?() => void): void {
    this.openModal = true
    this.title = title
    this.message = message
    this.primaryLabel = primaryLabel
    this.onPrimary = () => {
      this.close()
      if (onPrimary) onPrimary()
    }
  }
}

const modalStore: ModalStore = new ModalStore()

export default modalStore
