import { Link } from "react-router";

export default function App() {
  return (
    <main className="app-shell">
      <h1>Welcome to CoderPlanet-X!</h1>
      <p>You are authenticated and inside the React app.</p>
      <div className="actions">
        <Link to="/">Home</Link>
        <a href="/secretWord">Secret Word</a>
        <Link to="/about">About</Link>
      </div>
      <form method="POST" action="/sessions/logoff">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
