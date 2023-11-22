import WatchOptions from "./WatchOptions"
import { getSvg, trace } from "../util/trace"
import { watch, unwatch } from "../util/watch"

const tracerMap: WeakMap<HTMLElement, Tracer> = new WeakMap()

export default class Tracer {
  readonly #el: HTMLElement
  #destroyed: boolean = false

  private constructor(el: HTMLElement) {
    this.#el = el
  }

  static getInstance(el: HTMLElement) {
    if (!tracerMap.has(el)) {
      const tracer = new Tracer(el)
      tracerMap.set(el, tracer)
    }

    return tracerMap.get(el)
  }

  trace() {
    trace(this.#el)

    return this
  }

  watch(options: WatchOptions = undefined) {
    watch(this.#el, options)

    return this
  }

  unwatch(options: WatchOptions = undefined) {
    unwatch(this.#el, options)

    return this
  }

  destroy() {
    if (!this.#destroyed) {
      // without options `unwatch()` unwatches everything
      this.unwatch()

      getSvg(this.#el).remove()
      tracerMap.delete(this.#el)
      this.#destroyed = true
    }
  }
}
