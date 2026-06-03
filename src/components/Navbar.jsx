import { NavLink } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

const linkStyle = ({ isActive }) => ({
  padding: "8px 14px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  color: isActive ? "var(--primary)" : "var(--text-muted)",
  background: isActive ? "var(--surface-2)" : "transparent",
});

const Navbar = () => {
  const { theme, toggle } = useDarkMode();

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 24px",
        }}
      >
        <NavLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--text)",
            fontWeight: 700,
            fontSize: 18,
            textDecoration: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--primary)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✉
          </span>
          Bulk Mailer
        </NavLink>

        <nav style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          <NavLink to="/" end style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/history" style={linkStyle}>
            History
          </NavLink>
        </nav>

        <div className="spacer" />

        <button
          type="button"
          className="btn btn-ghost"
          onClick={toggle}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
