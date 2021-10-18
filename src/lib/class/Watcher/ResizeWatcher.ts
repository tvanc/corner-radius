import WatcherInterface from "./WatcherInterface"
import WatcherCallback from "./WatcherCallback"

export default class ResizeWatcher implements WatcherInterface {
  readonly #el: HTMLElement
  readonly #callback: WatcherCallback

  #observer: ResizeObserver

  constructor(el: HTMLElement, callback: WatcherCallback) {
    this.#el = el
    this.#callback = callback
  }

  start() {
    if (this.#observer) {
      return
    }

    const resizeObserver = new ResizeObserver(() => this.#callback(this.#el))
    resizeObserver.observe(this.#el)

    this.#observer = resizeObserver
  }

  stop() {
    this.#observer.disconnect()
    this.#observer = undefined
  }

  get watching(): boolean {
    return !!this.#observer
  }
}
