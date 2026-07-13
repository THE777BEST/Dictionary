import { NavLink } from "react-router-dom";
import "./navbar.css";

const labels = {
  en: {
    favorites: "Favorites",
    search: "Search",
    settings: "Settings",
  },
  uz: {
    favorites: "Sevimli",
    search: "Qidiruv",
    settings: "Sozlamalar",
  },
};

function Nav({ language }) {
  const t = language === "en" ? labels.en : labels.uz;

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
        {t.search}
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        {t.favorites}
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        {t.settings}
      </NavLink>
    </nav>
  );
}

export default Nav;
