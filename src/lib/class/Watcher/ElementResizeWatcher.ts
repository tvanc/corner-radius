import AbstractWatcher from "./AbstractWatcher"

export default class ElementResizeWatcher extends AbstractWatcher {
  #observer: ResizeObserver

  /**
   * Start the observer. Calling `resizeObserver.observe(...)` triggers the
   * observer callback even if no resizing has occurred. We can't just skip
   * the first callback because resizing may occur between when the watcher
   * is started and when the callback is triggered. So instead, we measure
   * the element when the watcher starts and when the callback triggers and
   * check in the callback's first run to see if the element has changed size.
   */
  protected doStart() {
    let startRect = this.el.getBoundingClientRect()
    const resizeObserver = new ResizeObserver((records) => {
      if (startRect && records.length === 1) {
        const { blockSize, inlineSize } = records[0].borderBoxSize[0]
        if (startRect.height !== blockSize || startRect.width !== inlineSize) {
          this.callback(this.el)
        }
        startRect = undefined
      } else {
        this.callback(this.el)
      }
    })

    resizeObserver.observe(this.el)

    this.#observer = resizeObserver
  }

  protected doStop() {
    this.#observer.disconnect()
    this.#observer = undefined
  }
}
