import { NavLink } from "react-router-dom";
import { useApp } from "../utils/Mycontext";
import { FcGraduationCap } from "react-icons/fc";
import { IoHomeOutline, IoBarChartSharp, IoLogInOutline, IoLogOutOutline, IoClose } from "react-icons/io5";
import { GiBookshelf } from "react-icons/gi";
import { GrFavorite } from "react-icons/gr";
import { MdOutlineAssignmentInd } from "react-icons/md";

const home = { to: "/", icon: <IoHomeOutline />, label: "Home" };
const catalog = { to: "/courses", icon: <GiBookshelf />, label: "Courses" };
const dashboard = { to: "/dashboard", icon: <IoBarChartSharp />, label: "My Dashboard" };
const favouritesLink = { to: "/favourites", icon: <GrFavorite />, label: "Favourites" };
const instructorLink = { to: "/instructor", icon: <IoBarChartSharp />, label: "Instructor Dashboard" };

const visitorLinks = [home, catalog];
const studentLinks = [home, catalog, dashboard, favouritesLink];
const instructorLinks = [home, catalog, instructorLink];

// navLink gives us info.isActive = 
// is this the current page
function getLinkClass(info) {
  let cls = "flex items-center justify-between rounded-lg p-3 transition hover:bg-yellow-500 hover:text-gray-500";
  if (info.isActive) {
    cls = cls + " bg-yellow-600";
  }
  return cls;
}

export default function Sidebar({ open, onClose }) {
  const { user, favourites, logout } = useApp();

  // which links 
  let links = visitorLinks;
  if (user !== null && user.role === "student") {
    links = studentLinks;
  }
  if (user !== null && user.role === "instructor") {
    links = instructorLinks;
  }

  function handleLogout() {
    logout();
    onClose();
  }

  //  phones is hidden 
  let slideClass = "-translate-x-full";
  if (open) {
    slideClass = "translate-x-0";
  }

  // bottom part: Log out, or Log in + Register
  let bottomLinks;
  if (user !== null) {
    bottomLinks = (
      <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg p-3 text-left hover:bg-yellow-500 hover:text-gray-500">
        <IoLogOutOutline /> Log out
      </button>
    );
  } else {
    bottomLinks = (
      <>
        <NavLink to="/login" onClick={onClose} className={getLinkClass}>
          <span className="flex items-center gap-3"><IoLogInOutline /> Log in</span>
        </NavLink>
        <NavLink to="/register" onClick={onClose} className={getLinkClass}>
          <span className="flex items-center gap-3"><MdOutlineAssignmentInd /> Register</span>
        </NavLink>
      </>
    );
  }

  return (
    <aside
      className={"fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col bg-sky-600 p-5 text-white transition-transform duration-200 md:static md:translate-x-0 " + slideClass}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl ">
          <FcGraduationCap className="text-5xl" />
          <span>LearnPro</span>
        </h2>
        <button onClick={onClose} aria-label="Close menu" className="text-2xl md:hidden">
          <IoClose />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={onClose} className={getLinkClass}>
            <span className="flex items-center gap-3">{item.icon} {item.label}</span>
            {item.label === "Favourites" && favourites.length > 0 && (
              <span className="rounded-full bg-blue-400 px-2 text-xs">{favourites.length}</span>
            )}
          </NavLink>
        ))}

        <div className="mt-auto flex flex-col gap-2">{bottomLinks}</div>
      </nav>

      <div className="mt-4 rounded-xl bg-blue-500 p-4">
        <h3 className="italic">Upgrade to Premium</h3>
        <p className="text-sm text-blue-100">Unlock exclusive courses and certificates.</p>
        <button className="mt-2 w-full rounded-lg bg-white p-2  text-gray-600 hover:bg-yellow-500 hover:text-gray-500 ">Upgrade Now</button>
      </div>
    </aside>
  );
}