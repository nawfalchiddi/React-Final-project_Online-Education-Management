import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiEdit2, FiLock, FiPlayCircle } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, user, enroll, unenroll, isEnrolled, getEnrollment, getProgress, isFavourite, toggleFavourite } = useApp();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p>Course not found.</p>
        <Link to="/courses" className="text-blue-600">Back to catalog</Link>
      </div>
    );
  }

  const isStudent = user?.role === "student";
  const isOwner = user?.email === course.ownerEmail;
  const enrolled = isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);
  const completed = enrollment?.completed || [];
  const { done, total, percent } = getProgress(course);
  const fav = isFavourite(course.id);

  const lastOk = course.lessons.some((l) => l.id === enrollment?.lastLessonId);
  const continueId = lastOk
    ? enrollment.lastLessonId
    : (course.lessons.find((l) => !completed.includes(l.id)) || course.lessons[0])?.id;

  const handleEnroll = () => {
    if (!user) navigate("/login", { state: { from: `/courses/${course.id}` } })
    else enroll(course.id);
  };

  const handleUnenroll = () => {
    if (window.confirm("Unenroll from this course? Your progress will be lost.")) unenroll(course.id);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/courses" className="flex items-center gap-1 text-sm text-blue-600">
        <FiArrowLeft /> Back to courses
      </Link>

      <div>
        {course.image && <img src={course.image} alt={course.title} className="h-56 w-full rounded-2xl object-cover" />}
        <h2 className="mt-4 text-2xl font-bold">{course.title}</h2>
        <p className="text-sm text-gray-500">by {course.instructor} · {course.level} · {course.category}</p>
      </div>

      <p className="text-gray-600">{course.description}</p>

      <div className="flex flex-wrap items-center gap-3">
        {enrolled && continueId && (
          <Link to={`/courses/${course.id}/lessons/${continueId}`} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            <FiPlayCircle /> {done > 0 ? "Continue learning" : "Start learning"}
          </Link>
        )}
        {enrolled && (
          <button onClick={handleUnenroll} className="rounded-lg border px-4 py-2 text-sm">Unenroll</button>
        )}
        {!enrolled && (!user || isStudent) && (
          <button onClick={handleEnroll} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Enroll in this course
          </button>
        )}
        {isOwner && (
          <Link to={`/instructor/courses/${course.id}`} className="flex items-center gap-2 rounded-lg border px-4 py-2">
            <FiEdit2 /> Edit course
          </Link>
        )}
        {user?.role !== "instructor" && (
          <button
            onClick={() => (user ? toggleFavourite(course.id) : navigate("/login", { state: { from: `/courses/${course.id}` } }))}
            className="flex items-center gap-2 rounded-lg border px-4 py-2"
          >
            {fav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            {fav ? "Saved" : "Save for later"}
          </button>
        )}
      </div>

      {enrolled && (
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-2 text-sm font-semibold">{done} of {total} lessons completed ({percent}%)</p>
          <ProgressBar percent={percent} />
        </div>
      )}

      <div className="rounded-xl border bg-white">
        <h3 className="border-b p-4 font-bold">Lessons ({total})</h3>
        {total === 0 && <p className="p-4 text-sm text-gray-500">No lessons yet.</p>}
        <ul>
          {course.lessons.map((lesson, i) => {
            const open = enrolled || lesson.free || isOwner; // locked if not enrolled (first lesson = free preview)
            const isDone = completed.includes(lesson.id);
            return (
              <li key={lesson.id} className="flex items-center justify-between gap-3 border-b p-4 last:border-b-0">
                <div>
                  <p className={`font-medium ${isDone ? "text-gray-400 line-through" : ""}`}>{i + 1}. {lesson.title}</p>
                  <p className="text-xs text-gray-500">
                    {lesson.duration}
                    {lesson.free && !enrolled && <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-green-700">Free preview</span>}
                  </p>
                </div>
                {open ? (
                  <span className="flex items-center gap-3">
                    {isDone && <FiCheckCircle className="text-green-600" />}
                    <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="rounded-lg border border-blue-600 px-3 py-1 text-sm font-semibold text-blue-600">
                      {lesson.free && !enrolled ? "Preview" : "Open"}
                    </Link>
                  </span>
                ) : (
                  <FiLock className="text-gray-400" title="Enroll to unlock" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}