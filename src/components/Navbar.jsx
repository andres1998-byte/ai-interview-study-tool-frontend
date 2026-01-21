import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const baseLink =
    "rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const inactive =
    "text-slate-600 hover:text-slate-900 hover:bg-slate-100 " +
    "dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800";

  const active = "bg-indigo-600 text-white shadow-sm";

  function goToInterview(e) {
    e.preventDefault();

    const saved = sessionStorage.getItem("lastStudy");

    if (!saved) {
      // No study generated yet → send back to Study
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      const params = parsed?.params;

      if (params?.topic && params?.level) {
        navigate("/interview", { state: params });
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Study
      </NavLink>

      {/* Interview tab with session-backed navigation */}
      <NavLink
        to="/interview"
        onClick={goToInterview}
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Interview
      </NavLink>
    </nav>
  );
}
