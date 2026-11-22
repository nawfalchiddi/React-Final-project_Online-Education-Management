import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../utils/Mycontext";
import ProgressBar from "./ProgressBar";

export default function CourseCard({ course }) {
  const { user, isFavourite, toggleFavourite, isEnrolled, getProgress } = useApp();
  const navigate = useNavigate();

  const fav = isFavourite(course.id);
  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course);

  function handleHeart() {
    if (user === null) {
      navigate("/login", { state: { from: "/courses/" + course.id } });
    } else {
      toggleFavourite(course.id);
    }
  }

  let showHeart = true;
  if (user !== null && user.role === "instructor") {
    showHeart = false;
  }

  let heartIcon = <FaRegHeart className="text-gray-600" />;
  let heartLabel = "Save to favourites";
  if (fav) {
    heartIcon = <FaHeart className="text-red-500" />;
    heartLabel = "Remove from favourites";
  }

  let picture = <div className="h-32 w-full bg-gray-200" />;
  if (course.image) {
    picture = <img src={course.image} alt={course.title} className="h-32 w-full object-cover" />;
  }

  let progressBox = null;
  if (enrolled) {
    progressBox = (
      <div className="mt-3">
        <ProgressBar percent={progress.percent} />
        <p className="mt-1 text-xs text-gray-500">{progress.percent}% complete</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl  bg-white shadow shadow-blue-500">
      {showHeart && (
        <button
          onClick={handleHeart}
          aria-label={heartLabel}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2"
        >
          {heartIcon}
        </button>
      )}

      <Link to={"/courses/" + course.id}>
        {picture}
        <div className="p-4">
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{course.category}</span>
          <h3 className="mt-2 font-bold leading-snug">{course.title}</h3>
          <p className="text-sm text-gray-500">by {course.instructor}</p>
          <p className="mt-1 text-xs text-gray-500">{course.level} · {course.lessons.length} lessons</p>
          {progressBox}
        </div>
      </Link>
    </div>
  );
}