import AbstractCommand from "./AbstractCommand"
import Point from "../../../gpc/geometry/Point"
import CommandWithEndpointInterface from "./CommandWithEndpointInterface"

export default class CubicCurve
  extends AbstractCommand
  implements CommandWithEndpointInterface {
  controlPoint1: Point
  controlPoint2: Point
  endPoint: Point

  constructor(controlPoint1: Point, controlPoint2: Point, endPoint: Point) {
    super()
    this.controlPoint1 = controlPoint1
    this.controlPoint2 = controlPoint2
    this.endPoint = endPoint
  }

  getCommandLetter(): string {
    return "C"
  }

  getParameters(): Point[] {
    return [this.controlPoint1, this.controlPoint2, this.endPoint]
  }

  toString(): string {
    return `${this.getCommandLetter()} ${this.getParameters().join(" ")}`
  }
}
