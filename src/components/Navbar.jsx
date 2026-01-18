import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-center gap-6 mb-6 border-b pb-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "font-semibold text-blue-600"
            : "text-gray-600 hover:text-blue-500"
        }
      >
        Study
      </NavLink>

      <NavLink
        to="/interview"
        className={({ isActive }) =>
          isActive
            ? "font-semibold text-blue-600"
            : "text-gray-600 hover:text-blue-500"
        }
      >
        Interview
      </NavLink>
    </nav>
  );
}
