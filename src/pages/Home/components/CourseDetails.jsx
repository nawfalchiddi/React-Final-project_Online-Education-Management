import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiEdit2, FiLock, FiPlayCircle } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, user, enroll, unenroll, isEnrolled, getEnrollment, getProgress, isFavourite, toggleFavourite } = useApp();

  // find the course
  let course = null;
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id === id) {
      course = courses[i];
    }
  }

  if (course === null) {
    return (
      <div className="py-20 text-center">
        <p>Course not found.</p>
        <Link to="/courses" className="text-blue-600">Back to catalog</Link>
      </div>
    );
  }

  // who is looking
  let isStudent = false;
  let isInstructor = false;
  let isOwner = false;
  if (user !== null) {
    if (user.role === "student") isStudent = true;
    if (user.role === "instructor") isInstructor = true;
    if (user.email === course.ownerEmail) isOwner = true;
  }

  const enrolled = isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);
  const progress = getProgress(course);
  const fav = isFavourite(course.id);

  let completed = [];
  if (enrollment !== null) {
    completed = enrollment.completed;
  }

  // continue wherewas the las course
  let continueId = null;
  if (enrollment !== null && enrollment.lastLessonId !== null) {
    for (let i = 0; i < course.lessons.length; i++) {
      if (course.lessons[i].id === enrollment.lastLessonId) {
        continueId = course.lessons[i].id;
      }
    }
  }
  if (continueId === null) {
    for (let i = 0; i < course.lessons.length; i++) {
      if (!completed.includes(course.lessons[i].id)) {
        continueId = course.lessons[i].id;
        break;
      }
    }
  }
  if (continueId === null && course.lessons.length > 0) {
    continueId = course.lessons[0].id;
  }

  function handleEnroll() {
    if (user === null) {
      navigate("/login", { state: { from: "/courses/" + course.id } }); // visitors log in first
    } else {
      enroll(course.id);
    }
  }

  function handleUnenroll() {
    if (window.confirm("Unenroll from this course? Your progress will be lost.")) {
      unenroll(course.id);
    }
  }

  function handleSave() {
    if (user === null) {
      navigate("/login", { state: { from: "/courses/" + course.id } });
    } else {
      toggleFavourite(course.id);
    }
  }

  let learnText = "Start learning";
  if (progress.done > 0) {
    learnText = "Continue learning";
  }

  let showEnroll = false;
  if (!enrolled && (user === null || isStudent)) {
    showEnroll = true;
  }

  let heartIcon = <FaRegHeart />;
  let heartText = "Save for later";
  if (fav) {
    heartIcon = <FaHeart className="text-red-500" />;
    heartText = "Saved";
  }

  const lessonRows = [];
  for (let i = 0; i < course.lessons.length; i++) {
    const lesson = course.lessons[i];
    const isDone = completed.includes(lesson.id);

    let open = false;
    if (enrolled || lesson.free || isOwner) {
      open = true;
    }

    let titleClass = "font-medium";
    if (isDone) {
      titleClass = "font-medium text-gray-400 line-through";
    }

    let previewBadge = null;
    if (lesson.free && !enrolled) {
      previewBadge = <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-green-700">Free preview</span>;
    }

    let rightSide;
    if (open) {
      let buttonText = "Open";
      if (lesson.free && !enrolled) {
        buttonText = "Preview";
      }
      rightSide = (
        <span className="flex items-center gap-3">
          {isDone && <FiCheckCircle className="text-green-600" />}
          <Link to={"/courses/" + course.id + "/lessons/" + lesson.id} className="rounded-lg border border-blue-600 px-3 py-1 text-sm font-semibold text-blue-600">
            {buttonText}
          </Link>
        </span>
      );
    } else {
      rightSide = <FiLock className="text-gray-400" title="Enroll to unlock" />;
    }

    lessonRows.push(
      <li key={lesson.id} className="flex items-center justify-between gap-3 border-b p-4 last:border-b-0">
        <div>
          <p className={titleClass}>{i + 1}. {lesson.title}</p>
          <p className="text-xs text-gray-500">
            {lesson.duration}
            {previewBadge}
          </p>
        </div>
        {rightSide}
      </li>
    );
  }

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
        {enrolled && continueId !== null && (
          <Link to={"/courses/" + course.id + "/lessons/" + continueId} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            <FiPlayCircle /> {learnText}
          </Link>
        )}
        {enrolled && (
          <button onClick={handleUnenroll} className="rounded-lg border px-4 py-2 text-sm">Unenroll</button>
        )}
        {showEnroll && (
          <button onClick={handleEnroll} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Enroll in this course
          </button>
        )}
        {isOwner && (
          <Link to={"/instructor/courses/" + course.id} className="flex items-center gap-2 rounded-lg border px-4 py-2">
            <FiEdit2 /> Edit course
          </Link>
        )}
        {!isInstructor && (
          <button onClick={handleSave} className="flex items-center gap-2 rounded-lg border px-4 py-2">
            {heartIcon}
            {heartText}
          </button>
        )}
      </div>

      {enrolled && (
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-2 text-sm font-semibold">{progress.done} of {progress.total} lessons completed ({progress.percent}%)</p>
          <ProgressBar percent={progress.percent} />
        </div>
      )}

      <div className="rounded-xl border bg-white">
        <h3 className="border-b p-4 font-bold">Lessons ({progress.total})</h3>
        {progress.total === 0 && <p className="p-4 text-sm text-gray-500">No lessons yet.</p>}
        <ul>{lessonRows}</ul>
      </div>
    </div>
  );
}