import Point from "../gpc/geometry/Point"

export function getSlope(p1: Point, p2: Point): number {
  //     |--delta y--|   |--delta x--|
  return (p2.y - p1.y) / (p2.x - p1.x)
}

export function getDistance(p1: Point, p2: Point) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * Returns whether points in the path (p1->p2->p3) are oriented clockwise.
 *
 * This method would return false for colinear points.
 */
export function pointsAreClockwise(p1: Point, p2: Point, p3: Point): boolean {
  const val = (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x)

  return val < 0
}
