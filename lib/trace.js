import PolyDefault from "./gpc/geometry/PolyDefault.js"
import { draw } from "./draw.js"

const svgElMap = new WeakMap()

export function trace(el, watch = true) {
  const svg = getSvg(el)
  const path = svg.querySelector("path")
  const polygon = getPolygons(el)
  const { x, y, w, h } = polygon.getBounds()
  const strokeWidth = getComputedStyle(path).strokeWidth
  const offset = strokeWidth ? parseFloat(strokeWidth) : 0
  const halfOffset = offset / 2
  const offsetWidth = w + offset
  const offsetHeight = h + offset

  console.log(offset)

  svg.setAttribute("viewBox", `0 0 ${offsetWidth} ${offsetHeight}`)
  svg.style.top = `${y - halfOffset}px`
  svg.style.left = `${x - halfOffset}px`
  svg.setAttribute("width", offsetWidth)
  svg.setAttribute("height", offsetHeight)

  const commands = draw(x - halfOffset, y - halfOffset, polygon)

  path.setAttribute("d", commands.join("\n"))
}

/**
 * @param root
 * @returns {PolyDefault}
 */
function getPolygons(root) {
  let polygon = getPolygon(root)

  ;[...root.children].forEach((leaf) => {
    polygon = polygon.union(getPolygons(leaf))
  })

  return polygon
}

function getPolygon(el) {
  const rect = el.getBoundingClientRect()
  const polygon = new PolyDefault(false)

  const x1 = Math.round(rect.x)
  const y1 = Math.round(rect.y)
  const x2 = Math.round(rect.x + rect.width)
  const y2 = Math.round(rect.y + rect.height)

  polygon.add([
    [x1, y1],
    [x2, y1],
    [x2, y2],
    [x1, y2],
  ])

  return polygon
}

function getSvg(el) {
  if (svgElMap.has(el)) {
    return svgElMap.get(el)
  }

  const ns = "http://www.w3.org/2000/svg"
  const svg = document.createElementNS(ns, "svg")
  const path = document.createElementNS(ns, "path")

  svg.style.position = "absolute"
  svg.appendChild(path)

  document.body.appendChild(svg)
  path.fill = "pink"
  svgElMap.set(el, svg)
  return svg
}
