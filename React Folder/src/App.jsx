import { Link } from "react-router-dom";

export default function App() {
  return (
    <main className="app-shell">
      <h1>Welcome to CoderPlanet-X!</h1>
      <p>You are authenticated and inside the React app.</p>
      <div className="actions">
        <Link to="/">Home</Link>
        <Link to="/secretWord">Secret Word</Link>
        <Link to="/about">About</Link>
      </div>
      <form method="POST" action="/sessions/logoff">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
