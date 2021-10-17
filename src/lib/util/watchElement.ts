import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"
import AnimationWatcher from "../class/Watcher/AnimationWatcher"
import WatcherCallback from "../class/Watcher/WatcherCallback"

// const resizeObservers: WeakMap<HTMLElement, ResizeObserver> = new WeakMap()
const animationWatchers: WeakMap<HTMLElement, AnimationWatcher> = new WeakMap()
const watchCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()

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
  if (animations) {
    getAnimationWatcher(el).start()
  }

  if (elementResize) {
    // getResizeObserver(el).observe(el)
  }

  if (windowResize) {
    // el.ownerDocument.defaultView.addEventListener(
    //   "resize",
    //   getCallback(el) as (event: UIEvent) => {},
    // )
  }
}

export function unwatchElement(
  el,
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
  if (animations) {
    getAnimationWatcher(el, false)?.stop()
  }
  if (elementResize) {
    // getResizeObserver(el, false)?.disconnect()
  }
  if (windowResize) {
    // el.ownerDocument.defaultView.removeEventListener()
  }
}

function getAnimationWatcher(el, force = true) {
  let watcher = animationWatchers.get(el)

  if (!watcher && force) {
    watcher = new AnimationWatcher(el, getCallback(el))
    animationWatchers.set(el, watcher)
  }

  return watcher
}

function getCallback(el: HTMLElement): WatcherCallback {
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
