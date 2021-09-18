import Tracer from "../../src/lib/class/Tracer"

const watchElementId = "watchMe"

let el, tracer, traceSpy

before(function () {
  document.body.innerHTML = `
    <div id="${watchElementId}">
      Some Content
    </div>`

  el = document.getElementById(watchElementId)
  tracer = Tracer.getInstance(el)
  traceSpy = cy.spy(tracer, "trace")
})

it("Mutations are watched when expected", async () => {
  tracer.watch({ mutations: true })
  el.innerHTML = "bloop"

  // Introduce tiny delay before assertions to allow mutation observer to run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).to.be.calledOnce
})

it("Resize observer fires on resize", async () => {
  el.style.height = "10vh"
  tracer.watch(el, { elementResize: true })
  el.style.height = "100vh"

  // Introduce tiny delay before assertions to allow mutation observer to run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).to.be.calledOnce
})
