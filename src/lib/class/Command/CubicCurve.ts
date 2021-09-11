import AbstractCommand from "./AbstractCommand"
import Point from "../../../gpc/geometry/Point"
import CommandWithEndpointInterface from "./CommandWithEndpointInterface"

export default class CubicCurve
  extends AbstractCommand
  implements CommandWithEndpointInterface {
  constructor(
    public controlPoint1: Point,
    public controlPoint2: Point,
    public endPoint: Point,
  ) {
    super()
  }

  getCommandLetter(): string {
    return "C"
  }

  getParameters(): Point[] {
    return [this.controlPoint1, this.controlPoint2, this.endPoint]
  }
}
