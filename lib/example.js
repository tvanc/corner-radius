import { trace, watch } from "./trace.js"

const el = document.getElementById("traceMe")

trace(el)
watch(el)

function log(e) {
  console.log(e.type, e)
}

el.addEventListener("transitionstart", log)
el.addEventListener("transitionend", log)
