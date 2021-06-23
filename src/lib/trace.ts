import PolyDefault from "../gpc/geometry/PolyDefault"
import { draw } from "./draw"
import { roundPathCorners } from "./round.js"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()
const mutationObserverMap = new WeakMap()
const resizeObserverMap = new WeakMap()

// @ts-ignore
CSS.registerProperty({
  name: "--corner-radius",
  syntax: "<length>",
  inherits: false,
  initialValue: 0,
})

export function trace(el) {
  const svg = getSvg(el)

  const allPaths = svg.querySelectorAll("path")
  const polygon = getPolygons(el)
  const { x, y, w, h } = polygon.getBounds()
  const cornerRadius = parseFloat(
    getComputedStyle(el).getPropertyValue("--corner-radius"),
  )

  const polygonCommands = draw(x, y, polygon).flat()

  for (let j = 0; j < polygonCommands.length; ++j) {
    const pathCommands = polygonCommands[j]
    const roundedCommands = roundPathCorners(pathCommands, cornerRadius, false)
    const path = allPaths[j] ?? document.createElementNS(svgNs, "path")

    path.setAttribute("d", roundedCommands)
    svg.appendChild(path)
  }

  for (let i = allPaths.length; i > polygonCommands.length; --i) {
    allPaths[i - 1].remove()
  }

  if (w === 352) {
    console.log(polygon.getBounds())
  }

  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
  svg.style.top = `${y}px`
  svg.style.left = `${x}px`
}

/**
 * @param el
 * @param {object} [options]
 * @param {boolean} [options.mutations]
 * @param {boolean} [options.animations]
 * @param {boolean} [options.elementResize]
 */
export function watch(
  el,
  { mutations = true, animations = true, elementResize = true } = {},
) {
  let inLoop = false
  let stopTime, rafHandle

  const retrace = () => trace(el)
  const startRafLoop = (duration) => {
    stopTime = performance.now() + duration

    if (!inLoop) {
      inLoop = true

      rafHandle = requestAnimationFrame(function rafLoop() {
        if (inLoop && performance.now() < stopTime) {
          retrace()
          rafHandle = requestAnimationFrame(rafLoop)
        } else {
          stopRafLoop()
        }
      })
    }
  }

  const stopRafLoop = () => {
    if (inLoop) {
      cancelAnimationFrame(rafHandle)
      retrace()
      inLoop = false
    }
  }

  if (mutations) {
    getMutationObserver(el).observe(el, {
      characterData: true,
      subtree: true,
      childList: true,
      attributes: true,
    })
  }

  if (elementResize) {
    getResizeObserver(el).observe(el)
  }

  if (animations) {
    el.addEventListener("animationstart", function (e) {
      const style = getComputedStyle(e.target)
      const duration = style.getPropertyValue("animation-duration")

      startRafLoop(parseFloat(duration) * 1000)
    })

    el.addEventListener("animationend", stopRafLoop)
    el.addEventListener("animationcancel", stopRafLoop)
  }
}

export function unwatch(el) {
  const mutationObserver = getMutationObserver(el, false)

  if (mutationObserver) {
    mutationObserver.unobserve(el)
  }
}

function getMutationObserver(el, force = true) {
  let observer = mutationObserverMap.get(el)

  if (!observer && force) {
    mutationObserverMap.set(el, observer)
    observer = new MutationObserver(() => trace(el))
  }

  return observer
}

function getResizeObserver(el, force = true) {
  let observer = resizeObserverMap.get(el)

  if (!observer && force) {
    resizeObserverMap.set(el, observer)
    observer = new ResizeObserver(() => trace(el))
  }

  return observer
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

  const svg = document.createElementNS(svgNs, "svg")

  svg.style.position = "absolute"

  document.body.appendChild(svg)
  svgElMap.set(el, svg)

  return svg
}

export function registerProperty(arg0: { name: string; syntax: string; inherits: boolean; initialValue: number }) {
    throw new Error("Function not implemented.")
}

