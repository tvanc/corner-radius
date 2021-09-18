/**
 * @jest-environment jsdom
 */

import * as traceModule from "../trace"
import * as watchModule from "../watch"

const watchElementId = "watchMe"

let traceSpy

beforeEach(function () {
  traceSpy = jest.spyOn(traceModule, "trace")

  document.body.innerHTML = `
    <div id="${watchElementId}">
      Some Content
    </div>`
})

it("Mutations are watched when expected", async () => {
  const el = document.getElementById(watchElementId)

  watchModule.watch(el, { mutations: true })
  el.innerHTML = "bloop"

  // Introduce tiny delay before assertions to allow mutation observer to run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).toHaveBeenCalledTimes(1)
  expect(traceSpy).toHaveBeenCalledWith(el)
})

it("Resize observer fires on resize", async () => {
  const el = document.getElementById(watchElementId)

  el.style.height = "10vh"
  watchModule.watch(el, { elementResize: true })
  el.style.height = "100vh"

  // Introduce tiny delay before assertions to allow mutation observer to run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).toHaveBeenCalledTimes(1)
  expect(traceSpy).toHaveBeenCalledWith(el)
})
