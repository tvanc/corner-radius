import WatcherInterface from "./WatcherInterface"
import WatcherCallback from "./WatcherCallback"

export default abstract class AbstractWatcher implements WatcherInterface {
  protected readonly el: HTMLElement
  protected readonly callback: WatcherCallback

  abstract get watching(): boolean

  protected abstract doStart()

  protected abstract doStop()

  constructor(el: HTMLElement, callback: WatcherCallback) {
    this.el = el
    this.callback = callback
  }

  start() {
    if (!this.watching) {
      this.doStart()
    }
  }

  stop() {
    if (this.watching) {
      this.doStop()
    }
  }
}
