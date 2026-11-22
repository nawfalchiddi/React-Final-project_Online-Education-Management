import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../utils/Mycontext";
import ProgressBar from "./ProgressBar";

export default function CourseCard({ course }) {
  const { user, isFavourite, toggleFavourite, isEnrolled, getProgress } = useApp();
  const navigate = useNavigate();
  const fav = isFavourite(course.id);
  const { percent } = getProgress(course);

  const handleHeart = () => {
    if (!user) navigate("/login", { state: { from: `/courses/${course.id}` } });
    else toggleFavourite(course.id);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
      {user?.role !== "instructor" && (
        <button
          onClick={handleHeart}
          aria-label={fav ? "Remove from favourites" : "Save to favourites"}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2"
        >
          {fav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
        </button>
      )}

      <Link to={`/courses/${course.id}`}>
        {course.image ? (
          <img src={course.image} alt={course.title} className="h-32 w-full object-cover" />
        ) : (
          <div className="h-32 w-full bg-gray-200" />
        )}
        <div className="p-4">
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{course.category}</span>
          <h3 className="mt-2 font-bold leading-snug">{course.title}</h3>
          <p className="text-sm text-gray-500">by {course.instructor}</p>
          <p className="mt-1 text-xs text-gray-500">{course.level} · {course.lessons.length} lessons</p>
          {isEnrolled(course.id) && (
            <div className="mt-3">
              <ProgressBar percent={percent} />
              <p className="mt-1 text-xs text-gray-500">{percent}% complete</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}