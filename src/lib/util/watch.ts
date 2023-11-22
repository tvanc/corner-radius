import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"
import WatcherCallback from "../class/Watcher/WatcherCallback"
import ElementResizeWatcher from "../class/Watcher/ElementResizeWatcher"
import WindowResizeWatcher from "../class/Watcher/WindowResizeWatcher"
import EventWatcher from "../class/Watcher/EventWatcher"

const animationWatchers: WeakMap<HTMLElement, EventWatcher> = new WeakMap()
const resizeWatchers: WeakMap<HTMLElement, ElementResizeWatcher> = new WeakMap()
const transitionWatchers: WeakMap<HTMLElement, EventWatcher> = new WeakMap()
const windowWatchers: WeakMap<HTMLElement, WindowResizeWatcher> = new WeakMap()

const rafCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()
const immediateCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()

export function watch(
  el: HTMLElement,
  {
    animations = false,
    elementResize = false,
    transitions = true,
    windowResize = false,
  }: WatchOptions = {
    animations: true,
    elementResize: true,
    transitions: true,
    windowResize: true,
  },
) {
  if (animations) {
    // getAnimationWatcher(el).start()
  }

  if (elementResize) {
    // getElementResizeWatcher(el).start()
  }

  if (transitions) {
    getTransitionWatcher(el).start()
  }

  if (windowResize) {
    // getWindowResizeWatcher(el).start()
  }
}
export function unwatch(
  el,
  {
    animations = false,
    elementResize = false,
    transitions = false,
    windowResize = false,
  }: WatchOptions = {
    animations: true,
    elementResize: true,
    transitions: true,
    windowResize: true,
  },
) {
  if (animations) {
    getAnimationWatcher(el, false)?.stop()
  }

  if (elementResize) {
    getElementResizeWatcher(el, false)?.stop()
  }

  if (transitions) {
    getTransitionWatcher(el).start()
  }

  if (windowResize) {
    getWindowResizeWatcher(el, false)?.stop()
  }
}

function getAnimationWatcher(el, force = true) {
  let watcher = animationWatchers.get(el)

  if (!watcher && force) {
    watcher = new EventWatcher(
      el,
      getImmediateCallback(el),
      ["animationstart"],
      ["animationcancel", "animationend"],
    )
    animationWatchers.set(el, watcher)
  }

  return watcher
}

function getElementResizeWatcher(el, force = true) {
  let watcher = resizeWatchers.get(el)

  if (!watcher && force) {
    watcher = new ElementResizeWatcher(el, getRafCallback(el))
    resizeWatchers.set(el, watcher)
  }

  return watcher
}

function getTransitionWatcher(el: HTMLElement, force = true) {
  let watcher = transitionWatchers.get(el)

  if (!watcher && force) {
    watcher = new EventWatcher(
      el,
      getImmediateCallback(el),
      ["transitionstart"],
      ["transitioncancel", "transitionend"],
    )
    transitionWatchers.set(el, watcher)
  }

  return watcher
}

function getWindowResizeWatcher(el: HTMLElement, force: boolean = true) {
  let watcher = windowWatchers.get(el)

  if (!watcher && force) {
    watcher = new WindowResizeWatcher(el, getRafCallback(el))
    windowWatchers.set(el, watcher)
  }

  return watcher
}

function getImmediateCallback(el: HTMLElement): WatcherCallback {
  let callback = immediateCallbacks.get(el)

  if (!callback) {
    const tracer = Tracer.getInstance(el)
    callback = () => tracer.trace()
  }

  return callback
}

function getRafCallback(el: HTMLElement): WatcherCallback {
  let callback = rafCallbacks.get(el)

  if (!callback) {
    const tracer = Tracer.getInstance(el)
    let frame = null
    callback = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          tracer.trace()
          frame = null
        })
      }
    }
    rafCallbacks.set(el, callback)
  }

  return callback
}
