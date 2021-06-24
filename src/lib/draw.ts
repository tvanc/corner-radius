export function draw(x, y, ...polygons) {
  const commands = []

  for (const polygon of polygons) {
    commands.push(drawPoly(polygon, x * -1, y * -1))
  }

  return commands
}

function getPolygonVertices(poly) {
  const vertices = []
  const numPoints = poly.getNumPoints()

  for (let i = 0; i < numPoints; i++) {
    vertices.push([poly.getX(i), poly.getY(i)])
  }

  return vertices
}

function drawPoly(polygon, ox, oy) {
  const num = polygon.getNumInnerPoly()
  const pathCommandSets = []

  for (let i = 0; i < num; i++) {
    const poly = polygon.getInnerPoly(i)
    const vertices = getPolygonVertices(poly)

    pathCommandSets.push(drawSinglePoly(vertices, poly.isHole(), ox, oy))
  }

  return pathCommandSets
}

function drawSinglePoly(vertices, hole, ox = 0, oy = 0) {
  const commands = [[`M`, vertices[0][0] + ox, vertices[0][1] + oy]]

  for (let i = 1; i < vertices.length; i++) {
    commands.push(["L", vertices[i][0] + ox, vertices[i][1] + oy])
  }

  commands.push(["Z"])

  return commands
}
