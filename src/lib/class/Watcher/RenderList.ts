import Tracer from "../Tracer"

export default class RenderList extends Set<Tracer> {
  #running = false
  #onceSet = new Set<Tracer>()

  #renderFrame() {
    if (this.size === 0) {
      this.#running = false
      return
    }

    for (const [tracer] of this.#onceSet.entries()) {
      tracer.trace()
      this.#onceSet.delete(tracer)
    }

    for (const [tracer] of this.entries()) {
      tracer.trace()
    }

    window.requestAnimationFrame(this.#renderFrame.bind(this))
  }

  add(value: Tracer): this {
    if (!this.#running) {
      window.requestAnimationFrame(this.#renderFrame.bind(this))
      this.#running = true
    }

    return super.add(value)
  }

  addOnce(tracer: Tracer) {
    this.#onceSet.add(tracer)
  }
}
