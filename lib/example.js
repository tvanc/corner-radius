import { trace, watch } from "./trace.js"

const el = document.getElementById("traceMe")

trace(el)
watch(el)
