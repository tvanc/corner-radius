import PolySimple from "../PolySimple"
import Point from "../Point"

it("Removes unnecessary points from square", () => {
  const poly = new PolySimple()
  poly.add([
    new Point(0, 0),
    new Point(1, 0), // | - on the same line
    new Point(2, 0),
    new Point(2, 1), // could be eliminated
    new Point(2, 2),
    new Point(1, 2), // could be eliminated
    new Point(0, 1),
  ])

  poly.removeUnnecessaryPoints()

  expect(poly.getPoints()).toEqual([
    new Point(0, 0),
    new Point(2, 0),
    new Point(2, 2),
    new Point(0, 1),
  ])
})
