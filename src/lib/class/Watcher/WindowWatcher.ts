import WatcherInterface from "./WatcherInterface"
import WatcherCallback from "./WatcherCallback"

export default class WindowWatcher implements WatcherInterface {
  readonly #el: HTMLElement
  readonly #callback: WatcherCallback

  #controller: AbortController

  constructor(el: HTMLElement, callback: WatcherCallback) {
    this.#el = el
    this.#callback = callback
  }

  start() {
    if (this.#controller) {
      return
    }

    const win: Window = this.#el.ownerDocument.defaultView
    this.#controller = new AbortController()

    win.addEventListener("resize", () => this.#callback(this.#el), {
      signal: this.#controller.signal,
    })
  }

  stop() {
    this.#controller.abort()
    this.#controller = undefined
  }

  get watching(): boolean {
    return !!this.#controller
  }
}
