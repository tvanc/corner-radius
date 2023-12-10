import AbstractWatcher from "./AbstractWatcher"
import WatcherCallback from "./WatcherCallback"

export default class StartStopWatcher extends AbstractWatcher {
  // TODO switch to TS `private` and use parameter promotion
  #controller: AbortController
  #cancelCallback: WatcherCallback
  #stopCallback: WatcherCallback

  readonly #startEvents: string[]
  readonly #cancelEvents: string[]
  readonly #stopEvents: string[]

  constructor(
    el: HTMLElement,
    startCallback: WatcherCallback,
    cancelCallback: WatcherCallback,
    stopCallback: WatcherCallback,
    startEvents: string[],
    cancelEvents: string[],
    stopEvents: string[],
  ) {
    super(el, startCallback)
    this.#cancelCallback = cancelCallback
    this.#stopCallback = stopCallback
    this.#startEvents = startEvents
    this.#cancelEvents = cancelEvents
    this.#stopEvents = stopEvents
  }

  /** Start listening for the trigger to add this element to the render list */
  protected doStart() {
    const controller = new AbortController()
    const handlerArgs = { signal: controller.signal }
    const self = this

    for (const startEvent of this.#startEvents) {
      this.el.addEventListener(startEvent, handleStartEvent, handlerArgs)
    }

    for (const cancelEvent of self.#cancelEvents) {
      this.el.addEventListener(cancelEvent, handleCancelEvent, handlerArgs)
    }

    for (const stopEvent of self.#stopEvents) {
      this.el.addEventListener(stopEvent, handleStopEvent, handlerArgs)
    }

    this.#controller = controller

    function handleStartEvent() {
      controller.signal.addEventListener("abort", handleStopEvent)
      self.callback(self.el)
    }

    function handleCancelEvent() {
      self.#cancelCallback?.(self.el)
    }

    function handleStopEvent() {
      self.#stopCallback(self.el)
    }

    return this
  }

  /**
   * Remove all the listeners
   * @protected
   */
  protected doStop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
