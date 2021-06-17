import Point from "./gpc/geometry/Point.js"
import PolyDefault from "./gpc/geometry/PolyDefault"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const context = canvas.getContext("2d")

//define polygons
const vertices1 = [
  [61, 68],
  [145, 122],
  [186, 94],
  [224, 135],
  [204, 211],
  [105, 200],
  [141, 163],
  [48, 139],
  [74, 117],
]
const vertices2 = [
  [131, 84],
  [224, 110],
  [174, 180],
  [120, 136],
  [60, 167],
]

const vertices3 = [
  [281, 84],
  [374, 110],
  [324, 180],
  [270, 136],
  [250, 167],
]

const poly1 = createPoly(vertices1)
const poly2 = createPoly(vertices2)
const poly3 = createPoly(vertices3)

//bring to screen
drawPoly(poly1, "red", 0, -30)
drawPoly(poly2, "green", 0, -30)
drawPoly(poly3, "blue", 0, -30)

//listen to buttons
document.addEventListener("DOMContentLoaded", union)

function union() {
  clearScreen()

  drawPoly(poly1, "red", 0, -30)
  drawPoly(poly2, "green", 0, -30)
  drawPoly(poly3, "blue", 0, -30)

  drawPoly(poly1.union(poly2).union(poly3), "red", 0, 150)
}

function createPoly(points) {
  const res = new PolyDefault()
  for (let i = 0; i < points.length; i++) {
    res.addPoint(new Point(points[i][0], points[i][1]))
  }
  return res
}

function getPolygonVertices(poly) {
  const vertices = []
  const numPoints = poly.getNumPoints()

  for (let i = 0; i < numPoints; i++) {
    vertices.push([poly.getX(i), poly.getY(i)])
  }

  return vertices
}

function drawPoly(polygon, strokeColor, ox, oy) {
  const num = polygon.getNumInnerPoly()

  //if more than one poly produced, use multiple color to display
  const colors = ["#91ab19", "#ab9119", "#e5ce35", "#ab1998"]

  for (let i = 0; i < num; i++) {
    const poly = polygon.getInnerPoly(i)
    const vertices = getPolygonVertices(poly)

    if (i === 0) {
      drawSinglePoly(vertices, strokeColor, poly.isHole(), ox, oy)
    } else {
      drawSinglePoly(vertices, colors[i % num], poly.isHole(), ox, oy)
    }
  }
}

function drawSinglePoly(vertices, strokeColor, hole, ox = 0, oy = 0) {
  context.beginPath()
  context.moveTo(vertices[0][0] + ox, vertices[0][1] + oy)

  for (let i = 1; i < vertices.length; i++) {
    context.lineTo(vertices[i][0] + ox, vertices[i][1] + oy)
  }

  context.lineWidth = 2
  context.strokeStyle = strokeColor
  context.fillStyle = "rgba(255, 0, 0, 0.1)"

  if (hole === true) {
    context.fillStyle = "#ffffff"
  }

  context.closePath()
  context.stroke()
  context.fill()
}

function clearScreen() {
  context.clearRect(0, 0, 400, 400)
}
