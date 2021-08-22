import CommandWithEndpointInterface from "./CommandWithEndpointInterface"
import Point from "../../../gpc/geometry/Point"
import AbstractCommand from "./AbstractCommand"

export default class QuadraticCurve
  extends AbstractCommand
  implements CommandWithEndpointInterface {
  endPoint: Point
  controlPoint: Point

  constructor(controlPoint: Point, endPoint: Point) {
    super()
    this.controlPoint = controlPoint
    this.endPoint = endPoint
  }

  getCommandLetter(): string {
    return "Q"
  }

  getParameters(): Point[] {
    return [this.controlPoint, this.endPoint]
  }
}
