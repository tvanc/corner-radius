import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import PathMaker from "../class/PathMaker"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()

export function traceElement(el: HTMLElement) {
  const svg = getSvg(el)

  const allPaths = svg.querySelectorAll("path")
  const unionPolygon = getUnionOfAllPolygons(el)
  const { x, y, w, h } = unionPolygon.getBounds()
  const style = getComputedStyle(el)
  const cornerRadius = parseFloat(style.getPropertyValue("border-radius"))
  const pathMaker = new PathMaker()
  const pathStrings = pathMaker.makePaths(unionPolygon, cornerRadius, -x, -y)

  for (let i = 0; i < pathStrings.length; ++i) {
    const pathEl = allPaths[i] ?? document.createElementNS(svgNs, "path")
    pathEl.setAttribute("d", pathStrings[i])
    svg.appendChild(pathEl)

    el.style.clipPath = `path('${pathStrings[i]}')`
  }

  for (let i = allPaths.length; i > pathStrings.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
  svg.style.top = `${y}px`
  svg.style.left = `${x}px`
}

function getUnionOfAllPolygons(root: HTMLElement): PolygonInterface {
  let polygon = getPolygon(root)

  ;[...root.children].forEach((leaf) => {
    polygon = polygon.union(getUnionOfAllPolygons(leaf as HTMLElement))
  })

  return polygon
}

function getPolygon(el): PolygonInterface {
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

export function getSvg(el) {
  if (!svgElMap.has(el)) {
    const doc = el.ownerDocument
    const svg = doc.createElementNS(svgNs, "svg")

    svg.style.position = "absolute"

    doc.body.appendChild(svg)

    svgElMap.set(el, svg)
  }

  return svgElMap.get(el)
}
