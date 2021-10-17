import WatcherInterface from "./WatcherInterface"
import WatcherCallback from "./WatcherCallback"

export default class AnimationWatcher implements WatcherInterface {
  readonly #el: HTMLElement
  readonly #callback: WatcherCallback

  #controller: AbortController

  constructor(el: HTMLElement, callback: WatcherCallback) {
    this.#el = el
    this.#callback = callback
  }

  get watching(): boolean {
    return !!this.#controller
  }

  start() {
    if (this.#controller) {
      return this
    }

    const el = this.#el
    const self = this
    const win = el.ownerDocument.defaultView

    const controller = new AbortController()
    const handlerArgs = { signal: controller.signal }

    let inLoop = false
    let stopTime, frame

    el.addEventListener(
      "animationstart",
      function () {
        const style = win.getComputedStyle(el)
        const duration = style.getPropertyValue("animation-duration")

        startRafLoop(parseFloat(duration) * 1000)
      },
      handlerArgs,
    )

    el.addEventListener("animationend", stopRafLoop, handlerArgs)
    el.addEventListener("animationcancel", stopRafLoop, handlerArgs)
    controller.signal.addEventListener("abort", stopRafLoop)

    function startRafLoop(duration) {
      stopTime = performance.now() + duration

      if (!inLoop) {
        inLoop = true

        frame = requestAnimationFrame(function rafLoop() {
          if (inLoop && performance.now() < stopTime) {
            self.#callback(el)
            frame = requestAnimationFrame(rafLoop)
          } else {
            stopRafLoop()
          }
        })
      }
    }

    function stopRafLoop() {
      if (inLoop) {
        cancelAnimationFrame(frame)
        self.#callback(el)
        inLoop = false
      }
    }

    this.#controller = controller

    return this
  }

  stop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
