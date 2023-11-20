import Tracer from "./lib/class/Tracer"
import WatchOptions from "./lib/class/WatchOptions"

export { trace, watch, unwatch, destroy }

function trace(el: HTMLElement): Tracer {
  return withTracer(el, (t) => t.trace())
}

function watch(el: HTMLElement, options?: WatchOptions): Tracer {
  return withTracer(el, (t) => t.watch(options))
}

function unwatch(el: HTMLElement): Tracer {
  return withTracer(el, (t) => t.unwatch())
}

function destroy(el: HTMLElement): void {
  withTracer(el, (t) => t.destroy())
}

function withTracer(el: HTMLElement, callback: (t: Tracer) => any) {
  const tracer = Tracer.getInstance(el)
  callback(tracer)
  return tracer
}
