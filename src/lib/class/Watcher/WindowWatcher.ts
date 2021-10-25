import AbstractWatcher from "./AbstractWatcher"

export default class WindowWatcher extends AbstractWatcher {
  #controller: AbortController

  get watching(): boolean {
    return !!this.#controller
  }

  doStart() {
    const win: Window = this.el.ownerDocument.defaultView
    this.#controller = new AbortController()

    win.addEventListener("resize", () => this.callback(this.el), {
      signal: this.#controller.signal,
    })
  }

  doStop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
