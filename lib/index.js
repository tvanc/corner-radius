import { getPolygons } from "./getPolygons"

const svgElMap = new WeakMap()

function tracePath(el, watch = true) {
  const svg = getSvg(el)
  const path = svg.querySelector("path")
  const { x, y, width, height } = getRect(el)

  svg.style.top = `${y}px`
  svg.style.left = `${x}px`
  svg.style.width = `${width}px`
  svg.style.height = `${height}px`

  path.setAttribute("d", getDrawCommands(el))
  getDrawCommands(el)
}

function getDrawCommands(el) {
  const rectangles = getAllRectangles(el)
  const outlines = getPolygons(rectangles)

  console.log("All paths", rectangles)
  console.log("collapsed path", collapsedPaths)
}

function getAllRectangles(root) {
  const paths = [getPath(root)]

  ;[...root.children].forEach((leaf) => {
    paths.push(...getAllRectangles(leaf))
  })

  return paths
}

function getPath(el) {
  return getRect(el)
}

function getRect(el) {
  const rect = el.getBoundingClientRect()
  const basicRect = {
    x: rect.x + window.scrollX,
    y: rect.y + window.scrollY,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  }

  return {
    ...basicRect,
    x1: rect.x,
    x2: rect.x + rect.width,
    y1: rect.y,
    y2: rect.y + rect.height,
  }
}

function getSvg(el) {
  if (svgElMap.has(el)) {
    return svgElMap.get(el)
  }

  const svg = document.createElement("svg")
  svg.style.position = "absolute"

  document.body.appendChild(svg)

  const path = document.createElement("path")
  path.fill = "pink"
  svg.appendChild(path)

  svgElMap.set(el, svg)
  return svg
}
