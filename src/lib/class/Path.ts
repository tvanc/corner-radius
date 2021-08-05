import PolySimple from "../../gpc/geometry/PolySimple"

export class Path {
  public commands: string[][]

  private constructor() {}

  toString() {
    return this.commands.reduce((str, c) => str + c + " ", "").slice(0, -1)
  }

  static fromPoly(poly: PolySimple, offsetX: number = 0, offsetY: number = 0) {
    const path = new Path()
    const points = poly.getPoints()
    const [firstPoint] = points
    const commands = [[`M`, firstPoint.x + offsetX, firstPoint.y + offsetY]]

    for (let i = 1; i < points.length; i++) {
      commands.push(["L", points[i].x + offsetX, points[i].y + offsetY])
    }

    commands.push(["Z"])

    path.commands = commands

    return path
  }
}
