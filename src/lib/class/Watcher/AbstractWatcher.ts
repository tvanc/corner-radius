import WatcherInterface from "./WatcherInterface"
import WatcherCallback from "./WatcherCallback"

export default abstract class AbstractWatcher implements WatcherInterface {
  protected readonly el: HTMLElement
  protected readonly callback: WatcherCallback

  #watching = false

  protected abstract doStart()

  protected abstract doStop()

  constructor(el: HTMLElement, callback: WatcherCallback) {
    this.el = el
    this.callback = callback
  }

  get watching(): boolean {
    return this.#watching
  }

  start() {
    if (!this.#watching) {
      this.doStart()
      this.#watching = true
    }
  }

  stop() {
    if (this.#watching) {
      this.doStop()
      this.#watching = false
    }
  }
}
