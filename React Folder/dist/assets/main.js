import React, { StrictMode } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function App() {
  return React.createElement(
    "main",
    { className: "app-page" },
    React.createElement("h1", null, "Welcome to CoderPlanet-X!"),
    React.createElement(
      "p",
      null,
      "You are authenticated and inside the React app.",
    ),
    React.createElement(
      "div",
      { className: "actions" },
      React.createElement("a", { href: "/" }, "Home"),
      React.createElement("a", { href: "/secretWord" }, "Secret Word"),
      React.createElement("a", { href: "/about" }, "About"),
    ),
    React.createElement(
      "form",
      { method: "POST", action: "/sessions/logoff" },
      React.createElement("button", { type: "submit" }, "Log out"),
    ),
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    React.createElement(StrictMode, null, React.createElement(App)),
  );
}
