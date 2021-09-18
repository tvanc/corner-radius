import Tracer from "./lib/class/Tracer"
import WatchOptions from "./lib/class/WatchOptions"

export function trace(el: HTMLElement) {
  const tracer = Tracer.getInstance(el)

  tracer.trace()

  return tracer
}

export function watch(el: HTMLElement, options?: WatchOptions) {
  const tracer = Tracer.getInstance(el)

  tracer.watch(options)

  return tracer
}

export function unwatch(el: HTMLElement) {
  const tracer = Tracer.getInstance(el)

  tracer.unwatch()

  return tracer
}
