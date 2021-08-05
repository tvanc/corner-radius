import PolySimple from "../../gpc/geometry/PolySimple"
import CommandInterface from "./Command/CommandInterface"
import MoveTo from "./Command/MoveTo"
import LineTo from "./Command/LineTo"
import Close from "./Command/Close"

export class Path {
  public commands: CommandInterface[]

  private constructor() {}

  toString() {
    return this.commands.reduce((str, c) => str + c + " ", "").slice(0, -1)
  }

  static fromPoly(poly: PolySimple, offsetX: number = 0, offsetY: number = 0) {
    const path = new Path()
    const points = poly.getPoints()
    const [firstPoint] = points
    const commands: CommandInterface[] = [
      new MoveTo(firstPoint.x + offsetX, firstPoint.y + offsetY),
    ]

    for (let i = 1; i < points.length; i++) {
      commands.push(new LineTo(points[i].x + offsetX, points[i].y + offsetY))
    }

    commands.push(new Close())

    path.commands = commands

    return path
  }
}
