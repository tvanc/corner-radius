import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import Point from "../../gpc/geometry/Point"
import { roundPathFromPoints } from "../svg-round-corners"
import PolySimple from "../../gpc/geometry/PolySimple"
import { Path } from "../class/Path"
import Transformer from "../class/Transformer"
import { transform } from "./transform"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()

export function trace(el: HTMLElement) {
  const svg = getSvg(el)
  const allPaths = svg.querySelectorAll("path")
  const offsetRect = getOffsetRectangle(el)
  const unionPolygon = getUnionPolygon(el)
  const bounds = unionPolygon.getBounds()
  const style = getComputedStyle(el)
  const radius = parseFloat(style.getPropertyValue("border-radius"))
  const pathStrings = createPaths(unionPolygon, radius)

  for (let i = 0; i < pathStrings.length; ++i) {
    const pathEl = allPaths[i] ?? document.createElementNS(svgNs, "path")
    pathEl.setAttribute("d", pathStrings[i])
    svg.appendChild(pathEl)

    // TODO clip each child with a detached polygon separately
    // el.style.clipPath = `path('${pathStrings[i]}')`
  }

  for (let i = allPaths.length; i > pathStrings.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", bounds.w)
  svg.setAttribute("height", bounds.h)
  svg.setAttribute("viewBox", `${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`)
  svg.style.top = `${offsetRect.y + bounds.y}`
  svg.style.left = `${offsetRect.x + bounds.x}px`
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

// TODO why is the origin in an unexpected place - abstract to use Jest or test on the dom with Cypress
export function getUnionPolygon(
  root: HTMLElement,
  boundingBox = getOffsetRectangle(root),
  transformer = new Transformer(),
): PolyDefault {
  const polyToAdd = getPolygonRelativeToOrigin(root, boundingBox)
  let polygon = new PolyDefault(false)
  polygon.add(polyToAdd)

  polygon = transform(root, polygon, transformer)
  ;[...root.children].forEach((leaf) => {
    const leafTransformer = structuredClone(transformer)
    const polyToAdd = getUnionPolygon(
      leaf as HTMLElement,
      boundingBox,
      leafTransformer,
    )

    polygon = polygon.union(polyToAdd)
  })

  return polygon
}

export function getPolygonRelativeToOrigin(el, origin): PolySimple {
  const rect = getOffsetRectangle(el)

  const oX = Math.round(origin.x)
  const oY = Math.round(origin.y)

  const x1 = Math.round(rect.x)
  const y1 = Math.round(rect.y)
  const x2 = Math.round(rect.x + rect.width)
  const y2 = Math.round(rect.y + rect.height)

  // Get rectangle with points rel
  return new PolySimple([
    new Point(x1 - oX, y1 - oY),
    new Point(x2 - oX, y1 - oY),
    new Point(x2 - oX, y2 - oY),
    new Point(x1 - oX, y2 - oY),
  ])
}

export function getOffsetRectangle(el: HTMLElement) {
  const rect = {
    x: el.offsetLeft,
    y: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  }

  while ((el = el.parentElement)) {
    rect.x += el.offsetLeft
    rect.y += el.offsetTop
  }

  return rect
}

export function createPaths(
  complexPolygon: PolygonInterface,
  radius: number = 0,
): string[] {
  const num = complexPolygon.getNumInnerPoly()
  const paths = []

  for (let i = 0; i < num; i++) {
    const innerPoly = complexPolygon.getInnerPoly(i)
    const points = innerPoly.removeUnnecessaryPoints().getPoints()
    const path = roundPathFromPoints(points, radius).toString()

    paths.push(path)
  }

  return paths
}
