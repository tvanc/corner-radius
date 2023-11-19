import AbstractWatcher from "./AbstractWatcher"

export default class WindowResizeWatcher extends AbstractWatcher {
  #controller: AbortController

  protected doStart() {
    const win: Window = this.el.ownerDocument.defaultView
    this.#controller = new AbortController()

    win.addEventListener("resize", () => this.callback(this.el), {
      signal: this.#controller.signal,
    })
  }

  protected doStop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
