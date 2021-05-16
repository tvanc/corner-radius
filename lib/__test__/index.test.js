import lib from "../index.js"
import { getOutlines } from "../index"
import { getPolygons, edgesMatch } from "../getPolygons"
import Rectangle from "../class/Rectangle"
import Point from "../class/Point"

test("getPolygons() works", () => {
  const rectangles = [
    new Rectangle(new Point(0, 0), new Point(100, 100)),
    new Rectangle(new Point(100, 50), new Point(150, 100))
  ]

})
