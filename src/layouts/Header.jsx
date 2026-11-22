import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useApp } from "../utils/Mycontext";
import { ImCrop } from "react-icons/im";
export default function Header() {
  const [search, setSearch] = useState("");
  const { user } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="flex items-center justify-between gap-4  bg-white p-4">
      <h1 className="flex items-center justify-around w-[20%] text-xl  ">
     <ImCrop classname=' text-blue-500'/> <span>Welcome back,</span>  {user ? user.name.split(" ")[0] : "Guest"}
      </h1>

      <form onSubmit={handleSearch} className="relative flex-1 md:max-w-sm">
        <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search for courses..."
          aria-label="Search courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-blue-100 py-2 pl-8  outline-none focus:border-blue-500 focus:shadow shadow-blue-500"
        />
      </form>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden text-right text-sm sm:block">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {user.name[0].toUpperCase()}
            </div>
          </>
        ) : (
          <Link to="/login" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}