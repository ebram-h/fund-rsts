import { Modal } from "bootstrap"
import { render } from "vue"

export function showModal(title, body) {
  const modalElement = document.getElementById("mainModal")
  const titleElement = modalElement.querySelector(".modal-title")
  const bodyElement = modalElement.querySelector(".modal-body")

  titleElement.innerHTML = title
  render(body, bodyElement)

  const modal = new Modal(modalElement, {})
  modal.show()
}

export function hideModal() {
  const modalElement = document.getElementById("mainModal")
  const closeButton = modalElement.querySelector(".btn-close")

  closeButton.click()
}
