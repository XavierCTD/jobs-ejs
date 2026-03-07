import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import About from "./pages/About.jsx";
import NotesPage from "./features/NotesPage.jsx";
import Header from "./shared/Header.jsx";

function LayoutPage({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LayoutPage>
              <App />
            </LayoutPage>
          }
        />
        <Route
          path="/about"
          element={
            <LayoutPage>
              <About />
            </LayoutPage>
          }
        />
        <Route
          path="/notes"
          element={
            <LayoutPage>
              <NotesPage />
            </LayoutPage>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
