export default function App() {
  return (
    <main className="app-shell">
      <h1>Welcome to CoderPlanet-X!</h1>
      <p>You are authenticated and inside the React app.</p>
      <div className="actions">
        <a href="/">Home</a>
        <a href="/secretWord">Secret Word</a>
      </div>
      <form method="POST" action="/sessions/logoff">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
