import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { useApp } from "../../../utils/Mycontext";
import CourseCard from "../../../components/CourseCard";

export default function Favourites() {
  const { courses, favourites } = useApp();
  const saved = courses.filter((c) => favourites.includes(c.id));

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Saved courses</h2>
      {saved.length === 0 ? (
        <p className="flex flex-wrap items-center gap-1 text-gray-500">
          Nothing saved yet. Tap <FaRegHeart /> on a course to save it.
          <Link to="/courses" className="text-blue-600">Browse courses</Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {saved.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}