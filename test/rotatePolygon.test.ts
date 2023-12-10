import PolySimple from "../src/gpc/geometry/PolySimple"
import Point from "../src/gpc/geometry/Point"
import Transformer from "../src/lib/class/Transformer"
import { rotatePolygon } from "../src/lib/util/transform"
import { expect, it } from "@jest/globals"

describe("Test multiple transforms", () => {
  const rectilinearSquare = new PolySimple([
    new Point(0, 0),
    new Point(100, 0),
    new Point(100, 100),
    new Point(0, 100),
  ])

  const dataSet = [
    {
      desc: "rotate 180 degrees around center",
      transformer: new Transformer(new Point(50, 50), degreesToRadians(180)),
      input: rectilinearSquare,
      expectedOutput: [
        new Point(100, 100),
        new Point(0, 100),
        new Point(0, 0),
        new Point(100, 0),
      ],
    },
    {
      desc: "rotate 90 degrees around top left",
      transformer: new Transformer(new Point(0, 0), degreesToRadians(90)),
      input: rectilinearSquare,
      expectedOutput: [
        new Point(0, 0),
        new Point(0, 100),
        new Point(-100, 100),
        new Point(-100, 0),
      ],
    },
    {
      desc: "rotate 90 degrees around bottom right",
      transformer: new Transformer(new Point(100, 100), degreesToRadians(90)),
      input: rectilinearSquare,
      expectedOutput: [
        new Point(200, 0),
        new Point(200, 100),
        new Point(100, 100),
        new Point(100, 0),
      ],
    },
  ]

  it.each(dataSet)("$desc", applyTransforms)
})

function applyTransforms({ transformer, input, expectedOutput }) {
  let transformedPolygon = rotatePolygon(input, transformer)
  let actualPoints = transformedPolygon.getPoints()

  expect(actualPoints.map(round)).toEqual(expectedOutput)
}

function round(point: Point) {
  // stringify hack converts `-0` to `0` because `Object.is(-0, 0) === false`
  return new Point(
    +JSON.stringify(Math.round(point.x)),
    +JSON.stringify(Math.round(point.y)),
  )
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}
