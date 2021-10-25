import AbstractWatcher from "./AbstractWatcher"

export default class ResizeWatcher extends AbstractWatcher {
  #observer: ResizeObserver

  get watching(): boolean {
    return !!this.#observer
  }

  doStart() {
    const resizeObserver = new ResizeObserver(() => this.callback(this.el))
    resizeObserver.observe(this.el)

    this.#observer = resizeObserver
  }

  doStop() {
    this.#observer.disconnect()
    this.#observer = undefined
  }
}
