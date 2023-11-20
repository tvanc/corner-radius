import AbstractWatcher from "./AbstractWatcher"

export default class EventWatcher extends AbstractWatcher {
  #controller: AbortController

  readonly #startEvents: string[]
  readonly #stopEvents: string[]

  constructor(el, callback, startEvents: string[], stopEvents: string[]) {
    super(el, callback)
    this.#startEvents = startEvents
    this.#stopEvents = stopEvents
  }

  protected doStart() {
    const { el, callback } = this
    const controller = new AbortController()
    const handlerArgs = { signal: controller.signal }
    const handleOnceArgs = { once: true, ...handlerArgs }
    const self = this

    let inLoop = false
    let frame

    for (const startEvent of this.#startEvents) {
      el.addEventListener(startEvent, handleStartEvent, handlerArgs)
    }

    function handleStartEvent() {
      for (const stopEvent of self.#stopEvents) {
        el.addEventListener(stopEvent, stopRafLoop, handleOnceArgs)
      }

      controller.signal.addEventListener("abort", stopRafLoop)

      if (!inLoop) {
        inLoop = true

        frame = requestAnimationFrame(function rafLoop() {
          callback(el)
          frame = requestAnimationFrame(rafLoop)
        })
      }
    }

    function stopRafLoop() {
      if (inLoop) {
        cancelAnimationFrame(frame)
        callback(el)
        inLoop = false
      }
    }

    this.#controller = controller

    return this
  }

  protected doStop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
