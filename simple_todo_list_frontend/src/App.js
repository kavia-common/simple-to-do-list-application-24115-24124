import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import "./index.css";
import "./App.css";

/**
 * Theme constants following the Ocean Professional style
 * Kept here to avoid extra files as we minimally change scaffold.
 */
const THEME = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

const initialState = {
  items: [],
};

function sanitizeText(text) {
  return text.trim().replace(/\s+/g, " ");
}

function todoReducer(state, action) {
  switch (action.type) {
    case "init":
      return { items: action.payload || [] };
    case "add": {
      const text = sanitizeText(action.payload);
      if (!text) return state;
      const newItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        text,
        completed: false,
        createdAt: Date.now(),
      };
      return { items: [newItem, ...state.items] };
    }
    case "toggle": {
      const items = state.items.map((it) =>
        it.id === action.payload ? { ...it, completed: !it.completed } : it
      );
      return { items };
    }
    case "delete": {
      const items = state.items.filter((it) => it.id !== action.payload);
      return { items };
    }
    case "clearCompleted": {
      const items = state.items.filter((it) => !it.completed);
      return { items };
    }
    default:
      return state;
  }
}

/**
// PUBLIC_INTERFACE
 * App
 * A modern, single-page Todo application with add, toggle, and delete
 * actions. Uses localStorage for persistence and adheres to the Ocean
 * Professional theme. Accessible and mobile-friendly.
 */
function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState("");
  const [announce, setAnnounce] = useState(""); // for aria-live updates
  const inputRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("todo.items");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "init", payload: parsed });
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  // Persist to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem("todo.items", JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  // Computed stats
  const stats = useMemo(() => {
    const total = state.items.length;
    const completed = state.items.filter((t) => t.completed).length;
    return { total, completed, remaining: total - completed };
  }, [state.items]);

  function addTodo() {
    const text = sanitizeText(input);
    if (!text) return;
    dispatch({ type: "add", payload: text });
    setInput("");
    setAnnounce(`Added todo: ${text}`);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  }

  function toggleItem(id, text) {
    dispatch({ type: "toggle", payload: id });
    const found = state.items.find((i) => i.id === id);
    const nowCompleted = found ? !found.completed : false;
    setAnnounce(`${nowCompleted ? "Completed" : "Reopened"}: ${text}`);
  }

  function deleteItem(id, text) {
    dispatch({ type: "delete", payload: id });
    setAnnounce(`Deleted: ${text}`);
  }

  function clearCompleted() {
    dispatch({ type: "clearCompleted" });
    setAnnounce("Cleared completed items");
  }

  return (
    <div
      className="app-root"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, rgba(37,99,235,0.08), rgba(249,250,251,1))`,
      }}
    >
      <header className="app-header" style={{ color: THEME.text }}>
        <h1 className="app-title" aria-label="Application title">
          Ocean Tasks
        </h1>
        <p className="app-subtitle">
          A minimal, focused todo list with a professional ocean theme.
        </p>
      </header>

      <main className="app-container" role="main" aria-describedby="stats">
        <section
          className="todo-input-card surface"
          aria-labelledby="add-todo-label"
        >
          <label id="add-todo-label" className="sr-only" htmlFor="todo-input">
            Add a new todo
          </label>
          <div className="input-row">
            <input
              id="todo-input"
              ref={inputRef}
              className="todo-input"
              type="text"
              value={input}
              placeholder="What needs to be done?"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Todo text"
            />
            <button
              className="btn primary"
              onClick={addTodo}
              aria-label="Add todo"
            >
              Add
            </button>
          </div>
          <div id="stats" className="stats">
            <span>
              Total: <strong>{stats.total}</strong>
            </span>
            <span>
              Completed:{" "}
              <strong style={{ color: THEME.secondary }}>
                {stats.completed}
              </strong>
            </span>
            <span>
              Remaining: <strong>{stats.remaining}</strong>
            </span>
            <button
              className="btn ghost"
              onClick={clearCompleted}
              disabled={stats.completed === 0}
              aria-disabled={stats.completed === 0}
              aria-label="Clear completed items"
            >
              Clear completed
            </button>
          </div>
        </section>

        <section className="todo-list surface" aria-label="Todo list">
          {state.items.length === 0 ? (
            <p className="empty">No todos yet. Add your first task above.</p>
          ) : (
            <ul className="list" role="list">
              {state.items.map((item) => (
                <li key={item.id} className={`row ${item.completed ? "done" : ""}`}>
                  <button
                    className={`check ${item.completed ? "checked" : ""}`}
                    onClick={() => toggleItem(item.id, item.text)}
                    aria-pressed={item.completed}
                    aria-label={
                      item.completed ? `Mark "${item.text}" as not completed` : `Mark "${item.text}" as completed`
                    }
                    title="Toggle complete"
                  >
                    {item.completed ? "✓" : ""}
                  </button>
                  <span className="text" title={item.text}>
                    {item.text}
                  </span>
                  <button
                    className="delete"
                    onClick={() => deleteItem(item.id, item.text)}
                    aria-label={`Delete ${item.text}`}
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announce}
        </div>
      </main>

      <footer className="app-footer">
        <small>Made with React • Ocean Professional Theme</small>
      </footer>
    </div>
  );
}

export default App;
