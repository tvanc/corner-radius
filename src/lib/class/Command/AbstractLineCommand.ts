import AbstractCommand from "./AbstractCommand"
import Point from "../../../gpc/geometry/Point"

export default abstract class AbstractLineCommand extends AbstractCommand {
  endPoint: Point

  constructor(endPoint: Point) {
    super()

    this.endPoint = endPoint
  }

  getParameters(): any[] {
    return [this.endPoint]
  }
}
