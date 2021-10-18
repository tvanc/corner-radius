import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"
import WatcherCallback from "../class/Watcher/WatcherCallback"
import AnimationWatcher from "../class/Watcher/AnimationWatcher"
import ResizeWatcher from "../class/Watcher/ResizeWatcher"
import WindowWatcher from "../class/Watcher/WindowWatcher"

const animationWatchers: WeakMap<HTMLElement, AnimationWatcher> = new WeakMap()
const resizeWatchers: WeakMap<HTMLElement, ResizeWatcher> = new WeakMap()
const windowWatchers: WeakMap<HTMLElement, WindowWatcher> = new WeakMap()

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
    getResizeWatcher(el).start()
  }

  if (windowResize) {
    getWindowWatcher(el).start()
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
    getResizeWatcher(el, false)?.stop()
  }
  if (windowResize) {
    getWindowWatcher(el, false)?.stop()
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

function getResizeWatcher(el, force = true) {
  let watcher = resizeWatchers.get(el)

  if (!watcher && force) {
    watcher = new ResizeWatcher(el, getCallback(el))
    resizeWatchers.set(el, watcher)
  }

  return watcher
}

function getWindowWatcher(el: HTMLElement, force: boolean = true) {
  let watcher = windowWatchers.get(el)

  if (!watcher && force) {
    watcher = new WindowWatcher(el, getCallback(el))
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
