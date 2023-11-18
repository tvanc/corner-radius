import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolySimple from "../../gpc/geometry/PolySimple"
import { roundPathFromPoints } from "../svg-round-corners"

export default class PathMaker {
  makePaths(complexPolygon: PolygonInterface, radius: number = 0): string[] {
    return this.#getSimplePolygons(complexPolygon).map((p) => {
      const points = p.getPoints()
      const fromPoints = roundPathFromPoints(points, radius)

      return fromPoints.toString()
    })
  }

  #getSimplePolygons(polygon: PolygonInterface): PolySimple[] {
    const num = polygon.getNumInnerPoly()
    const simplePolygons = []

    for (let i = 0; i < num; i++) {
      const innerPoly: PolySimple = polygon.getInnerPoly(i)
      innerPoly.removeUnnecessaryPoints()
      simplePolygons.push(innerPoly)
    }

    return simplePolygons
  }
}
