import WatchOptions from "../class/WatchOptions"
import Tracer from "../class/Tracer"
import WatcherCallback from "../class/Watcher/WatcherCallback"
import ElementResizeWatcher from "../class/Watcher/ElementResizeWatcher"
import WindowResizeWatcher from "../class/Watcher/WindowResizeWatcher"
import StartStopWatcher from "../class/Watcher/StartStopWatcher"
import RenderList from "../class/Watcher/RenderList"
import HTML = Mocha.reporters.HTML

const animationWatchers: WeakMap<HTMLElement, StartStopWatcher> = new WeakMap()
const resizeWatchers: WeakMap<HTMLElement, ElementResizeWatcher> = new WeakMap()
const transitionWatchers: WeakMap<HTMLElement, StartStopWatcher> = new WeakMap()
const windowWatchers: WeakMap<HTMLElement, WindowResizeWatcher> = new WeakMap()

const rafCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()
const startCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()
const stopCallbacks: WeakMap<HTMLElement, WatcherCallback> = new WeakMap()

const traceList = new RenderList()

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
    watcher = new StartStopWatcher(
      el,
      getStartCallback(el),
      getStopCallback(el),
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
    watcher = new StartStopWatcher(
      el,
      getStartCallback(el),
      getStopCallback(el),
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

function getStartCallback(el: HTMLElement): WatcherCallback {
  let callback = startCallbacks.get(el)

  if (!callback) {
    callback = () => traceList.add(Tracer.getInstance(el))
  }

  return callback
}

function getStopCallback(el: HTMLElement): WatcherCallback {
  let callback = stopCallbacks.get(el)

  if (!callback) {
    callback = () => traceList.delete(Tracer.getInstance(el))
  }

  return callback
}

function getRafCallback(el: HTMLElement): WatcherCallback {
  let callback = rafCallbacks.get(el)

  if (!callback) {
    rafCallbacks.set(el, () => traceList.addOnce(Tracer.getInstance(el)))
  }

  return callback
}
