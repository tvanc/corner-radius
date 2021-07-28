import PolySimple from "../gpc/geometry/PolySimple"

export class Path {
  public commands: string[][]

  constructor(poly: PolySimple, offsetX: number, offsetY: number) {
    const points = poly.getPoints()
    const [firstPoint] = points
    const commands = [[`M`, firstPoint.x + offsetX, firstPoint.y + offsetY]]

    for (let i = 1; i < points.length; i++) {
      commands.push(["L", points[i][0] + offsetX, points[i][1] + offsetY])
    }

    commands.push(["Z"])

    this.commands = commands
  }

  toString() {
    return this.commands
      .reduce((str, c) => str + c.join(" ") + " ", "")
      .slice(0, -1)
  }
}
