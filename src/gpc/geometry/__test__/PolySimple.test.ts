import PolySimple from "../PolySimple"
import Point from "../Point"

it("Removes unnecessary points", () => {
  const poly = new PolySimple()

  poly.add([
    new Point(1, 1),
    new Point(2, 1),
    new Point(2, 2),
    new Point(3, 2),
    new Point(3, 1),
    new Point(1, 1),
  ])

  poly.removeUnnecessaryPoints()

  expect(poly.getPoints()).toEqual([
    new Point(1, 1),
    new Point(2, 1),
    new Point(2, 2),
    new Point(3, 2),
    new Point(3, 1),
  ])
})
