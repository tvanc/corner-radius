import AbstractWatcher from "./AbstractWatcher"

export default class ResizeWatcher extends AbstractWatcher {
  #observer: ResizeObserver

  protected doStart() {
    const resizeObserver = new ResizeObserver(() => this.callback(this.el))
    resizeObserver.observe(this.el)

    this.#observer = resizeObserver
  }

  protected doStop() {
    this.#observer.disconnect()
    this.#observer = undefined
  }
}
