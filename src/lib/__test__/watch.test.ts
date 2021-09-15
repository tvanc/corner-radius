/**
 * @jest-environment jsdom
 */

import * as traceModule from "../trace"
import * as watchModule from "../watch"

const watchElementId = "watchMe"

beforeEach(function () {
  document.body.innerHTML = `
    <div id="${watchElementId}">
      Some Content
    </div>`
})

it("Mutations are watched when expected", async () => {
  const el = document.getElementById(watchElementId)
  const traceSpy = jest.spyOn(traceModule, "trace")
  watchModule.watch(el, { mutations: true })
  el.innerHTML = "bloop"

  // Introduce tiny delay before assertions to allow mutation observer to have run
  await new Promise((r) => setTimeout(r))

  expect(traceSpy).toHaveBeenCalledTimes(1)
  expect(traceSpy).toHaveBeenCalledWith(el)
})
