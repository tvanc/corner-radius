import Tracer from "../Tracer"

/**
 * A list of Tracers to invoke in animation frames.
 */
export default class Animator {
  #running = false
  #renderOnce = new Set<Tracer>()
  #renderAlways = new Map<Tracer, number>()

  #renderFrame() {
    if (this.#renderAlways.size === 0 && this.#renderOnce.size === 0) {
      this.#running = false
      return
    }

    for (const [tracer] of this.#renderOnce.entries()) {
      tracer.trace()
      this.#renderOnce.delete(tracer)
    }

    for (const [tracer] of this.#renderAlways.entries()) {
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

  /**
   * Increase the counter for the given tracker. An item can only be removed
   * from the render list by deregistering it until the counter reaches zero.
   */
  register(tracer: Tracer): number {
    const previousAmount = this.#renderAlways.get(tracer) ?? 0
    const newAmount = previousAmount + 1
    this.#renderAlways.set(tracer, newAmount)
    this.#start()

    return newAmount
  }

  /**
   * Reduce the counter for the given tracer. An item is removed from the
   * render list when its counter reaches zero.
   */
  deregister(tracer: Tracer): number {
    const previousAmount = this.#renderAlways.get(tracer) ?? 0
    const newAmount = Math.max(0, previousAmount - 1)
    if (0 === newAmount) {
      this.#renderAlways.delete(tracer)
    } else {
      this.#renderAlways.set(tracer, newAmount)
    }

    return newAmount
  }

  renderOnce(tracer: Tracer) {
    this.#renderOnce.add(tracer)
    this.#start()
  }
}
