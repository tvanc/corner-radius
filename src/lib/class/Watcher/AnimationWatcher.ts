import AbstractWatcher from "./AbstractWatcher"

export default class AnimationWatcher extends AbstractWatcher {
  #controller: AbortController

  get watching(): boolean {
    return !!this.#controller
  }

  doStart() {
    const { el, callback } = this
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
            callback(el)
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
        callback(el)
        inLoop = false
      }
    }

    this.#controller = controller

    return this
  }

  doStop() {
    this.#controller.abort()
    this.#controller = undefined
  }
}
