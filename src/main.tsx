import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Automatically reload the page when a new deployment invalidates chunk hashes
window.addEventListener("vite:preloadError", () => {
  const lastReload = sessionStorage.getItem("hp_preload_retry")
  const now = Date.now()
  if (!lastReload || now - Number(lastReload) > 10000) {
    sessionStorage.setItem("hp_preload_retry", String(now))
    window.location.reload()
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
