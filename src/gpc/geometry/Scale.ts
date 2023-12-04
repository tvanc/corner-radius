export default class Scale {
  constructor(public x: number = undefined, public y: number = undefined) {}

  toString() {
    return `${this.x},${this.y}`
  }
}
