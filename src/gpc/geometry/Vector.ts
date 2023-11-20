import Point from "./Point"

export class Vector {
  x
  y
  len
  nx
  ny
  ang

  constructor (p: Point, pp: Point) {
    this.x = pp.x - p.x
    this.y = pp.y - p.y

    // convert 2 points into vector form, polar form, and normalised
    this.len = Math.sqrt(this.x ** 2 + this.y ** 2)
    this.nx = this.x / this.len
    this.ny = this.y / this.len
    this.ang = Math.atan2(this.ny, this.nx)
  }
}
