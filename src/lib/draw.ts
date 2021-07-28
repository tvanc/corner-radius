import { Path } from "./class/Path"
import PolygonInterface from "../gpc/geometry/PolygonInterface"

export function getPaths(
  offsetX: number,
  offsetY: number,
  ...polygons: PolygonInterface[]
): Path[] {
  const commands = []

  for (const polygon of polygons) {
    commands.push(
      ...getPathsForSingleComplexPolygon(polygon, offsetX * -1, offsetY * -1),
    )
  }

  return commands
}

/**
 * Each complex polygon may contain multiple child polygons.
 *
 * @see PolySimple
 */
function getPathsForSingleComplexPolygon(
  complexPoly: PolygonInterface,
  ox: number,
  oy: number,
): Path[] {
  const num = complexPoly.getNumInnerPoly()
  const paths = []

  for (let i = 0; i < num; i++) {
    const simplePoly = complexPoly.getInnerPoly(i)

    paths.push(new Path(simplePoly, ox, oy))
  }

  return paths
}
