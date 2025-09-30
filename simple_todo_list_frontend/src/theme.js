//
// Ocean Professional Theme Constants
//
// PUBLIC_INTERFACE
export const theme = {
  name: "Ocean Professional",
  description: "Blue & amber accents",
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  gradient: "linear-gradient(180deg, rgba(37,99,235,0.08), rgba(249,250,251,1))",
};

/**
 * PUBLIC_INTERFACE
 * applyCssVars
 * Applies theme as CSS variables on the :root element.
 */
export function applyCssVars(doc = document, t = theme) {
  const root = doc.documentElement;
  root.style.setProperty("--primary", t.primary);
  root.style.setProperty("--secondary", t.secondary);
  root.style.setProperty("--success", t.success);
  root.style.setProperty("--error", t.error);
  root.style.setProperty("--bg", t.background);
  root.style.setProperty("--surface", t.surface);
  root.style.setProperty("--text", t.text);
}
