import CommandInterface from "./Command/CommandInterface"
import MoveTo from "./Command/MoveTo"
import LineTo from "./Command/LineTo"
import Close from "./Command/Close"
import Point from "../../gpc/geometry/Point"
import PolygonInterface from "../../gpc/geometry/PolygonInterface"

export class Path {
  public commands: CommandInterface[]

  constructor(commands: CommandInterface[] = []) {
    this.commands = commands
  }

  toString() {
    return this.commands.reduce((str, cmd) => str + cmd + "\n", "").slice(0, -1)
  }

  static fromPoints(points: Point[], offsetX: number = 0, offsetY: number = 0) {
    const path = new Path()
    const [firstPoint] = points
    const commands: CommandInterface[] = [
      new MoveTo(new Point(firstPoint.x + offsetX, firstPoint.y + offsetY)),
    ]

    for (let i = 1; i < points.length; i++) {
      const currentPoint = points[i]

      // Eliminate unnecessary points on a line
      commands.push(
        new LineTo(
          new Point(currentPoint.x + offsetX, currentPoint.y + offsetY),
        ),
      )
    }

    commands.push(new Close())

    path.commands = commands

    return path
  }

  static fromPoly(
    poly: PolygonInterface,
    offsetX: number = 0,
    offsetY: number = 0,
  ) {
    return this.fromPoints(poly.getPoints(), offsetX, offsetY)
  }

  add(...commands: CommandInterface[]) {
    this.commands.push(...commands)
  }

  unclose() {
    const [finalCommand] = this.commands.slice(-1)
    if (finalCommand instanceof Close) {
      this.commands.splice(-1, 1)
    }
  }

  clone() {
    return new Path(this.commands.map((c: CommandInterface) => c.clone()))
  }

  get length() {
    return this.commands.length
  }
}

function slope(point1: Point, point2: Point) {
  return (point2.y - point1.y) / (point2.x - point1.x)
}
