import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import { Path } from "./Path"
import PolySimple from "../../gpc/geometry/PolySimple"
import { roundCorners } from "../svg-round-corners"

export default class PathMaker {
  makePaths(
    complexPolygon: PolygonInterface,
    radius: number = 0,
    offsetX,
    offsetY,
  ): string[] {
    return this.#getSimplePolygons(complexPolygon).map((p) =>
      makePath(p, radius, offsetX, offsetY),
    )
  }

  #getSimplePolygons(polygon: PolygonInterface): PolySimple[] {
    const num = polygon.getNumInnerPoly()
    const simplePolygons = []

    for (let i = 0; i < num; i++) {
      simplePolygons.push(polygon.getInnerPoly(i))
    }

    return simplePolygons
  }
}

function makePath(
  simplePolygon: PolySimple,
  radius: number,
  offsetX: number,
  offsetY: number,
): string {
  const points = simplePolygon.getPoints()
  const path = Path.fromPoints(points)

  return roundCorners(path.toString(), radius, 2, offsetX, offsetY)
}
