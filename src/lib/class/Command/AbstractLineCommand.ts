import AbstractCommand from "./AbstractCommand"
import Point from "../../../gpc/geometry/Point"
import CommandWithEndpointInterface from "./CommandWithEndpointInterface"

export default abstract class AbstractLineCommand extends AbstractCommand implements CommandWithEndpointInterface {
  endPoint: Point

  constructor(endPoint: Point) {
    super()

    this.endPoint = endPoint
  }

  getParameters(): any[] {
    return [this.endPoint]
  }
}
