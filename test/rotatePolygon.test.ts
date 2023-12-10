import PolySimple from "../src/gpc/geometry/PolySimple"
import Point from "../src/gpc/geometry/Point"
import Transformer from "../src/lib/class/Transformer"
import { rotatePolygon } from "../src/lib/util/transform"
import { expect } from "@jest/globals"

test("square rotating around given point works", () => {
  const rectilinearSquare = new PolySimple([
    new Point(0, 0),
    new Point(100, 0),
    new Point(100, 100),
    new Point(0, 100),
  ])

  const transformer = new Transformer(new Point(50, 50))
  transformer.rotation = (45 * Math.PI) / 180

  const rotatedSquare = rotatePolygon(rectilinearSquare, transformer)

  rotatedSquare.getPoints().forEach((p) => {
    p.x = Math.round(p.x)
    p.y = Math.round(p.y)
  })

  expect(rotatedSquare.getPoints()).toEqual([
    new Point(50, -21),
    new Point(121, 50),
    new Point(50, 121),
    new Point(-21, 50),
  ])
})
