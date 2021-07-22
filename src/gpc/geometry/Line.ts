import Point from "./Point"

export default class Line {
  start: Point
  end: Point

  constructor(start: Point, end: Point) {
    this.start = start
    this.end = end
  }
}
