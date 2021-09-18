import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"

const mutationObservers: WeakMap<HTMLElement, MutationObserver> = new WeakMap()
const resizeObservers: WeakMap<HTMLElement, ResizeObserver> = new WeakMap()

/**
 * @param el
 * @param {object} [options]
 * @param {boolean} [options.mutations]
 * @param {boolean} [options.animations]
 * @param {boolean} [options.elementResize]
 */
export function watchElement(
  el: HTMLElement,
  {
    mutations = false,
    animations = false,
    elementResize = false,
  }: WatchOptions = { mutations: true, animations: true, elementResize: true },
) {
  let inLoop = false
  let stopTime, frame

  const tracer = Tracer.getInstance(el)
  const startRafLoop = (duration) => {
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

  const stopRafLoop = () => {
    if (inLoop) {
      cancelAnimationFrame(frame)
      tracer.trace()
      inLoop = false
    }
  }

  if (mutations) {
    getMutationObserver(el).observe(el, {
      characterData: true,
      subtree: true,
      childList: true,
      attributes: true,
    })
  }

  if (elementResize) {
    getResizeObserver(el).observe(el)
  }

  if (animations) {
    el.addEventListener("animationstart", function (e) {
      const style = getComputedStyle(e.target as Element)
      const duration = style.getPropertyValue("animation-duration")

      startRafLoop(parseFloat(duration) * 1000)
    })

    el.addEventListener("animationend", stopRafLoop)
    el.addEventListener("animationcancel", stopRafLoop)
  }
}

export function unwatchElement(el) {
  const mutationObserver = getMutationObserver(el, false)

  if (mutationObserver) {
    mutationObserver.disconnect()
  }
}

function getMutationObserver(el, force = true): MutationObserver {
  let observer = mutationObservers.get(el)

  if (!observer && force) {
    const tracer = Tracer.getInstance(el)
    mutationObservers.set(el, observer)
    observer = new MutationObserver(() => tracer.trace())
  }

  return observer
}

function getResizeObserver(el, force = true) {
  let observer = resizeObservers.get(el)

  if (!observer && force) {
    const tracer = Tracer.getInstance(el)
    resizeObservers.set(el, observer)
    observer = new ResizeObserver(() => tracer.trace())
  }

  return observer
}
