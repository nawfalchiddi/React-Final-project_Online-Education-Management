import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu } from "react-icons/fi";
import { useApp } from "../utils/Mycontext";

export default function Header({ onMenuClick }) {
  const [search, setSearch] = useState("");
  const { user } = useApp();
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const text = search.trim();
    navigate("/courses?q=" + encodeURIComponent(text));
  }

  let firstName = "Guest";
  if (user !== null) {
    firstName = user.name.split(" ")[0];
  }

  let userArea;
  if (user !== null) {
    userArea = (
      <>
        <div className="hidden text-right text-sm sm:block">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600 font-bold text-gray-500">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </>
    );
  } else {
    userArea = (
      <Link to="/login" className="rounded-xl bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500 hover:text-gray-500">
        Log in
      </Link>
    );
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b border-blue-300 bg-white p-4">
      <button onClick={onMenuClick} aria-label="Open menu" className="text-2xl md:hidden">
        <FiMenu />
      </button>

      <h1 className="hidden text-xl  lg:block">
        Welcome back, {firstName}
      </h1>

      <form onSubmit={handleSearch} className="relative flex-1 md:max-w-sm">
        <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search for courses..."
          aria-label="Search courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-yellow-300 bg-gray-100 py-2 pl-8 pr-4 outline-none focus:border-blue-500 focus:shadow shadow-sky-400"
        />
      </form>

      <div className="flex items-center gap-3">{userArea}</div>
    </header>
  );
}