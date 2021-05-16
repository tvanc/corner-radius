import Rectangle from "../Rectangle"
import Point from "../Point"

test("All corners reported correctly", () => {
  const topLeft = new Point(0, 0)
  const bottomRight = new Point(100, 100)

  const rectangle = new Rectangle(topLeft, bottomRight)

  expect(rectangle.topLeft).toEqual(topLeft)
  expect(rectangle.topRight).toEqual(new Point(bottomRight.x, topLeft.y))
  expect(rectangle.bottomRight).toEqual(bottomRight)
  expect(rectangle.bottomLeft).toEqual(new Point(topLeft.x, bottomRight.y))
})
