import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"
import WatcherCallback from "../class/Watcher/WatcherCallback"
import AnimationWatcher from "../class/Watcher/AnimationWatcher"
import ElementResizeWatcher from "../class/Watcher/ElementResizeWatcher"
import WindowResizeWatcher from "../class/Watcher/WindowResizeWatcher"

const animationWatchers: WeakMap<HTMLElement, AnimationWatcher> = new WeakMap()
const resizeWatchers: WeakMap<HTMLElement, ElementResizeWatcher> = new WeakMap()
const windowWatchers: WeakMap<HTMLElement, WindowResizeWatcher> = new WeakMap()

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
    getElementResizeWatcher(el).start()
  }

  if (windowResize) {
    getWindowResizeWatcher(el).start()
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
    getElementResizeWatcher(el, false)?.stop()
  }
  if (windowResize) {
    getWindowResizeWatcher(el, false)?.stop()
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

function getElementResizeWatcher(el, force = true) {
  let watcher = resizeWatchers.get(el)

  if (!watcher && force) {
    watcher = new ElementResizeWatcher(el, getCallback(el))
    resizeWatchers.set(el, watcher)
  }

  return watcher
}

function getWindowResizeWatcher(el: HTMLElement, force: boolean = true) {
  let watcher = windowWatchers.get(el)

  if (!watcher && force) {
    watcher = new WindowResizeWatcher(el, getCallback(el))
    windowWatchers.set(el, watcher)
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
