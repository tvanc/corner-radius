import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"

const resizeObservers: WeakMap<HTMLElement, ResizeObserver> = new WeakMap()
const watchCallbacks: WeakMap<HTMLElement, Function> = new WeakMap()

export function watchElement(
  el: HTMLElement,
  {
    animations = false,
    elementResize = false,
    windowResize = false,
  }: WatchOptions = {
    animations: true,
    elementResize: true,
    windowResize: true,
  },
) {
  const tracer = Tracer.getInstance(el)

  if (animations) {
    let inLoop = false
    let stopTime, frame

    el.addEventListener("animationstart", function (e) {
      const style = getComputedStyle(e.target as Element)
      const duration = style.getPropertyValue("animation-duration")

      startRafLoop(parseFloat(duration) * 1000)
    })

    el.addEventListener("animationend", stopRafLoop)
    el.addEventListener("animationcancel", stopRafLoop)

    function startRafLoop(duration) {
      stopTime = performance.now() + duration

      if (!inLoop) {
        inLoop = true

        frame = requestAnimationFrame(function rafLoop() {
          if (inLoop && performance.now() < stopTime) {
            tracer.trace()
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
        tracer.trace()
        inLoop = false
      }
    }
  }

  if (elementResize) {
    getResizeObserver(el).observe(el)
  }

  if (windowResize) {
    el.ownerDocument.defaultView.addEventListener(
      "resize",
      getCallback(el) as (event: UIEvent) => {},
    )
  }
}

export function unwatchElement(el) {
  const resizeObserver = getResizeObserver(el, false)

  if (resizeObserver) {
    resizeObserver.disconnect()
  }
}

function getResizeObserver(el, force = true) {
  let observer = resizeObservers.get(el)

  if (!observer && force) {
    observer = new ResizeObserver(getCallback(el) as ResizeObserverCallback)
    resizeObservers.set(el, observer)
  }

  return observer
}

function getCallback(el: HTMLElement): Function {
  let callback = watchCallbacks.get(el)

  if (!callback) {
    const tracer = Tracer.getInstance(el)
    let frame
    callback = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => tracer.trace())
    }
    watchCallbacks.set(el, callback)
  }

  return callback
}
