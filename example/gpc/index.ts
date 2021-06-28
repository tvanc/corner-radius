import Point from "./../../src/gpc/geometry/Point.js"
import PolyDefault from "./../../src/gpc/geometry/PolyDefault"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const context = canvas.getContext("2d")

//define polygons
const poly1 = createPoly([
  [61, 68],
  [145, 122],
  [186, 94],
  [224, 135],
  [204, 211],
  [105, 200],
  [141, 163],
  [48, 139],
  [74, 117],
])

const poly2 = createPoly([
  [131, 84],
  [224, 110],
  [174, 180],
  [120, 136],
  [60, 167],
])

const poly3 = createPoly([
  [281, 84],
  [374, 110],
  [344, 180],
  [270, 146],
  [240, 157],
])

const poly4 = createPoly([
  [250, 99],
  [380, 125],
  [298, 193],
  [280, 166],
  [260, 167],
])

// Generate union on load
document.addEventListener("DOMContentLoaded", union)

function union() {
  clearScreen()

  // Draw discrete but overlapping polygons on top
  drawPoly(poly1, "red", 0, -30)
  drawPoly(poly2, "green", 0, -30)
  drawPoly(poly3, "blue", 0, -30)
  drawPoly(poly4, "orange", 0, -30)

  // Then draw the union of all (which generates one polygon per set of overlapping polygons)
  // So in this example, generates two polygons
  drawPoly(poly1.union(poly2).union(poly3).union(poly4), "red", 0, 150)
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
