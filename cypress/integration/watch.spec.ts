import Tracer from "../../src/lib/class/Tracer"
import { SinonSpy } from "cypress/types/sinon"

const watchElementId = "watchMe"

let el: HTMLElement, tracer: Tracer, traceSpy: SinonSpy

before(function () {
  document.body.innerHTML = `
    <div id="${watchElementId}">
      Some Content
    </div>`

  el = document.getElementById(watchElementId)
  tracer = Tracer.getInstance(el)
  traceSpy = cy.spy(tracer, "trace")
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
  tracer.watch({ windowResize: true })

  window.dispatchEvent(new UIEvent("resize"))

  cy.wrap(traceSpy).should("be.calledOnce")
})
