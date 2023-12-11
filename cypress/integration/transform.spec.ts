import { createPaths, getUnionPolygon } from "../../src/lib/util/trace"
import { Path } from "../../src/lib/class/Path"

const watchElementId = "watchMe"

let el: HTMLElement
let svg: HTMLElement
let win: Window

before(() => cy.viewport("iphone-x", "portrait"))

beforeEach(() => {
  return cy
    .visit("cypress/pages/transform.html")
    .window()
    .then((window) => {
      win = window
      el = win.document.getElementById(watchElementId)
      svg = win.document.getElementById("svg")
    })
})

afterEach(() => {
  // el.style.top = "50%"
  // el.style.left = "50%"
  // el.style.translate = "-50% -50%"
})

describe("`getPolygon()` produces expected result", () => {
  it("Calls `trace()` on element resize when `elementResize === true`", () => {
    const clientRect = el.getBoundingClientRect()
    const poly = getUnionPolygon(el, clientRect)

    for (const innerPoly of poly.m_List.toArray()) {
      const svgNs = "http://www.w3.org/2000/svg"
      const pathEl = win.document.createElementNS(svgNs, "path")
      pathEl.setAttribute("d", Path.fromPoly(innerPoly).toString())
      svg.appendChild(pathEl)
      console.log(Path.fromPoly(innerPoly).toString())
    }

    svg.setAttribute("width", win.innerWidth + "")
    svg.setAttribute("height", win.innerHeight + "")
  })
})
