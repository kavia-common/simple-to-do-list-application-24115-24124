import React from "react";

/**
 * PUBLIC_INTERFACE
 * TodoItem
 * Renders a single todo row with completion toggle and delete control.
 */
export default function TodoItem({ item, onToggle, onDelete }) {
  return (
    <li className={`row ${item.completed ? "done" : ""}`}>
      <button
        className={`check ${item.completed ? "checked" : ""}`}
        onClick={() => onToggle(item.id, item.text)}
        aria-pressed={item.completed}
        aria-label={
          item.completed
            ? `Mark "${item.text}" as not completed`
            : `Mark "${item.text}" as completed`
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
        onClick={() => onDelete(item.id, item.text)}
        aria-label={`Delete ${item.text}`}
        title="Delete"
      >
        ✕
      </button>
    </li>
  );
}
