import Tracer from "../../src/lib/class/Tracer"
import { SinonSpy } from "cypress/types/sinon"
import { destroy, unwatch, watch } from "../../src"

const watchElementId = "watchMe"

let el: HTMLElement
let tracer: Tracer
let traceSpy: SinonSpy

before(() => cy.viewport("iphone-x", "portrait"))

beforeEach(() => {
  return cy
    .visit("cypress/pages/index.html")
    .window()
    .then((win) => {
      el = win.document.getElementById(watchElementId)
      el.style.height = "75px"
      tracer = Tracer.getInstance(el)
      traceSpy = cy.spy(tracer, "trace")
    })
})

afterEach(() => {
  destroy(el)
})

describe("`watch()` Options", () => {
  it("Calls `trace()` on element resize when `elementResize === true`", () => {
    watch(el, { elementResize: true })
    triggerElementResize()

    cy.wrap(traceSpy).should("be.calledOnce")
  })

  it("Calls `trace()` on window resize when `windowResize === true`", () => {
    watch(el, { windowResize: true })
    triggerWindowResize()

    cy.wrap(traceSpy).should("be.calledOnce")
  })

  it("Calls `trace()` on animation when `animations === true`", () => {
    watch(el, { animations: true })
    triggerAnimation()

    cy.wrap(traceSpy).should("be.calledOnce")
  })
})

describe("`unwatch()`", () => {
  it("`unwatch()` unwatches everything", () => {
    watch(el)
    unwatch(el)
    triggerAllWatchers()

    cy.wrap(traceSpy).should("not.have.been.called")
  })
})

describe("`destroy()`", () => {
  it("`destroy()` unwatches everything", () => {
    watch(el)
    destroy(el)
    triggerAllWatchers()

    cy.wrap(traceSpy).should("be.that.which.has.not.been.called")
  })
})

function triggerAllWatchers() {
  triggerWindowResize()
  triggerElementResize()
  triggerAnimation()
}

function triggerAnimation() {
  el.style.animationDuration = "0s"
  el.classList.add("animate-height")
}

function triggerElementResize() {
  el.style.height = "100px"
}

function triggerWindowResize() {
  cy.viewport("iphone-x", "landscape")
}
