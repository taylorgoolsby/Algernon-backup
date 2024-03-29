// @flow

import {makeObservable, observable, computed} from 'mobx'

class ModalStore {
  openModal: boolean = false
  errorMessage: string = ''

  confirmTitle: string = ''
  confirmMessage: string = ''
  confirmCallback: ?(confirmed: boolean) => void

  constructor() {
    makeObservable(this, {
      openModal: observable,
      errorMessage: observable,
      confirmTitle: observable,
      confirmMessage: observable,
    })
  }

  close: () => void = () => {
    this.openModal = false
    this.errorMessage = ''
    this.confirmTitle = ''
    this.confirmMessage = ''
    this.confirmCallback = null
  }

  showError(message: string) {
    this.openModal = true
    this.errorMessage = message
  }

  confirm(title: string, message: string): Promise<boolean> {
    this.openModal = true
    this.confirmTitle = title
    this.confirmMessage = message
    return new Promise((resolve) => {
      this.confirmCallback = (confirmed) => {
        this.close()
        resolve(confirmed)
      }
    })
  }
}

const modalStore: ModalStore = new ModalStore()

export default modalStore
