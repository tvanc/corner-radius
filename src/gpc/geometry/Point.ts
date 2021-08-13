export default class Point {
  x: number
  y: number

  constructor(x: number = undefined, y: number = undefined) {
    this.x = x
    this.y = y
  }

  toString () {
    return `${this.x},${this.y}`
  }
}
