import AbstractWatcher from "./AbstractWatcher"
import WatcherCallback from "./WatcherCallback"

export default class StartStopWatcher extends AbstractWatcher {
  // TODO switch to TS `private` and use parameter promotion
  #controller: AbortController
  #stopCallback: WatcherCallback

  readonly #startEvents: string[]
  readonly #stopEvents: string[]

  constructor(
    el: HTMLElement,
    startCallback: WatcherCallback,
    stopCallback: WatcherCallback,
    startEvents: string[],
    stopEvents: string[],
  ) {
    super(el, startCallback)
    this.#stopCallback = stopCallback
    this.#startEvents = startEvents
    this.#stopEvents = stopEvents
  }

  /** Start listening for the trigger to add this element to the render list */
  protected doStart() {
    const controller = new AbortController()
    const handlerArgs = { signal: controller.signal }
    const handleOnceArgs = { once: true, ...handlerArgs }
    const self = this

    for (const startEvent of this.#startEvents) {
      this.el.addEventListener(startEvent, handleStartEvent, handlerArgs)
    }

    for (const stopEvent of self.#stopEvents) {
      this.el.addEventListener(stopEvent, handleStopEvent, handleOnceArgs)
    }

    this.#controller = controller

    function handleStartEvent() {
      controller.signal.addEventListener("abort", handleStopEvent)
      self.callback(self.el)
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
