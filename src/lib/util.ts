import Point from "../gpc/geometry/Point"

export function getSlope(p1: Point, p2: Point): number {
  //     |--delta y--|   |--delta x--|
  return (p2.y - p1.y) / (p2.x - p1.x)
}
