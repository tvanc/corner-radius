import lib from "../index.js"
import { getOutlines } from "../index"
import Rectangle from "../class/Rectangle"
import Point from "../class/Point"

test("getOutlines() works", () => {
  const rectangles = [new Rectangle(new Point(0, 0), new Point())]
  expect(lib()).toBe(true)
})
