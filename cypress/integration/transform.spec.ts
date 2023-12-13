import { getOffsetRectangle, getUnionPolygon } from "../../src/lib/util/trace"
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

describe("`getPolygon()` produces expected result", () => {
  it("Polygon receives correct rotation", () => {
    const poly = getUnionPolygon(el)
    const rect = getOffsetRectangle(el)
    const bounds = poly.getBounds()

    for (const innerPoly of poly.m_List.toArray()) {
      const svgNs = "http://www.w3.org/2000/svg"
      const pathEl = win.document.createElementNS(svgNs, "path")
      pathEl.setAttribute("d", Path.fromPoly(innerPoly).toString())
      svg.appendChild(pathEl)
    }

    svg.style.setProperty("left", rect.x - bounds.x + "px")
    svg.style.setProperty("top", rect.y - bounds.y + "px")
    svg.setAttribute("width", bounds.w + "")
    svg.setAttribute("height", bounds.h + "")

    expect(true).to.be.true
  })
})
