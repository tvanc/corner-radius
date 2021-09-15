import { trace } from "./trace"

const mutationObserverMap = new WeakMap()
const resizeObserverMap = new WeakMap()

/**
 * @param el
 * @param {object} [options]
 * @param {boolean} [options.mutations]
 * @param {boolean} [options.animations]
 * @param {boolean} [options.elementResize]
 */
export function watch(
  el,
  { mutations = true, animations = true, elementResize = true } = {},
) {
  let inLoop = false
  let stopTime, frame

  const retrace = () => trace(el)
  const startRafLoop = (duration) => {
    stopTime = performance.now() + duration

    if (!inLoop) {
      inLoop = true

      frame = requestAnimationFrame(function rafLoop() {
        if (inLoop && performance.now() < stopTime) {
          retrace()
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
      retrace()
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
      const style = getComputedStyle(e.target)
      const duration = style.getPropertyValue("animation-duration")

      startRafLoop(parseFloat(duration) * 1000)
    })

    el.addEventListener("animationend", stopRafLoop)
    el.addEventListener("animationcancel", stopRafLoop)
  }
}

export function unwatch(el) {
  const mutationObserver = getMutationObserver(el, false)

  if (mutationObserver) {
    mutationObserver.unobserve(el)
  }
}

function getMutationObserver(el, force = true) {
  let observer = mutationObserverMap.get(el)

  if (!observer && force) {
    mutationObserverMap.set(el, observer)
    observer = new MutationObserver(() => trace(el))
  }

  return observer
}

function getResizeObserver(el, force = true) {
  let observer = resizeObserverMap.get(el)

  if (!observer && force) {
    resizeObserverMap.set(el, observer)
    observer = new ResizeObserver(() => trace(el))
  }

  return observer
}
