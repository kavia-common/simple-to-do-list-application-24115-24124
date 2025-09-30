/**
 * A minimal localStorage hook that safely reads/writes JSON values.
 * - Namespaced key
 * - Safe JSON parsing
 * - Synchronous with storage events from other tabs
 *
 * PUBLIC_INTERFACE
 */
import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const storageKey = key;

  const readValue = () => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [storageKey, value]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === storageKey) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [storageKey, initialValue]);

  return [value, setValue];
}
