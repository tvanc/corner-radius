import Tracer from "../Tracer"

export default class RenderList extends Set<Tracer> {
  #running = false
  #onceSet = new Set<Tracer>()

  #renderFrame() {
    if (this.size === 0 && this.#onceSet.size === 0) {
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

  #start() {
    if (!this.#running) {
      window.requestAnimationFrame(this.#renderFrame.bind(this))
      this.#running = true
    }
  }

  add(value: Tracer): this {
    this.#start()
    const result = super.add(value)
    console.log("size on add", this.size)
    return result
  }

  addOnce(tracer: Tracer) {
    this.#start()
    this.#onceSet.add(tracer)
    console.log("once size on add", this.size)
  }

  delete(value: Tracer): boolean {
    const has = super.delete(value)
    if (has) {
      console.log("size after delete", this.size)
    }
    return has
  }
}
