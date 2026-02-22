export default function App() {
  return (
    <main className="app-shell">
      <h1>Welcome to CoderPlanet-X!</h1>
      <p>You are authenticated and inside the React app.</p>
      <div className="actions">
        <a href="/">Back to Express Home</a>
        <a href="/secretWord">Open Secret Word Page</a>
      </div>
      <form method="POST" action="/sessions/logoff">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
