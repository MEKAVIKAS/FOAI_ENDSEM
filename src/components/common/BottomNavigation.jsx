import { BarChart3, Globe2, Newspaper, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { icon: Globe2, label: "ISS", path: "/" },
  { icon: Newspaper, label: "News", path: "/news" },
  { icon: BarChart3, label: "Charts", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const BottomNavigation = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-700/40 bg-slate-950/90 px-2 py-2 backdrop-blur-xl md:hidden"
    aria-label="Mobile primary navigation"
  >
    <div className="grid grid-cols-4 gap-1">
      {items.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
            }`
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNavigation;
