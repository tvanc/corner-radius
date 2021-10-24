import Tracer from "../../src/lib/class/Tracer"
import { SinonSpy } from "cypress/types/sinon"
import { unwatch, watch } from "../../src"

const watchElementId = "watchMe"

let el: HTMLElement, tracer: Tracer, traceSpy: SinonSpy

beforeEach(function () {
  cy.visit("cypress/pages/index.html")
  cy.window().then((win) => {
    el = win.document.getElementById(watchElementId)
    tracer = Tracer.getInstance(el)
    traceSpy = cy.spy(tracer, "trace")
  })
})

it("Calls `trace()` on element resize when `elementResize === true`", async () => {
  el.style.height = "10px"
  watch(el, { elementResize: true })
  el.style.height = "100px"
  tracer.unwatch()

  cy.wrap(traceSpy).should("be.calledOnce")
})

it("Calls `trace()` on window resize when `windowResize === true`", () => {
  cy.viewport("iphone-x", "portrait")
  watch(el, { windowResize: true })
  cy.viewport("iphone-x", "landscape")

  cy.wrap(traceSpy).should("be.calledOnce")
})

it("Calls `trace()` on animation when `animations === true`", () => {
  watch(el, { animations: true })

  el.style.animationDuration = "0s"
  el.classList.add("animate-height")

  cy.wrap(traceSpy).should("be.calledOnce")
})
