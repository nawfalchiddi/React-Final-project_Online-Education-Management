
import { NavLink } from "react-router-dom";
import { useApp } from "../utils/Mycontext";
import { FcGraduationCap } from "react-icons/fc";
import { IoHomeOutline, IoBarChartSharp, IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import { GiBookshelf } from "react-icons/gi";
import { GrFavorite } from "react-icons/gr";
import { MdOutlineAssignmentInd } from "react-icons/md";

const home = { to: "/", icon: <IoHomeOutline />, label: "Home" };
const catalog = { to: "/courses", icon: <GiBookshelf />, label: "Courses" };

const linksByRole = {
  visitor: [home, catalog],
  student: [
    home,
    catalog,
    { to: "/dashboard", icon: <IoBarChartSharp />, label: "My Dashboard" },
    { to: "/favourites", icon: <GrFavorite />, label: "Favourites" },
  ],
  instructor: [home, catalog, { to: "/instructor", icon: <IoBarChartSharp />, label: "Instructor Dashboard" }],
};

const linkClass = ({ isActive }) =>
  `flex items-center justify-between rounded-lg p-3 transition hover:bg-blue-700 ${isActive ? "bg-yellow-800" : ""}`;

export default function Sidebar() {
  const { user, favourites, logout } = useApp();
  const links = linksByRole[user ? user.role : "visitor"];

  return (
    <aside className="hidden md:flex w-[250px] shrink-0 flex-col bg-sky-600 p-5 text-white">
      <h2 className="mb-8 flex w-[90%] justify-around text-3xl ">
        <FcGraduationCap className="text-5xl" />
        <span>LearnPro</span>
      </h2>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
            <span className="flex items-center gap-3">{icon} {label}</span>
            {label === "Favourites" && favourites.length > 0 && (
              <span className="rounded-full bg-blue-400 px-2 text-xs">{favourites.length}</span>
            )}
          </NavLink>
        ))}

        {/* Visitor sees Log in + Register, logged-in user sees Log out */}
        <div className="mt-auto flex flex-col gap-2">
          {user ? (
            <button onClick={logout} className="flex items-center gap-3 rounded-lg p-3 text-left hover:bg-blue-700">
              <IoLogOutOutline /> Log out
            </button>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                <span className="flex items-center gap-3"><IoLogInOutline /> Log in</span>
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                <span className="flex items-center gap-3"><MdOutlineAssignmentInd /> Register</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <div className="mt-4 rounded-xl bg-blue-500 p-4">
        <h3 className="font-bold">Upgrade to Premium</h3>
        <p className="text-sm text-blue-100">Unlock exclusive courses and certificates.</p>
        <button className="mt-2 w-full rounded-lg bg-white p-2 font-bold text-gray-600">Upgrade Now</button>
      </div>
    </aside>
  );
}

