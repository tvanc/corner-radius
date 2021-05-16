import { getPolygons, edgesMatch } from "../getPolygons"
import Rectangle from "../class/Rectangle"
import Point from "../class/Point"
import Polygon from "../class/Polygon"

test("getPolygons() works", () => {  const rectangles = [
    new Rectangle(new Point(0, 0), new Point(100, 100)),
    new Rectangle(new Point(100, 50), new Point(150, 100))
  ]

  expect(getPolygons(rectangles)).toBe([
    new Polygon(
      new Point(0, 0),
      new Point(100, 100),
      new Point(100, 50),
      new Point(150, 50),
      new Point(150, 100),
      new Point(0, 100)
    )
  ])
})
