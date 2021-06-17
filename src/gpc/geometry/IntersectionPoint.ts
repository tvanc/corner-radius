import Point from "./Point"

export default class IntersectionPoint {
  polygonPoint1
  polygonPoint2
  intersectionPoint

  constructor(p1: Point, p2: Point, p3: Point) {
    this.polygonPoint1 = p1
    this.polygonPoint2 = p2
    this.intersectionPoint = p3
  }

  toString() {
    return (
      "P1 :" +
      this.polygonPoint1.toString() +
      " P2:" +
      this.polygonPoint2.toString() +
      " IP:" +
      this.intersectionPoint.toString()
    )
  }
}
