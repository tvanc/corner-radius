import PolySimple from "../../gpc/geometry/PolySimple"
import CommandInterface from "./Command/CommandInterface"
import MoveTo from "./Command/MoveTo"
import LineTo from "./Command/LineTo"
import Close from "./Command/Close"
import Point from "../../gpc/geometry/Point"

export class Path {
  public commands: CommandInterface[]

  constructor(commands: CommandInterface[] = []) {
    this.commands = commands
  }

  toString() {
    return this.commands.reduce((str, cmd) => str + cmd + "\n", "").slice(0, -1)
  }

  static fromPoly(poly: PolySimple, offsetX: number = 0, offsetY: number = 0) {
    const path = new Path()
    const points = poly.getPoints()
    const [firstPoint] = points
    const commands: CommandInterface[] = [
      new MoveTo(new Point(firstPoint.x + offsetX, firstPoint.y + offsetY)),
    ]

    for (let i = 1; i < points.length; i++) {
      commands.push(
        new LineTo(new Point(points[i].x + offsetX, points[i].y + offsetY)),
      )
    }

    commands.push(new Close())

    path.commands = commands

    return path
  }

  add(...commands: CommandInterface[]) {
    this.commands.push(...commands)
  }

  get length() {
    return this.commands.length
  }
}
