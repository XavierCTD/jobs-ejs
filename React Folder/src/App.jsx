import { useEffect, useState } from "react";

export default function App() {
  const [secretWord, setSecretWord] = useState("");
  const [newWord, setnewWord] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const loadSecretWord = async () => {
      try {
        const res = await fetch("/secretWord", { credentials: "include" });
        const data = await res.json();
        setSecretWord(data.secretWord || "");
      } catch {
        setError("Could not load secret word.");
      }
    };

    loadSecretWord();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("/secretWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ secretWord: newWord }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSecretWord(data.secretWord || "");
      setInfo(data.info || "Updated.");
      setnewWord("");
    } catch {
      setError("Request failed");
    }
  };

  return (
    <main className="app-shell">
      <h1>Welcome to CoderPlanet-X!</h1>
      <p className="para">
        From here you can be able to access resourses and other cool things!
      </p>
      <div className="actions">
        <a
          href="https://docs.google.com/document/d/1p53_mD5s8kkNU6dxrlVwQnWuDSdT0zwexTCdeFQBsNw/edit"
          alt="Coding Resourses"
        >
          Coding Resourses.
        </a>
      </div>
      <div className="actions">
        <section className="secret-word-card">
          <h2>Secret Word</h2>
          <p>
            This is the secret word area. There you can be able to use random
            words.
            <br />
            Just try to make your words complex.
          </p>
          <p>
            Current: <strong>{secretWord}</strong>
          </p>

          {error && <div className="msg">{error}</div>}
          {info && <div className="msg ok">{info}</div>}

          <form className="secret-word-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setnewWord(e.target.value)}
              placeholder="Enter your new secret word."
            />
            <button type="submit">Change Secret Word</button>
          </form>
        </section>
      </div>
    </main>
  );
}
