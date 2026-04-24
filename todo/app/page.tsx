"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "momentum-tasks";

const demoTodos: Todo[] = [
  {
    id: "demo-1",
    title: "Plan the week",
    completed: true,
    createdAt: 1,
  },
  {
    id: "demo-2",
    title: "Ship the Next.js todo app",
    completed: false,
    createdAt: 2,
  },
  {
    id: "demo-3",
    title: "Take a real break after finishing",
    completed: false,
    createdAt: 3,
  },
];

function formatCount(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(demoTodos);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[];
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [hydrated, todos]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = draft.trim();
    if (!title) {
      return;
    }

    setTodos((current) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
      },
      ...current,
    ]);
    setDraft("");
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingDraft("");
    }
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingDraft(todo.title);
  }

  function saveEdit() {
    if (!editingId) {
      return;
    }

    const title = editingDraft.trim();
    if (!title) {
      deleteTodo(editingId);
      return;
    }

    setTodos((current) =>
      current.map((todo) => (todo.id === editingId ? { ...todo, title } : todo)),
    );
    setEditingId(null);
    setEditingDraft("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingDraft("");
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed));
  }

  function markAllDone() {
    setTodos((current) =>
      current.map((todo) => ({
        ...todo,
        completed: true,
      })),
    );
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Momentum Tasks</p>
        <h1>Stay on top of what matters without losing the thread.</h1>
        <p className="lede">
          A focused todo app with quick capture, inline editing, progress tracking,
          and local persistence.
        </p>
      </section>

      <section className="board">
        <div className="board-top">
          <div>
            <p className="panel-label">Today&apos;s pace</p>
            <h2>{progress}% complete</h2>
          </div>
          <div className="meter" aria-label={`${progress}% of tasks completed`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <input
            aria-label="Add a new task"
            placeholder="Add a task you want to finish next..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">Add task</button>
        </form>

        <div className="toolbar">
          <div className="chips" role="tablist" aria-label="Filter tasks">
            {(["all", "active", "completed"] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "chip active" : "chip"}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="ghost" onClick={markAllDone} disabled={todos.length === 0}>
              Mark all done
            </button>
            <button
              type="button"
              className="ghost"
              onClick={clearCompleted}
              disabled={completedCount === 0}
            >
              Clear completed
            </button>
          </div>
        </div>

        <div className="stats">
          <span>{formatCount(activeCount, "task")} left</span>
          <span>{formatCount(completedCount, "task")} done</span>
          <span>{formatCount(todos.length, "task")} total</span>
        </div>

        <div className="list" role="list" aria-live="polite">
          {visibleTodos.length === 0 ? (
            <div className="empty">
              <h3>No tasks in this view</h3>
              <p>Try another filter or add something worth finishing today.</p>
            </div>
          ) : (
            visibleTodos
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((todo) => {
                const isEditing = editingId === todo.id;

                return (
                  <article
                    className={todo.completed ? "todo done" : "todo"}
                    key={todo.id}
                    role="listitem"
                  >
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        aria-label={`Mark ${todo.title} as ${
                          todo.completed ? "incomplete" : "complete"
                        }`}
                      />
                      <span />
                    </label>

                    <div className="todo-body">
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          className="edit-input"
                          value={editingDraft}
                          onChange={(event) => setEditingDraft(event.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              saveEdit();
                            }
                            if (event.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                          aria-label="Edit task title"
                        />
                      ) : (
                        <>
                          <p>{todo.title}</p>
                          <small>{todo.completed ? "Completed" : "In progress"}</small>
                        </>
                      )}
                    </div>

                    <div className="todo-actions">
                      <button type="button" className="text-button" onClick={() => startEditing(todo)}>
                        Edit
                      </button>
                      <button type="button" className="text-button danger" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })
          )}
        </div>
      </section>
    </main>
  );
}
