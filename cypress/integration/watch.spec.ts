import Tracer from "../../src/lib/class/Tracer"
import { SinonSpy } from "cypress/types/sinon"

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
  tracer.watch({ elementResize: true })
  el.style.height = "100px"

  // Introduce tiny delay before assertions to allow mutation observer to run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).to.be.calledOnce
})

it.only("Calls `trace()` on window resize when `windowResize === true`", () => {
  cy.viewport("iphone-x", "portrait")
  tracer.watch({ windowResize: true })
  cy.viewport("iphone-x", "landscape")

  cy.wrap(traceSpy).should("be.calledOnce")
})

  cy.wrap(traceSpy).should("be.calledOnce")
})
